import { test, expect, apiClient } from '../fixtures/test';
import { getBaseUrl } from '../helpers/env';
import { revalidateRestaurantPublicPage } from '../helpers/revalidate-public-page';
import { VIEWPORTS, type VisualViewportKey } from '../helpers/visual';
import type { RestaurantColorTheme } from '../../src/shared/types/restaurant-styling';

const THEMES = ['classic', 'midnight', 'warm'] as const;
const VIEWPORT_KEYS: VisualViewportKey[] = ['m360', 'm390', 'd1280'];

const PAGES = [
  { slug: '/account', skeletonTestId: 'guest-account-skeleton' },
  { slug: '/pre-order', skeletonTestId: 'guest-preorder-skeleton' },
  { slug: '/booking', skeletonTestId: 'guest-booking-skeleton' },
  { slug: '/favorites', skeletonTestId: 'guest-favorites-skeleton' },
] as const;

let appliedTheme: RestaurantColorTheme | null = null;
let stableVenueApplied = false;

async function ensureStableVenue(restaurantId: string, adminToken: string) {
  if (stableVenueApplied) {
    return;
  }
  await apiClient.patchRestaurant(restaurantId, adminToken, {
    name: 'E2E Cafe',
    logoUrl: `${getBaseUrl()}/e2e/venue-logo.png`,
    logoWebpUrl: null,
  });
  await revalidateRestaurantPublicPage(restaurantId);
  stableVenueApplied = true;
}

async function applyTheme(restaurantId: string, adminToken: string, theme: RestaurantColorTheme) {
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

for (const theme of THEMES) {
  for (const viewportKey of VIEWPORT_KEYS) {
    for (const pageDef of PAGES) {
      test(`skeleton ${pageDef.slug} ${theme} ${viewportKey}`, async ({
        browser,
        seed,
        asRestaurantAdmin,
      }) => {
        void asRestaurantAdmin;
        await ensureStableVenue(seed.restaurantId, seed.restaurantAdmin.auth.accessToken);
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

async function headerClip(page: import('@playwright/test').Page) {
  const header = page.getByTestId('venue-header');
  await expect(header).toBeVisible();
  const box = await header.boundingBox();
  if (!box) {
    throw new Error('venue-header has no bounding box');
  }
  return { x: 0, y: 0, width: box.width, height: box.height };
}

for (const pageDef of PAGES) {
  test(`venue header matches loaded ${pageDef.slug} classic m390`, async ({ browser, page, seed }) => {
    await ensureStableVenue(seed.restaurantId, seed.restaurantAdmin.auth.accessToken);
    await applyTheme(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, 'classic');

    const viewport = VIEWPORTS.m390;
    const noJs = await browser.newContext({
      javaScriptEnabled: false,
      viewport,
    });
    const skeletonPage = await noJs.newPage();
    await skeletonPage.goto(`/restaurants/${seed.restaurantId}${pageDef.slug}`);
    await expect(skeletonPage.getByTestId(pageDef.skeletonTestId)).toBeVisible();
    const clip = await headerClip(skeletonPage);
    const skeletonPng = await skeletonPage.screenshot({
      clip,
      animations: 'disabled',
      caret: 'hide',
    });
    await noJs.close();

    await page.setViewportSize(viewport);
    await page.goto(`/restaurants/${seed.restaurantId}${pageDef.slug}`);
    await expect(page.getByTestId('venue-header')).toBeVisible();
    const loadedPng = await page.screenshot({
      clip,
      animations: 'disabled',
      caret: 'hide',
    });

    const diffRatio = await page.evaluate(
      async ({ left, right }) => {
        async function pixels(src: string) {
          const image = new Image();
          image.src = src;
          await image.decode();
          const canvas = document.createElement('canvas');
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
          const context = canvas.getContext('2d');
          if (!context) {
            throw new Error('canvas');
          }
          context.drawImage(image, 0, 0);
          return context.getImageData(0, 0, canvas.width, canvas.height).data;
        }
        const a = await pixels(left);
        const b = await pixels(right);
        if (a.length !== b.length) {
          return 1;
        }
        let different = 0;
        const total = a.length / 4;
        for (let index = 0; index < a.length; index += 4) {
          if (a[index] !== b[index] || a[index + 1] !== b[index + 1] || a[index + 2] !== b[index + 2]) {
            different += 1;
          }
        }
        return different / total;
      },
      {
        left: `data:image/png;base64,${skeletonPng.toString('base64')}`,
        right: `data:image/png;base64,${loadedPng.toString('base64')}`,
      },
    );
    expect(diffRatio).toBeLessThanOrEqual(0.01);
  });
}
