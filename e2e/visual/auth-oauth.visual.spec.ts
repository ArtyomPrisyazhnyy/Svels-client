import { test, expect, apiClient } from '../fixtures/test';
import { snapCartPanel } from '../helpers/cart-visual';
import { revalidateRestaurantPublicPage } from '../helpers/revalidate-public-page';
import { prepareForScreenshot, VIEWPORTS } from '../helpers/visual';
import {
  ENABLED_OAUTH_PROVIDERS,
  blockExternalOAuthScripts,
  installGuestOAuthSdkMocks,
  mockGuestOAuthProviders,
} from '../helpers/guest-oauth-mock';
import type { RestaurantColorTheme } from '../../src/shared/types/restaurant-styling';

const THEMES: RestaurantColorTheme[] = ['classic', 'midnight'];
const VIEWPORT_KEYS = ['m390', 'd1280'] as const;

async function applyTheme(
  restaurantId: string,
  adminToken: string,
  theme: RestaurantColorTheme,
): Promise<void> {
  const switcherStyle = theme === 'midnight' ? 'segmented' : 'pill';
  await apiClient.patchStyling(restaurantId, adminToken, {
    colorTheme: theme,
    cardStyle: 'classic',
    headerStyle: 'solid',
    switcherStyle,
  });
  await revalidateRestaurantPublicPage(restaurantId);
}

test.describe('Auth modal OAuth (providers enabled)', () => {
  test.beforeEach(async ({ page, seed }) => {
    await installGuestOAuthSdkMocks(page);
    await blockExternalOAuthScripts(page);
    await mockGuestOAuthProviders(page, seed.restaurantId, ENABLED_OAUTH_PROVIDERS);
  });

  for (const theme of THEMES) {
    for (const viewportKey of VIEWPORT_KEYS) {
      test(`auth modal oauth ${theme} @${viewportKey}`, async ({ page, seed }) => {
        await page.setViewportSize(VIEWPORTS[viewportKey]);
        await applyTheme(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, theme);
        await page.goto(`/restaurants/${seed.restaurantId}`);
        await page.getByTestId('guest-profile-button').click();
        const panel = page.getByTestId('restaurant-auth-modal-panel');
        await expect(panel).toBeVisible();
        await expect(page.getByTestId('guest-oauth-section')).toBeVisible();
        await page.getByTestId('restaurant-auth-modal-title').evaluate((el) => {
          el.textContent = 'Вход в E2E Cafe';
        });
        await prepareForScreenshot(page);
        await snapCartPanel(page, panel, `auth-modal-oauth-${theme}-${viewportKey}`);
      });
    }
  }
});
