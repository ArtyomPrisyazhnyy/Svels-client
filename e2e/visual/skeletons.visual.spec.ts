import { test, expect, apiClient } from '../fixtures/test';
import { revalidateRestaurantPublicPage } from '../helpers/revalidate-public-page';
import { VIEWPORTS, type VisualViewportKey } from '../helpers/visual';
import type { RestaurantColorTheme } from '../../src/shared/types/restaurant-styling';

const THEMES = ['classic', 'midnight'] as const;
const VIEWPORT_KEYS: VisualViewportKey[] = ['m390', 'd1280'];

const PAGES = [
  { slug: '/account', skeletonTestId: 'guest-account-skeleton' },
  { slug: '/pre-order', skeletonTestId: 'guest-preorder-skeleton' },
  { slug: '/booking', skeletonTestId: 'guest-booking-skeleton' },
  { slug: '/favorites', skeletonTestId: 'guest-favorites-skeleton' },
] as const;

let appliedTheme: RestaurantColorTheme | null = null;

async function applyTheme(restaurantId: string, adminToken: string, theme: RestaurantColorTheme) {
  if (appliedTheme === theme) {
    return;
  }
  const switcherStyle = theme === 'midnight' ? 'segmented' : 'pill';
  await apiClient.patchStyling(restaurantId, adminToken, {
    colorTheme: theme,
    cardStyle: 'classic',
    headerStyle: 'glass',
    switcherStyle,
  });
  await revalidateRestaurantPublicPage(restaurantId);
  appliedTheme = theme;
}

for (const theme of THEMES) {
  for (const viewportKey of VIEWPORT_KEYS) {
    for (const pageDef of PAGES) {
      test(`skeleton ${pageDef.slug} ${theme} ${viewportKey}`, async ({
        browser,
        seed,
        asRestaurantAdmin,
      }) => {
        void asRestaurantAdmin;
        await applyTheme(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, theme);

        const viewport = VIEWPORTS[viewportKey];
        const context = await browser.newContext({
          javaScriptEnabled: false,
          viewport: { width: viewport.width, height: viewport.height },
        });
        const page = await context.newPage();
        await page.goto(`/restaurants/${seed.restaurantId}${pageDef.slug}`);

        await expect(page.getByTestId(pageDef.skeletonTestId)).toBeVisible();
        await page.waitForLoadState('load');

        const slugLabel = pageDef.slug.replace('/', '');
        await expect(page).toHaveScreenshot(`skeleton-${slugLabel}-${theme}-${viewportKey}.png`, {
          maxDiffPixelRatio: 0.01,
        });

        await context.close();
      });
    }
  }
}
