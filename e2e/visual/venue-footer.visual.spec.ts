import { test, expect, apiClient } from '../fixtures/test';
import { revalidateRestaurantPublicPage } from '../helpers/revalidate-public-page';
import { getBaseUrl } from '../helpers/env';
import { VIEWPORTS, type VisualViewportKey, prepareForScreenshot } from '../helpers/visual';
import type { RestaurantColorTheme } from '../../src/shared/types/restaurant-styling';

const THEMES = ['classic', 'midnight'] as const;
const VIEWPORT_KEYS: VisualViewportKey[] = ['m390', 'd1280'];

const PAGES = [
  { slug: '/account', label: 'account', readyTestId: 'guest-account-page', needsGuest: true },
  { slug: '/favorites', label: 'favorites', readyTestId: 'guest-favorites-page' },
] as const;

let appliedTheme: RestaurantColorTheme | null = null;
let venueLogoApplied = false;

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

async function ensureStableVenue(restaurantId: string, adminToken: string) {
  if (venueLogoApplied) {
    return;
  }
  const logoUrl = `${getBaseUrl()}/e2e/venue-logo.png`;
  await apiClient.patchRestaurant(restaurantId, adminToken, {
    name: 'E2E Cafe',
    logoUrl,
    logoWebpUrl: null,
  });
  await revalidateRestaurantPublicPage(restaurantId);
  venueLogoApplied = true;
}

async function snapFooter(
  page: import('@playwright/test').Page,
  name: string,
) {
  const footer = page.getByTestId('restaurant-footer');
  await expect(footer).toBeVisible();
  await footer.scrollIntoViewIfNeeded();
  await prepareForScreenshot(page);
  await expect(footer).toHaveScreenshot(name, {
    maxDiffPixelRatio: 0.01,
  });
}

for (const theme of THEMES) {
  test.describe(`venue footer visual — ${theme}`, () => {
    test.beforeEach(async ({ seed }) => {
      await applyTheme(seed.restaurantId, seed.superAdmin.auth.accessToken, theme);
      await ensureStableVenue(seed.restaurantId, seed.restaurantAdmin.auth.accessToken);
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
          await snapFooter(page, `venue-footer-${pageDef.label}-${theme}-${viewportKey}.png`);
        });
      }
    }
  });
}
