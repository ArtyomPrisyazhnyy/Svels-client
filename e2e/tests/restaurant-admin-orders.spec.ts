import { test, expect, apiClient } from '../fixtures/test';
import { getApiUrl } from '../helpers/env';
import { injectAuth } from '../helpers/auth';
import type { CreatePreOrderPayload, OrderDto } from '../../src/shared/types/pre-order';

async function staffApi<T>(
  method: string,
  pathname: string,
  token: string,
  body?: unknown,
): Promise<T> {
  const response = await fetch(`${getApiUrl()}${pathname}`, {
    method,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  const data = text ? (JSON.parse(text) as unknown) : null;
  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'message' in data
        ? String((data as { message: unknown }).message)
        : text || response.statusText;
    const error = new Error(`${method} ${pathname} → ${response.status}: ${message}`) as Error & {
      status: number;
      code?: string;
    };
    error.status = response.status;
    if (data && typeof data === 'object' && 'code' in data && typeof (data as { code: unknown }).code === 'string') {
      error.code = (data as { code: string }).code;
    }
    throw error;
  }
  return data as T;
}

async function ensureOrderableMenu(restaurantId: string, adminToken: string): Promise<string> {
  await apiClient.setOrderSettings(restaurantId, adminToken, {
    fulfillmentTakeaway: true,
    paymentCash: true,
  });

  const menu = await apiClient.getMenu(restaurantId);
  const existing = menu.categories.flatMap((c) => c.items)[0];
  if (existing) {
    return existing.id;
  }

  const category = await apiClient.createMenuCategory(restaurantId, adminToken, `E2E ${Date.now()}`);
  const item = (await apiClient.createMenuItem(restaurantId, adminToken, {
    categoryId: category.id,
    name: `Блюдо ${Date.now()}`,
    price: 12.5,
    description: 'e2e',
    imageUrl: 'https://example.com/e2e-item.jpg',
  })) as { id: string };
  return item.id;
}

async function buildOrderPayload(
  restaurantId: string,
  adminToken: string,
  menuItemId: string,
): Promise<CreatePreOrderPayload> {
  const locations = await apiClient.listRestaurantLocations(restaurantId, adminToken);
  const locationId = locations[0]?.id;
  if (!locationId) {
    throw new Error('E2E restaurant must have at least one location for pre-orders');
  }

  return {
    fulfillmentType: 'takeaway',
    paymentMethod: 'cash',
    items: [{ menuItemId, quantity: 1 }],
    customerName: 'E2E Гость',
    customerPhone: '+375291234567',
    locationId,
  };
}

test.describe('Restaurant admin orders', () => {
  test('гостевой заказ появляется в админке и принимается', async ({ page, seed, asRestaurantAdmin }) => {
    void asRestaurantAdmin;

    const menuItemId = await ensureOrderableMenu(
      seed.restaurantId,
      seed.restaurantAdmin.auth.accessToken,
    );
    const { auth: guestAuth } = await apiClient.createGuest(seed.restaurantId, 'Order', 'Guest');
    const created = await apiClient.createOrder(
      seed.restaurantId,
      guestAuth.accessToken,
      await buildOrderPayload(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, menuItemId),
    );

    await page.goto('/restaurant-admin/orders');
    await expect(page.getByTestId('orders-admin-page')).toBeVisible();

    const card = page.getByTestId(`order-card-${created.id}`);
    await expect(card).toBeVisible({ timeout: 15_000 });

    await card.getByTestId('order-action-accepted').click();

    await expect.poll(
      async () => {
        const order = await staffApi<OrderDto>(
          'GET',
          `/restaurants/${seed.restaurantId}/pre-orders/${created.id}`,
          seed.restaurantAdmin.auth.accessToken,
        );
        return order.status;
      },
      { timeout: 15_000 },
    ).toBe('accepted');
  });

  test('у restaurant_production нет кнопки «Отменить»', async ({ page, seed }) => {
    const menuItemId = await ensureOrderableMenu(
      seed.restaurantId,
      seed.restaurantAdmin.auth.accessToken,
    );
    const { auth: guestAuth } = await apiClient.createGuest(seed.restaurantId, 'Prod', 'Guest');
    const created = await apiClient.createOrder(
      seed.restaurantId,
      guestAuth.accessToken,
      await buildOrderPayload(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, menuItemId),
    );

    await injectAuth(page, seed.restaurantProduction.auth);
    await page.goto('/restaurant-admin/orders');

    const card = page.getByTestId(`order-card-${created.id}`);
    await expect(card).toBeVisible({ timeout: 15_000 });
    await expect(card.getByTestId('order-action-cancel')).toHaveCount(0);
  });

  test('при паузе создание заказа через API возвращает 409', async ({ seed }) => {
    const adminToken = seed.restaurantAdmin.auth.accessToken;
    const menuItemId = await ensureOrderableMenu(seed.restaurantId, adminToken);

    await staffApi('PATCH', `/restaurants/${seed.restaurantId}/order-settings/pause`, adminToken, {
      ordersPaused: true,
    });

    const { auth: guestAuth } = await apiClient.createGuest(seed.restaurantId, 'Pause', 'Guest');

    let caught: (Error & { status?: number; code?: string }) | null = null;
    try {
      await apiClient.createOrder(
        seed.restaurantId,
        guestAuth.accessToken,
        await buildOrderPayload(seed.restaurantId, adminToken, menuItemId),
      );
    } catch (error) {
      caught = error as Error & { status?: number; code?: string };
    }

    expect(caught).not.toBeNull();
    expect(String(caught?.message ?? '')).toMatch(/409/);

    await staffApi('PATCH', `/restaurants/${seed.restaurantId}/order-settings/pause`, adminToken, {
      ordersPaused: false,
    });
  });
});
