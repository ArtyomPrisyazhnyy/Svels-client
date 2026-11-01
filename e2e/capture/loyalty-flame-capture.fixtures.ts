import type { LoyaltyBalance } from '../../src/shared/types/loyalty-balance';
import type { OrderDto } from '../../src/shared/types/pre-order';
import type { AuthResponse } from '../../src/shared/types/auth';

export const CAPTURE_RESTAURANT_ID = '00000000-0000-4000-8000-000000000001';

export const ARTIFACT_SCREENSHOTS_DIR = '/opt/cursor/artifacts/screenshots';

export const CAPTURE_THEMES = ['classic', 'midnight', 'monochrome', 'ocean'] as const;

export const FLAME_HEADER_STATES = [
  { key: 'off', testId: 'loyalty-flame-state-off' },
  { key: 'base', testId: 'loyalty-flame-state-base' },
  { key: 'tier1', testId: 'loyalty-flame-state-tier-1' },
  { key: 'tier5', testId: 'loyalty-flame-state-tier-5' },
] as const;

export const MOCK_LOYALTY_BALANCE: LoyaltyBalance = {
  restaurantId: CAPTURE_RESTAURANT_ID,
  userId: '00000000-0000-4000-8000-000000000099',
  enabled: true,
  rewardsEnabled: true,
  visits: 4,
  totalVisits: 12,
  lastVisitAt: '2026-10-20T12:00:00.000Z',
  expiresAt: '2026-11-03T12:00:00.000Z',
  currentLevel: { id: 'level-1', name: 'Искра', requiredVisits: 3 },
  nextLevel: {
    id: 'level-2',
    name: 'Пламя',
    requiredVisits: 7,
    visitsLeft: 3,
  },
  availableRewards: [],
  streakStartedAt: '2026-10-18T09:00:00.000Z',
  streakDays: 4,
  longestStreak: 11,
  status: 'active',
};

/** 2026-06-15T21:30:00Z → 16.06.2026, 00:30 in Europe/Minsk */
export const MOCK_GUEST_ORDERS: OrderDto[] = [
  {
    id: '00000000-0000-4000-8000-000000000201',
    restaurantId: CAPTURE_RESTAURANT_ID,
    orderNumber: 1042,
    status: 'preparing',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    fulfillmentType: 'delivery',
    totalAmount: 42.5,
    createdAt: '2026-06-15T21:30:00.000Z',
    updatedAt: '2026-06-15T21:30:00.000Z',
    statusChangedAt: '2026-06-15T21:35:00.000Z',
    requestedAt: '2026-06-15T22:00:00.000Z',
    customerName: 'Алекс',
    customerPhone: '+375290000001',
    recipientName: null,
    recipientPhone: null,
    locationId: null,
    comment: null,
    bookingId: null,
    deliveryAddress: {
      street: 'Ленина',
      house: '10',
      apartment: '5',
      entrance: '',
      floor: '',
      intercom: '',
      comment: '',
    },
    items: [
      {
        id: 'line-1',
        menuItemId: 'item-1',
        name: 'Борщ',
        quantity: 1,
        unitPrice: 18,
        lineTotal: 18,
        modifiers: [],
      },
    ],
    cancelReason: null,
  },
  {
    id: '00000000-0000-4000-8000-000000000202',
    restaurantId: CAPTURE_RESTAURANT_ID,
    orderNumber: 1039,
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    fulfillmentType: 'takeaway',
    totalAmount: 24,
    createdAt: '2026-06-10T08:15:00.000Z',
    updatedAt: '2026-06-10T08:15:00.000Z',
    statusChangedAt: '2026-06-10T09:00:00.000Z',
    requestedAt: null,
    customerName: 'Алекс',
    customerPhone: '+375290000001',
    recipientName: null,
    recipientPhone: null,
    locationId: null,
    comment: null,
    bookingId: null,
    deliveryAddress: null,
    items: [
      {
        id: 'line-2',
        menuItemId: 'item-2',
        name: 'Кофе',
        quantity: 2,
        unitPrice: 12,
        lineTotal: 24,
        modifiers: [],
      },
    ],
    cancelReason: null,
  },
];

export const MOCK_GUEST_AUTH: AuthResponse = {
  accessToken: 'e2e-capture-guest-token',
  user: {
    id: '00000000-0000-4000-8000-000000000099',
    email: 'capture.guest@svels.test',
    phone: '+375290000001',
    firstName: 'Capture',
    lastName: 'Guest',
    role: 'user',
    authProvider: 'local',
    restaurantId: CAPTURE_RESTAURANT_ID,
  },
};

export async function mockGuestCaptureApi(page: import('@playwright/test').Page): Promise<void> {
  await page.route('**/users/me/pre-orders', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_GUEST_ORDERS),
    });
  });

  await page.route(`**/restaurants/${CAPTURE_RESTAURANT_ID}/loyalty/me`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_LOYALTY_BALANCE),
    });
  });
}

export function guestAuthInitScript(auth: AuthResponse): string {
  const payload = JSON.stringify({
    state: {
      accessToken: auth.accessToken,
      user: auth.user,
    },
    version: 0,
  });
  return `window.localStorage.setItem('svels-auth', ${JSON.stringify(payload)});`;
}
