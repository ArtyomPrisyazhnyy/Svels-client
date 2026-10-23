import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '../fixtures/test';
import { E2E_RESTAURANT_COLOR_THEMES } from '../helpers/restaurant-themes';
import { revalidateRestaurantPublicPage } from '../helpers/revalidate-public-page';
import { apiClient } from '../fixtures/test';
import type { RestaurantColorTheme } from '../../src/shared/types/restaurant-styling';

const VIEWPORT = { width: 390, height: 844 };

async function applyTheme(
  restaurantId: string,
  adminToken: string,
  theme: RestaurantColorTheme,
) {
  const switcherStyle =
    theme === 'midnight' || theme === 'obsidian' || theme === 'ember' ? 'segmented' : 'pill';
  await apiClient.patchStyling(restaurantId, adminToken, {
    colorTheme: theme,
    cardStyle: 'classic',
    headerStyle: 'glass',
    switcherStyle,
  });
  await revalidateRestaurantPublicPage(restaurantId);
}

async function expectNoColorContrastViolations(
  page: import('@playwright/test').Page,
  context: string,
) {
  const results = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
  expect(
    results.violations,
    `${context}: ${JSON.stringify(results.violations, null, 2)}`,
  ).toEqual([]);
}

test.describe('Color contrast (axe)', () => {
  test('landing @ 390', async ({ page }) => {
    await page.setViewportSize(VIEWPORT);
    await page.goto('/', { waitUntil: 'networkidle' });
    await expectNoColorContrastViolations(page, 'landing');
  });

  for (const theme of E2E_RESTAURANT_COLOR_THEMES) {
    test.describe(`theme: ${theme}`, () => {
      test.beforeEach(async ({ page, seed }) => {
        await page.setViewportSize(VIEWPORT);
        await applyTheme(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, theme);
      });

      test('venue menu', async ({ page, seed }) => {
        await page.goto(`/restaurants/${seed.restaurantId}`, { waitUntil: 'networkidle' });
        await expect(page.getByTestId('restaurant-public-page')).toBeVisible();
        await expectNoColorContrastViolations(page, `menu/${theme}`);
      });

      test('product modal, cart, and checkout', async ({ page, seed, asGuest }) => {
        void asGuest;
        const menu = await apiClient.getMenu(seed.restaurantId);
        const menuItemId = menu.categories.flatMap((category) => category.items)[0]?.id;
        test.skip(!menuItemId, 'Need a menu item in seeded restaurant');

        await page.goto(`/restaurants/${seed.restaurantId}`, { waitUntil: 'networkidle' });
        await page.getByTestId(`menu-item-${menuItemId}`).click();
        await expect(page.getByTestId('menu-product-modal')).toBeVisible();
        await expectNoColorContrastViolations(page, `product/${theme}`);

        await page.getByTestId('menu-add-to-cart').click();
        await page.getByTestId('cart-button').click();
        await expect(page.getByTestId('restaurant-cart-modal')).toBeVisible();
        await expectNoColorContrastViolations(page, `cart/${theme}`);

        const checkoutCta = page.getByTestId('cart-checkout-submit');
        if (await checkoutCta.isVisible()) {
          await checkoutCta.click();
          await expectNoColorContrastViolations(page, `checkout/${theme}`);
        }
      });

      test('guest order status (pre-order)', async ({ page, seed, asGuest }) => {
        void asGuest;
        await page.goto(`/restaurants/${seed.restaurantId}/pre-order`, {
          waitUntil: 'networkidle',
        });
        await expect(page.getByTestId('preorder-page')).toBeVisible();
        await expectNoColorContrastViolations(page, `order-status/${theme}`);
      });

      test('error state playground', async ({ page }) => {
        await page.goto(`/dev/ui/errors?theme=${theme}&variant=network`, {
          waitUntil: 'networkidle',
        });
        await expect(page.getByTestId('dev-error-network')).toBeVisible();
        await expectNoColorContrastViolations(page, `error-network/${theme}`);
      });
    });
  }

  test.describe('admin surfaces @ 390', () => {
    test('/restaurant-admin/menu', async ({ page, asRestaurantAdmin }) => {
      void asRestaurantAdmin;
      await page.setViewportSize(VIEWPORT);
      await page.goto('/restaurant-admin/menu', { waitUntil: 'networkidle' });
      await expect(page.getByTestId('restaurant-admin-layout')).toBeVisible();
      await expectNoColorContrastViolations(page, 'admin/restaurant-admin/menu');
    });

    test('/restaurant-admin/orders', async ({ page, asRestaurantAdmin }) => {
      void asRestaurantAdmin;
      await page.setViewportSize(VIEWPORT);
      await page.goto('/restaurant-admin/orders', { waitUntil: 'networkidle' });
      await expectNoColorContrastViolations(page, 'admin/restaurant-admin/orders');
    });

    test('/restaurant-admin/styling', async ({ page, asRestaurantAdmin }) => {
      void asRestaurantAdmin;
      await page.setViewportSize(VIEWPORT);
      await page.goto('/restaurant-admin/styling', { waitUntil: 'networkidle' });
      await expectNoColorContrastViolations(page, 'admin/restaurant-admin/styling');
    });

    test('/admin', async ({ page, asSuperAdmin }) => {
      void asSuperAdmin;
      await page.setViewportSize(VIEWPORT);
      await page.goto('/admin', { waitUntil: 'networkidle' });
      await expectNoColorContrastViolations(page, 'admin/super-admin');
    });
  });
});
