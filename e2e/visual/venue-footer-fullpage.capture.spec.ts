import { test, expect, apiClient } from '../fixtures/test';
import { revalidateRestaurantPublicPage } from '../helpers/revalidate-public-page';
import { VIEWPORTS } from '../helpers/visual';
import type { RestaurantColorTheme } from '../../src/shared/types/restaurant-styling';
import path from 'node:path';

const OUT_DIR = process.env.VENUE_FOOTER_CAPTURE_DIR ?? '/opt/cursor/artifacts/screenshots';

async function applyTheme(
  restaurantId: string,
  adminToken: string,
  theme: RestaurantColorTheme,
) {
  const switcherStyle =
    theme === 'midnight' ? 'segmented' : theme === 'warm' ? 'tabs' : 'pill';
  await apiClient.patchStyling(restaurantId, adminToken, {
    colorTheme: theme,
    cardStyle: 'classic',
    headerStyle: 'glass',
    switcherStyle,
  });
  await revalidateRestaurantPublicPage(restaurantId);
}

async function scrollToFooter(page: import('@playwright/test').Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    const footer = document.querySelector('[data-testid="restaurant-footer"]');
    if (footer instanceof HTMLElement) {
      footer.scrollIntoView({ block: 'end', behavior: 'auto' });
      return;
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
  });
}

test.describe('venue footer full-page capture @manual', () => {
  test.skip(
    () => process.env.CAPTURE_VENUE_FOOTER_PAGES !== '1',
    'Run with CAPTURE_VENUE_FOOTER_PAGES=1',
  );

  test('account and favorites bottoms (production)', async ({ page, seed, asGuest }) => {
    void asGuest;

    const captures: Array<{
      slug: string;
      label: string;
      theme: RestaurantColorTheme;
      viewportKey: 'm390' | 'd1280';
      readyTestId: string;
      needsGuest: boolean;
    }> = [
      { slug: '', label: 'venue-home', theme: 'classic', viewportKey: 'm390', readyTestId: 'restaurant-public-page', needsGuest: false },
      { slug: '/account', label: 'venue-account', theme: 'classic', viewportKey: 'm390', readyTestId: 'guest-account-page', needsGuest: true },
      { slug: '/account', label: 'venue-account', theme: 'classic', viewportKey: 'd1280', readyTestId: 'guest-account-page', needsGuest: true },
      { slug: '/account', label: 'venue-account', theme: 'midnight', viewportKey: 'm390', readyTestId: 'guest-account-page', needsGuest: true },
      { slug: '/account', label: 'venue-account', theme: 'midnight', viewportKey: 'd1280', readyTestId: 'guest-account-page', needsGuest: true },
      { slug: '/favorites', label: 'venue-favorites', theme: 'classic', viewportKey: 'm390', readyTestId: 'guest-favorites-page', needsGuest: false },
      { slug: '/favorites', label: 'venue-favorites', theme: 'classic', viewportKey: 'd1280', readyTestId: 'guest-favorites-page', needsGuest: false },
      { slug: '/favorites', label: 'venue-favorites', theme: 'midnight', viewportKey: 'm390', readyTestId: 'guest-favorites-page', needsGuest: false },
      { slug: '/favorites', label: 'venue-favorites', theme: 'midnight', viewportKey: 'd1280', readyTestId: 'guest-favorites-page', needsGuest: false },
    ];

    for (const shot of captures) {
      await applyTheme(seed.restaurantId, seed.superAdmin.auth.accessToken, shot.theme);
      const viewport = VIEWPORTS[shot.viewportKey];
      await page.setViewportSize(viewport);
      await page.goto(`/restaurants/${seed.restaurantId}${shot.slug}`);
      await expect(page.getByTestId(shot.readyTestId)).toBeVisible({ timeout: 60_000 });
      await scrollToFooter(page);
      const fileName = `${shot.label}-${shot.theme}-${viewport.width}.png`;
      await page.screenshot({
        path: path.join(OUT_DIR, fileName),
        fullPage: true,
        animations: 'disabled',
      });
    }
  });
});
