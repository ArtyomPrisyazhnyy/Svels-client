import { test, expect, apiClient } from '../fixtures/test';
import { revalidateRestaurantPublicPage } from '../helpers/revalidate-public-page';
import { VIEWPORTS, type VisualViewportKey, prepareForScreenshot } from '../helpers/visual';
import type { RestaurantColorTheme } from '../../src/shared/types/restaurant-styling';

const THEMES = ['classic', 'midnight', 'warm'] as const;
const VIEWPORT_KEYS: VisualViewportKey[] = ['m360', 'm390', 't768', 'd1280'];

const PAGES = [
  { slug: '', label: 'home', readyTestId: 'restaurant-public-page' },
  { slug: '/account', label: 'account', readyTestId: 'guest-account-page', needsGuest: true },
  { slug: '/pre-order', label: 'preorder', readyTestId: 'preorder-page', needsGuest: true },
  { slug: '/booking', label: 'booking', readyTestId: 'guest-booking-page', needsGuest: true },
] as const;

let appliedTheme: RestaurantColorTheme | null = null;

async function applyTheme(
  restaurantId: string,
  adminToken: string,
  theme: RestaurantColorTheme,
) {
  if (appliedTheme === theme) {
    return;
  }
  const switcherStyle =
    theme === 'midnight' ? 'segmented' : theme === 'warm' ? 'tabs' : 'pill';
  await apiClient.patchStyling(restaurantId, adminToken, {
    colorTheme: theme,
    cardStyle: 'classic',
    headerStyle: 'glass',
    switcherStyle,
  });
  await revalidateRestaurantPublicPage(restaurantId);
  appliedTheme = theme;
}

async function snapHeaderClip(
  page: import('@playwright/test').Page,
  name: string,
) {
  const header = page.getByTestId('venue-header');
  await expect(header).toBeVisible();
  const box = await header.boundingBox();
  if (!box) {
    throw new Error('venue-header has no bounding box');
  }
  await prepareForScreenshot(page);
  await expect(page).toHaveScreenshot(name, {
    clip: {
      x: 0,
      y: 0,
      width: box.width,
      height: box.height + 120,
    },
    maxDiffPixelRatio: 0.01,
  });
}

for (const theme of THEMES) {
  test.describe(`venue header visual — ${theme}`, () => {
    test.beforeEach(async ({ seed }) => {
      await applyTheme(seed.restaurantId, seed.superAdmin.auth.accessToken, theme);
    });

    for (const viewportKey of VIEWPORT_KEYS) {
      for (const pageDef of PAGES) {
        test(`${pageDef.label} @ ${viewportKey}`, async ({ page, seed, asGuest }) => {
          if ('needsGuest' in pageDef && pageDef.needsGuest) {
            void asGuest;
          }
          const viewport = VIEWPORTS[viewportKey];
          await page.setViewportSize(viewport);
          await page.goto(`/restaurants/${seed.restaurantId}${pageDef.slug}`);
          await expect(page.getByTestId(pageDef.readyTestId)).toBeVisible({ timeout: 30_000 });
          await snapHeaderClip(
            page,
            `venue-header-${pageDef.label}-${theme}-${viewportKey}.png`,
          );
        });
      }
    }
  });
}
