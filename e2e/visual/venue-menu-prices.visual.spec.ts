import { test, expect, apiClient } from '../fixtures/test';
import { revalidateRestaurantPublicPage } from '../helpers/revalidate-public-page';
import { VIEWPORTS, prepareForScreenshot } from '../helpers/visual';
import type { RestaurantColorTheme } from '../../src/shared/types/restaurant-styling';

import type { CartLineItem } from '../../src/shared/types/cart';

const THEMES = ['classic', 'midnight'] as const;
const VIEWPORT_KEYS = ['m390', 'd1280'] as const;

let appliedTheme: RestaurantColorTheme | null = null;

async function applyTheme(
  restaurantId: string,
  adminToken: string,
  theme: RestaurantColorTheme,
) {
  if (appliedTheme === theme) {
    return;
  }
  const switcherStyle = theme === 'midnight' ? 'segmented' : 'pill';
  await apiClient.patchStyling(restaurantId, adminToken, {
    colorTheme: theme,
    cardStyle: 'classic',
    headerStyle: 'solid',
    switcherStyle,
  });
  await revalidateRestaurantPublicPage(restaurantId);
  appliedTheme = theme;
}

async function snapFullViewport(page: import('@playwright/test').Page, name: string) {
  await prepareForScreenshot(page);
  await expect(page).toHaveScreenshot(`${name}.png`, {
    fullPage: false,
    maxDiffPixelRatio: 0.01,
  });
}

function buildCartLine(index = 1): CartLineItem {
  return {
    id: `venue-price-cart-${index}`,
    lineKey: `vpc-${index}`,
    menuItemId: `vpc-item-${index}`,
    name: 'Блюдо для проверки цены',
    variantLabel: 'Стандарт',
    quantity: 2,
    unitPrice: 9.9,
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
    { rid: restaurantId, cartItems: [buildCartLine()] },
  );
}

async function readBynPriceMetrics(locator: import('@playwright/test').Locator) {
  return locator.first().evaluate((el) => {
    const sign = el.querySelector('.byn-sign');
    const amt = el.querySelector('.byn-price__amount');
    const cs = (n: Element | null) => (n ? getComputedStyle(n) : null);
    const r = (n: Element | null) => (n ? n.getBoundingClientRect() : null);
    const amountBox = r(amt);
    const signBox = r(sign);
    return {
      gap: cs(el)?.gap ?? '',
      signFontSize: cs(sign)?.fontSize ?? '',
      signScale: cs(el)?.getPropertyValue('--byn-sign-scale') ?? '',
      gapPx: amountBox && signBox ? signBox.left - amountBox.right : null,
    };
  });
}

for (const theme of THEMES) {
  for (const viewportKey of VIEWPORT_KEYS) {
    test(`venue menu grid ${theme} @${viewportKey}`, async ({ page, seed, asGuest }) => {
      void asGuest;
      await applyTheme(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, theme);
      await page.setViewportSize(VIEWPORTS[viewportKey]);
      await page.goto(`/restaurants/${seed.restaurantId}`);
      await expect(page.getByTestId('restaurant-public-page')).toBeVisible({ timeout: 60_000 });
      await expect(page.getByTestId('restaurant-menu')).toBeVisible();
      const firstCard = page.locator('[data-testid^="menu-item-"]').first();
      await expect(firstCard).toBeVisible();
      await firstCard.scrollIntoViewIfNeeded();
      await snapFullViewport(page, `venue-menu-grid-${theme}-${viewportKey}`);
    });

    test(`product modal ${theme} @${viewportKey}`, async ({ page, seed, asGuest }) => {
      void asGuest;
      await applyTheme(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, theme);
      await page.setViewportSize(VIEWPORTS[viewportKey]);
      await page.goto(`/restaurants/${seed.restaurantId}`);
      const opener = page.locator('[data-testid^="menu-item-"]').first();
      await expect(opener).toBeVisible();
      await opener.click();
      await expect(page.getByTestId('menu-product-modal-panel')).toBeVisible();
      await expect(page.getByTestId('menu-product-modal-title')).toBeVisible();
      const photo = page.locator('.menu-product-modal__media img');
      await expect(photo).toBeVisible();
      await expect
        .poll(() => photo.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0))
        .toBe(true);
      await snapFullViewport(page, `venue-product-modal-${theme}-${viewportKey}`);
    });
  }
}

test('cart modal classic @m390', async ({ page, seed, asGuest }) => {
  void asGuest;
  await applyTheme(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, 'classic');
  await seedCart(page, seed.restaurantId);
  await page.setViewportSize(VIEWPORTS.m390);
  await page.goto(`/restaurants/${seed.restaurantId}`);
  await page.getByTestId('cart-button').click();
  await expect(page.getByTestId('cart-modal-panel')).toBeVisible();
  await snapFullViewport(page, 'venue-cart-modal-classic-m390');
});

test('product modal footer fits on one row @390', async ({ page, seed, asGuest }) => {
  void asGuest;
  await applyTheme(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, 'classic');
  await page.setViewportSize(VIEWPORTS.m390);
  await page.goto(`/restaurants/${seed.restaurantId}`);
  const opener = page.locator('[data-testid^="menu-item-"]').first();
  await expect(opener).toBeVisible();
  const cardMetrics = await readBynPriceMetrics(page.locator('.menu-product-card__price .byn-price'));
  await opener.click();
  const footer = page.locator('.menu-product-modal__footer');
  await expect(footer).toBeVisible();
  const overflow = await footer.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    return el.scrollWidth > rect.width + 1;
  });
  expect(overflow).toBe(false);
  const price = footer.locator('.menu-product-modal__price');
  const actions = footer.locator('.menu-product-modal__actions');
  const priceBox = await price.boundingBox();
  const actionsBox = await actions.boundingBox();
  expect(priceBox).not.toBeNull();
  expect(actionsBox).not.toBeNull();
  if (priceBox && actionsBox) {
    expect(actionsBox.x).toBeGreaterThanOrEqual(priceBox.x + priceBox.width - 1);
  }

  const modalMetrics = await readBynPriceMetrics(footer.locator('.byn-price'));
  expect(modalMetrics.gap).toBe(cardMetrics.gap);
  expect(modalMetrics.signFontSize).toBe(cardMetrics.signFontSize);
  expect(modalMetrics.signScale).toBe(cardMetrics.signScale);
  expect(modalMetrics.gapPx ?? 0).toBeGreaterThan(2);
});
