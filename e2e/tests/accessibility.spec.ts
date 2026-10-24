import { test, expect } from '../fixtures/test';
import { expectNoContrastViolations, expectNoSeriousAxeViolations } from '../helpers/a11y';
import { ALL_COLOR_THEMES } from '../helpers/color-themes';
import { apiClient } from '../helpers/api';
import { revalidateRestaurantPublicPage } from '../helpers/revalidate-public-page';
import type { RestaurantColorTheme } from '../../src/shared/types/restaurant-styling';
import type { CartLineItem } from '../../src/shared/types/cart';

const VENUE_GUEST_PATHS = [
  { path: '', readyTestId: 'restaurant-public-page', label: 'venue-home' },
  { path: '/account', readyTestId: 'guest-account-page', label: 'venue-account', needsGuest: true },
  { path: '/favorites', readyTestId: 'guest-favorites-page', label: 'venue-favorites' },
  { path: '/pre-order', readyTestId: 'preorder-page', label: 'venue-preorder', needsGuest: true },
  { path: '/auth', readyTestId: 'guest-otp-phone-form', label: 'venue-auth' },
  { path: '/legal', readyTestId: 'restaurant-legal-page', label: 'venue-legal' },
] as const;

const RESTAURANT_ADMIN_PATHS = [
  '/restaurant-admin/legal',
  '/restaurant-admin/menu',
  '/restaurant-admin/order-settings',
  '/restaurant-admin/branding',
  '/restaurant-admin/styling',
  '/restaurant-admin/orders',
] as const;

function buildLine(): CartLineItem {
  return {
    id: 'a11y-line-1',
    lineKey: 'a11y-1',
    menuItemId: 'a11y-item-1',
    name: 'Блюдо для a11y',
    variantLabel: null,
    quantity: 1,
    unitPrice: 10,
    imageUrl: '',
    imageWebpUrl: null,
    modifiers: [],
    modifierSelections: {},
  };
}

async function seedCart(page: import('@playwright/test').Page, restaurantId: string) {
  await page.addInitScript(
    ({ rid, cartItems }) => {
      window.localStorage.setItem(
        'svels-cart',
        JSON.stringify({
          state: {
            version: 2,
            restaurantId: rid,
            items: cartItems,
            checkoutByRestaurant: {},
          },
          version: 2,
        }),
      );
    },
    { rid: restaurantId, cartItems: [buildLine()] },
  );
}

async function applyVenueTheme(
  restaurantId: string,
  adminToken: string,
  theme: RestaurantColorTheme,
) {
  const switcherStyle =
    theme === 'midnight' ? 'segmented' : theme === 'warm' ? 'tabs' : 'pill';
  await apiClient.patchStyling(restaurantId, adminToken, {
    colorTheme: theme,
    cardStyle: 'classic',
    headerStyle: 'solid',
    switcherStyle,
    menuCategoryNavEnabled: false,
  });
  await revalidateRestaurantPublicPage(restaurantId);
}

test.describe('Accessibility (axe)', () => {
  test('landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('landing-page')).toBeVisible();
    await expectNoSeriousAxeViolations(page);
  });

  test('skip link focuses main content', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Перейти к содержимому' });
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
  });

  for (const route of VENUE_GUEST_PATHS) {
    test(`venue ${route.label}`, async ({ page, seed, asGuest }) => {
      if ('needsGuest' in route && route.needsGuest) {
        void asGuest;
      }
      if (route.path === '/auth') {
        await page.context().clearCookies();
        await page.addInitScript(() => {
          localStorage.clear();
          sessionStorage.clear();
        });
      }
      await page.goto(`/restaurants/${seed.restaurantId}${route.path}`);
      await expect(page.getByTestId(route.readyTestId)).toBeVisible({ timeout: 30_000 });
      await expectNoSeriousAxeViolations(page);
    });
  }

  for (const adminPath of RESTAURANT_ADMIN_PATHS) {
    test(`restaurant admin ${adminPath}`, async ({ page, asRestaurantAdmin }) => {
      void asRestaurantAdmin;
      await page.goto(adminPath);
      await expect(page.locator('#main-content')).toBeVisible({ timeout: 30_000 });
      await expectNoSeriousAxeViolations(page);
    });
  }

  test('super admin', async ({ page, asSuperAdmin }) => {
    void asSuperAdmin;
    await page.goto('/admin');
    await expect(page.getByTestId('super-admin-page')).toBeVisible({ timeout: 30_000 });
    await expectNoSeriousAxeViolations(page);
  });

  test('UI playground primitives board', async ({ page }) => {
    await page.goto('/dev/ui?theme=classic', { waitUntil: 'networkidle' });
    await expect(page.getByTestId('ui-primitives-board')).toBeVisible();
    await expectNoSeriousAxeViolations(page);
  });

  test('cart checkout form in modal', async ({ page, seed, asGuest }) => {
    void asGuest;
    await seedCart(page, seed.restaurantId);
    await page.goto(`/restaurants/${seed.restaurantId}`);
    await page.getByTestId('cart-button').click();
    await expect(page.getByTestId('restaurant-cart-modal')).toBeVisible();
    await expectNoSeriousAxeViolations(page);
  });

  test('guest auth modal from header', async ({ page, seed }) => {
    await page.goto(`/restaurants/${seed.restaurantId}`);
    await page.getByTestId('guest-profile-button').click();
    await expect(page.getByTestId('restaurant-auth-modal')).toBeVisible();
    await expectNoSeriousAxeViolations(page);
  });

  test('landing contact modal form', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Оставить заявку' }).first().click();
    await expect(page.getByRole('dialog', { name: 'Оставить заявку' })).toBeVisible();
    await expectNoSeriousAxeViolations(page);
  });
});

test.describe('Color contrast (axe) — all venue themes', () => {
  for (const theme of ALL_COLOR_THEMES) {
    test(`venue home @ ${theme}`, async ({ page }) => {
      await page.goto(`/dev/ui?theme=${theme}`, { waitUntil: 'networkidle' });
      await expect(page.getByTestId('ui-primitives-board')).toBeVisible();
      await expectNoContrastViolations(page);
    });
  }
});
