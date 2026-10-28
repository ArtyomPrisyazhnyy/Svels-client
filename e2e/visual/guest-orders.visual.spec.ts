import { test, expect, apiClient } from '../fixtures/test';
import { injectAuth } from '../helpers/auth';
import { seedVisualCancelledGuestOrder } from '../helpers/guest-orders-visual-seed';
import { revalidateRestaurantPublicPage } from '../helpers/revalidate-public-page';
import { prepareForScreenshot, VIEWPORTS } from '../helpers/visual';
import type { RestaurantColorTheme } from '../../src/shared/types/restaurant-styling';

const THEMES: RestaurantColorTheme[] = ['classic', 'midnight', 'neon', 'citrus'];
const VIEWPORT_KEYS = ['m390', 'd1280'] as const;

let visualOrderSeed: Awaited<ReturnType<typeof seedVisualCancelledGuestOrder>> | null = null;
let appliedTheme: RestaurantColorTheme | null = null;

async function ensureVisualOrder(seed: {
  restaurantId: string;
  restaurantAdmin: { auth: { accessToken: string } };
}): Promise<NonNullable<typeof visualOrderSeed>> {
  if (visualOrderSeed) {
    return visualOrderSeed;
  }
  visualOrderSeed = await seedVisualCancelledGuestOrder(
    seed.restaurantId,
    seed.restaurantAdmin.auth.accessToken,
  );
  return visualOrderSeed;
}

async function applyTheme(
  restaurantId: string,
  adminToken: string,
  theme: RestaurantColorTheme,
): Promise<void> {
  if (appliedTheme === theme) {
    return;
  }
  const switcherStyle =
    theme === 'midnight' ? 'segmented' : theme === 'neon' ? 'tabs' : 'pill';
  await apiClient.patchStyling(restaurantId, adminToken, {
    colorTheme: theme,
    cardStyle: 'classic',
    headerStyle: 'glass',
    switcherStyle,
  });
  await revalidateRestaurantPublicPage(restaurantId);
  appliedTheme = theme;
}

test.describe('Guest order detail visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  for (const theme of THEMES) {
    for (const viewportKey of VIEWPORT_KEYS) {
      test(`cancelled detail ${theme} @${viewportKey}`, async ({ page, seed }) => {
        const orderSeed = await ensureVisualOrder(seed);
        await applyTheme(
          seed.restaurantId,
          seed.restaurantAdmin.auth.accessToken,
          theme,
        );

        await page.setViewportSize(VIEWPORTS[viewportKey]);
        await injectAuth(page, orderSeed.guestAuth);
        await page.goto(`/restaurants/${seed.restaurantId}/pre-order`);
        await expect(page.getByTestId('guest-orders-list')).toBeVisible({ timeout: 30_000 });
        await page.getByTestId(`guest-order-row-${orderSeed.orderNumber}`).click();
        const detail = page.getByTestId('guest-order-detail');
        await expect(detail).toBeVisible();
        await expect(detail.getByTestId('guest-order-cancel-reason')).toContainText(
          'Заведение отклонило заказ',
        );
        await expect(detail.getByTestId('order-line-options')).toHaveCount(2);

        await prepareForScreenshot(page);
        await expect(detail).toHaveScreenshot(`guest-order-detail-${theme}-${viewportKey}.png`);
      });
    }
  }
});
