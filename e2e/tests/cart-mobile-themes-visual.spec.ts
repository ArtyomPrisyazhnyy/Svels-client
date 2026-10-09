import { test, expect, apiClient } from '../fixtures/test';
import { revalidateRestaurantPublicPage } from '../helpers/revalidate-public-page';
import { assertCartPanelBackgroundIsOpaque } from '../helpers/cart-layout-overlap';
import type { CartLineItem } from '../../src/shared/types/cart';
import type { RestaurantColorTheme } from '../../src/shared/types/restaurant-styling';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/opt/cursor/artifacts/cart-mobile-v2/themes';

const COLOR_THEMES: RestaurantColorTheme[] = [
  'classic',
  'ocean',
  'forest',
  'warm',
  'berry',
  'lavender',
  'midnight',
  'ember',
  'obsidian',
  'moss',
  'wine',
  'sand',
  'citrus',
  'graphite',
  'monochrome',
  'monochromeDark',
  'neon',
];

function buildStressLine(): CartLineItem {
  return {
    id: 'theme-line-1',
    lineKey: 'theme-1',
    menuItemId: 'theme-item-1',
    name: 'Очень длинное название блюда с модификаторами и вариантом',
    variantLabel: 'Большая порция 450 г',
    quantity: 1,
    unitPrice: 1234.5,
    imageUrl: 'https://placehold.co/96x96/png',
    imageWebpUrl: null,
    modifiers: [
      { groupName: 'Добавки', optionName: 'Сыр моцарелла и соус барбекю', priceDelta: 120 },
    ],
    modifierSelections: {},
  };
}

async function seedCart(page: import('@playwright/test').Page, restaurantId: string) {
  const items = [buildStressLine()];
  await page.addInitScript(
    ({ rid, cartItems }) => {
      window.localStorage.setItem(
        'svels-cart',
        JSON.stringify({
          state: { version: 2, restaurantId: rid, items: cartItems, checkoutByRestaurant: {} },
          version: 2,
        }),
      );
    },
    { rid: restaurantId, cartItems: items },
  );
}

async function snap(page: import('@playwright/test').Page, name: string) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  await page.getByTestId('cart-modal-panel').screenshot({
    path: path.join(ARTIFACT_DIR, `${name}.png`),
  });
}

test.describe('Cart theme opacity captures @390', () => {
  test.skip(!process.env.CART_MOBILE_SCREENSHOTS, 'Set CART_MOBILE_SCREENSHOTS=1 to capture');
  test.use({ viewport: { width: 390, height: 844 } });

  for (const colorTheme of COLOR_THEMES) {
    test(`colorTheme=${colorTheme}`, async ({ page, seed, asGuest }) => {
      void asGuest;
      const adminToken = seed.restaurantAdmin.auth.accessToken;
      await apiClient.patchStyling(seed.restaurantId, adminToken, {
        colorTheme,
        cardStyle: 'classic',
        headerStyle: 'solid',
        switcherStyle: 'pill',
      });
      await revalidateRestaurantPublicPage(seed.restaurantId);
      await seedCart(page, seed.restaurantId);
      await page.goto(`/restaurants/${seed.restaurantId}`);
      await page.getByTestId('cart-button').click();
      await assertCartPanelBackgroundIsOpaque(page);
      await snap(page, `step1-4items-theme-${colorTheme}`);
    });
  }

  test('glass card + glass header (classic)', async ({ page, seed, asGuest }) => {
    void asGuest;
    const adminToken = seed.restaurantAdmin.auth.accessToken;
    await apiClient.patchStyling(seed.restaurantId, adminToken, {
      colorTheme: 'classic',
      cardStyle: 'glass',
      headerStyle: 'glass',
      switcherStyle: 'segmented',
    });
    await revalidateRestaurantPublicPage(seed.restaurantId);
    await seedCart(page, seed.restaurantId);
    await page.goto(`/restaurants/${seed.restaurantId}`);
    await page.getByTestId('cart-button').click();
    await assertCartPanelBackgroundIsOpaque(page);
    await snap(page, 'step1-glass-classic');
  });

  test('glass card + glass header (midnight)', async ({ page, seed, asGuest }) => {
    void asGuest;
    const adminToken = seed.restaurantAdmin.auth.accessToken;
    await apiClient.patchStyling(seed.restaurantId, adminToken, {
      colorTheme: 'midnight',
      cardStyle: 'glass',
      headerStyle: 'glass',
      switcherStyle: 'tabs',
    });
    await revalidateRestaurantPublicPage(seed.restaurantId);
    await seedCart(page, seed.restaurantId);
    await page.goto(`/restaurants/${seed.restaurantId}`);
    await page.getByTestId('cart-button').click();
    await assertCartPanelBackgroundIsOpaque(page);
    await snap(page, 'step1-glass-midnight');
  });
});
