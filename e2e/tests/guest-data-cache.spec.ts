import type { Page } from '@playwright/test';
import { test, expect, apiClient } from '../fixtures/test';
import { injectAuth } from '../helpers/auth';
import { assertE2ETestPhone, E2E_TEST_PHONES } from '../helpers/test-phones';
import type { CreatePreOrderPayload } from '../../src/shared/types/pre-order';
import { getApiUrl } from '../helpers/env';

const SLOW_API_MS = 3_000;

interface SlowGate {
  seen: number;
  released: number;
  release: () => void;
}

async function createAllowedGuest(restaurantId: string) {
  let lastError: unknown;
  for (const phone of E2E_TEST_PHONES) {
    assertE2ETestPhone(phone);
    try {
      const created = await apiClient.createGuest(restaurantId, 'Cache', 'Guest', phone);
      if (created.auth.user.restaurantId === restaurantId) {
        return created;
      }
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error('No free +375 29 000-00-0X phone');
}

function futureUtcDate(daysAhead: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + daysAhead);
  return date.toISOString().slice(0, 10);
}

async function ensureOpenEveryDay(restaurantId: string, token: string): Promise<void> {
  for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek += 1) {
    const response = await fetch(`${getApiUrl()}/restaurants/${restaurantId}/schedules`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({
        dayOfWeek,
        openTime: '00:00',
        closeTime: '23:59',
        isOpen: true,
      }),
    });
    if (!response.ok && response.status !== 409) {
      const text = await response.text();
      throw new Error(`POST schedules → ${response.status}: ${text}`);
    }
  }
}

async function holdSlowGets(page: Page, urlPart: string): Promise<SlowGate> {
  const gate: SlowGate = {
    seen: 0,
    released: 0,
    release: () => {},
  };
  const pending: Array<() => void> = [];
  gate.release = () => {
    for (const resolve of pending.splice(0)) {
      resolve();
    }
  };

  await page.route(`**${urlPart}**`, async (route) => {
    const request = route.request();
    if (request.method() !== 'GET') {
      await route.continue();
      return;
    }
    gate.seen += 1;
    await new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, SLOW_API_MS);
      pending.push(() => {
        clearTimeout(timer);
        resolve();
      });
    });
    gate.released += 1;
    await route.continue();
  });

  return gate;
}

test.describe('Guest orders and bookings cache', () => {
  test('повторный заход показывает кэш сразу, пока API отвечает 3 секунды', async ({
    page,
    seed,
  }) => {
    const adminToken = seed.restaurantAdmin.auth.accessToken;
    try {
    const { auth: guest, phone } = await createAllowedGuest(seed.restaurantId);
    assertE2ETestPhone(phone);

    const locations = await apiClient.listRestaurantLocations(seed.restaurantId, adminToken);
    const locationId = locations[0]?.id;
    test.skip(!locationId, 'Seeded restaurant has no location');

    await apiClient.setOrderSettings(seed.restaurantId, adminToken, {
      fulfillmentTakeaway: true,
      paymentCash: true,
    });
    await apiClient.setOrdersPaused(seed.restaurantId, adminToken, false);
    await apiClient.updateBookingSettings(seed.restaurantId, adminToken, {
      bookingEnabled: true,
      mode: 'by_seats',
      autoConfirm: true,
    });

    const orderPayload: CreatePreOrderPayload = {
      fulfillmentType: 'takeaway',
      paymentMethod: 'cash',
      items: [{ menuItemId: seed.menu.defaultMenuItemId, quantity: 1 }],
      customerName: 'Cache Guest',
      customerPhone: phone,
      locationId,
    };
    const order = await apiClient.createOrder(seed.restaurantId, guest.accessToken, orderPayload);

    await ensureOpenEveryDay(seed.restaurantId, adminToken);
    const bookingDate = futureUtcDate(2);
    const availability = await apiClient.getBookingAvailability(seed.restaurantId, bookingDate);
    const slot = availability.slots[0];
    test.skip(!slot, 'No booking slots for tomorrow');
    const booking = await apiClient.createBooking(seed.restaurantId, guest.accessToken, {
      bookingDate,
      bookingTime: slot,
      guestCount: 2,
    });

    const ordersUrl = `/restaurants/${seed.restaurantId}/pre-order`;
    const accountUrl = `/restaurants/${seed.restaurantId}/account`;
    const orderRow = page.getByTestId(`guest-order-row-${order.orderNumber}`);
    const bookingRow = page.getByTestId(`guest-booking-${booking.id}`);

    await injectAuth(page, guest);

    const ordersRequest = page.waitForRequest(
      (request) =>
        request.method() === 'GET' && request.url().includes('/users/me/pre-orders'),
    );
    await page.goto(ordersUrl);
    const firstOrdersRequest = await ordersRequest;
    expect(new URL(firstOrdersRequest.url()).searchParams.get('restaurantId')).toBe(
      seed.restaurantId,
    );
    await expect(orderRow).toBeVisible({ timeout: 15_000 });

    await page.goto(accountUrl);
    await expect(bookingRow).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('guest-account-page')).toContainText('000-00-0');

    const stored = await page.evaluate(() => window.localStorage.getItem('svels-guest-data'));
    expect(stored).toBeTruthy();
    const persisted = JSON.parse(stored ?? '{}') as {
      version?: number;
      state?: { ownerUserId?: string };
    };
    expect(persisted.version).toBe(1);
    expect(persisted.state?.ownerUserId).toBe(guest.user.id);

    const slowOrders = await holdSlowGets(page, '/users/me/pre-orders');
    const slowBookings = await holdSlowGets(page, '/users/me/bookings');

    await page.goto(ordersUrl, { waitUntil: 'domcontentloaded' });
    await expect(orderRow).toBeVisible({ timeout: 2_000 });
    await expect(page.getByTestId('guest-orders-list-skeleton')).toHaveCount(0);
    await expect(page.getByTestId('guest-preorder-skeleton')).toHaveCount(0);
    expect(slowOrders.released).toBe(0);

    await page.goto(accountUrl, { waitUntil: 'domcontentloaded' });
    await expect(bookingRow).toBeVisible({ timeout: 2_000 });
    await expect(page.getByTestId('guest-account-bookings-skeleton')).toHaveCount(0);
    expect(slowBookings.released).toBe(0);

    slowOrders.release();
    slowBookings.release();
    if (slowOrders.seen > 0) {
      await expect.poll(() => slowOrders.released).toBe(slowOrders.seen);
    }
    if (slowBookings.seen > 0) {
      await expect.poll(() => slowBookings.released).toBe(slowBookings.seen);
    }

    await page.getByTestId('guest-logout-button').click();
    await expect(page).toHaveURL(new RegExp(`/restaurants/${seed.restaurantId}/?$`));
    await expect.poll(async () => {
      return page.evaluate(() => {
        const raw = window.localStorage.getItem('svels-guest-data');
        if (!raw) {
          return true;
        }
        const parsed = JSON.parse(raw) as {
          state?: { ordersByKey?: object; bookingsByKey?: object; ownerUserId?: string | null };
        };
        const orders = parsed.state?.ordersByKey ?? {};
        const bookings = parsed.state?.bookingsByKey ?? {};
        return Object.keys(orders).length === 0 && Object.keys(bookings).length === 0;
      });
    }).toBe(true);
    } finally {
      // The suite shares one restaurant. Leave booking off and the day open
      // so later order and footer screenshots match the seeded venue.
      await apiClient.updateBookingSettings(seed.restaurantId, adminToken, {
        bookingEnabled: false,
      });
    }
  });
});
