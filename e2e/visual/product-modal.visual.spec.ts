import { test, expect } from '../fixtures/test';
import { snapCartPanel } from '../helpers/cart-visual';
import { VIEWPORTS } from '../helpers/visual';
import { apiClient } from '../helpers/api';
import { revalidateRestaurantPublicPage } from '../helpers/revalidate-public-page';
import type { RestaurantColorTheme } from '../../src/shared/types/restaurant-styling';

const PRODUCT_MODAL_THEMES = ['classic', 'midnight'] as const;
const PRODUCT_MODAL_DESKTOP_THEMES = ['classic', 'midnight', 'neon', 'citrus'] as const;

type ProductModalViewportKey = 'm390' | 'm390Landscape' | 'd1280' | 'd1280Short';

const PRODUCT_MODAL_VIEWPORTS: ProductModalViewportKey[] = [
  'm390',
  'm390Landscape',
  'd1280',
  'd1280Short',
];

let appliedTheme: RestaurantColorTheme | null = null;

async function applyTheme(
  restaurantId: string,
  adminToken: string,
  theme: RestaurantColorTheme,
): Promise<void> {
  if (appliedTheme === theme) {
    return;
  }
  const switcherStyle =
    theme === 'midnight' || theme === 'neon'
      ? 'segmented'
      : theme === 'warm' || theme === 'citrus'
        ? 'tabs'
        : 'pill';
  await apiClient.patchStyling(restaurantId, adminToken, {
    colorTheme: theme,
    cardStyle: 'classic',
    headerStyle: 'solid',
    switcherStyle,
  });
  await revalidateRestaurantPublicPage(restaurantId);
  appliedTheme = theme;
}

async function openModifierProductModal(
  page: import('@playwright/test').Page,
  restaurantId: string,
  menuItemId: string,
): Promise<import('@playwright/test').Locator> {
  await page.goto(`/restaurants/${restaurantId}`);
  const opener = page.getByTestId(`menu-item-${menuItemId}`);
  await expect(opener).toBeVisible();
  await opener.click();
  const panel = page.getByTestId('menu-product-modal-panel');
  await expect(panel).toBeVisible();
  await expect(page.getByTestId('menu-product-modal-title')).toBeVisible();
  const photo = panel.locator('.menu-product-modal__media img');
  if (await photo.count() > 0) {
    await expect
      .poll(() => photo.first().evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0))
      .toBe(true);
  }
  return panel;
}

async function scrollProductModalToModifiers(panel: import('@playwright/test').Locator): Promise<void> {
  const scrollBody = panel.locator('.ui-overlay-panel__body');
  const modifiers = panel.locator('.menu-product-modifiers').first();
  await expect(modifiers).toBeVisible();
  await scrollBody.evaluate((body) => {
    const modifiersEl = body.querySelector('.menu-product-modifiers');
    if (modifiersEl instanceof HTMLElement) {
      body.scrollTop = Math.max(0, modifiersEl.offsetTop - 24);
    }
  });
}

function themesForViewport(viewportKey: ProductModalViewportKey): readonly RestaurantColorTheme[] {
  if (viewportKey === 'd1280') {
    return PRODUCT_MODAL_DESKTOP_THEMES;
  }
  return PRODUCT_MODAL_THEMES;
}

test.describe('Product modal scroll layout', () => {
  for (const viewportKey of PRODUCT_MODAL_VIEWPORTS) {
    for (const theme of themesForViewport(viewportKey)) {
      test(`top ${theme} @${viewportKey}`, async ({ page, seed, asGuest }) => {
        void asGuest;
        await page.setViewportSize(VIEWPORTS[viewportKey]);
        await applyTheme(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, theme);
        const panel = await openModifierProductModal(
          page,
          seed.restaurantId,
          seed.menu.modifierMenuItemId,
        );
        await snapCartPanel(page, panel, `product-modal-${theme}-${viewportKey}-top`);
      });

      test(`scrolled options ${theme} @${viewportKey}`, async ({ page, seed, asGuest }) => {
        void asGuest;
        await page.setViewportSize(VIEWPORTS[viewportKey]);
        await applyTheme(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, theme);
        const panel = await openModifierProductModal(
          page,
          seed.restaurantId,
          seed.menu.modifierMenuItemId,
        );
        await scrollProductModalToModifiers(panel);
        await expect(panel.locator('.menu-product-modifiers__options').first()).toBeVisible();
        await snapCartPanel(page, panel, `product-modal-${theme}-${viewportKey}-options`);
      });
    }
  }
});
