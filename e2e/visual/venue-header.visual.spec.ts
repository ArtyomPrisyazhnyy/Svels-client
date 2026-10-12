import { test, expect, apiClient } from '../fixtures/test';
import { revalidateRestaurantPublicPage } from '../helpers/revalidate-public-page';
import { getBaseUrl } from '../helpers/env';
import { VIEWPORTS, type VisualViewportKey, prepareForScreenshot } from '../helpers/visual';
import type { RestaurantColorTheme } from '../../src/shared/types/restaurant-styling';

const THEMES = ['classic', 'midnight', 'warm'] as const;
const VIEWPORT_KEYS: VisualViewportKey[] = ['m360', 'm390', 't768', 'd1280'];

const PAGES = [
  { slug: '', label: 'home', readyTestId: 'restaurant-public-page' },
  { slug: '/account', label: 'account', readyTestId: 'guest-account-page', needsGuest: true },
  { slug: '/pre-order', label: 'preorder', readyTestId: 'preorder-page', needsGuest: true },
  { slug: '/booking', label: 'booking', readyTestId: 'guest-booking-page', needsGuest: true },
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
  const menu = await apiClient.getMenu(restaurantId);
  for (const category of menu.categories) {
    if (category.name.startsWith('Full ')) {
      await apiClient.patchMenuCategory(restaurantId, adminToken, category.id, 'E2E Допы');
    }
  }
  await revalidateRestaurantPublicPage(restaurantId);
  venueLogoApplied = true;
}

async function assertHeaderHeight(
  page: import('@playwright/test').Page,
  viewportKey: VisualViewportKey,
) {
  const expected = viewportKey === 't768' || viewportKey === 'd1280' ? 64 : 56;
  const height = await page.getByTestId('venue-header').evaluate((el) => el.getBoundingClientRect().height);
  expect(height).toBe(expected);
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
          await assertHeaderHeight(page, viewportKey);
          await snapHeaderClip(
            page,
            `venue-header-${pageDef.label}-${theme}-${viewportKey}.png`,
          );
        });
      }

      test(`home-sticky @ ${viewportKey}`, async ({ page, seed }) => {
        const viewport = VIEWPORTS[viewportKey];
        await page.setViewportSize(viewport);
        await page.goto(`/restaurants/${seed.restaurantId}`);
        await expect(page.getByTestId('restaurant-public-page')).toBeVisible({ timeout: 30_000 });
        await expect(page.getByTestId('venue-home-category-nav')).toBeVisible();
        await page.evaluate(() => {
          const nav = document.querySelector('[data-testid="venue-home-category-nav"]');
          const header = document.querySelector('[data-testid="venue-header"]');
          if (!(nav instanceof HTMLElement) || !(header instanceof HTMLElement)) {
            return;
          }
          const headerH = header.getBoundingClientRect().height;
          const navTop = nav.getBoundingClientRect().top + window.scrollY;
          window.scrollTo(0, Math.max(0, navTop - headerH));
        });
        await expect
          .poll(async () =>
            page.evaluate(() => {
              const nav = document.querySelector('[data-testid="venue-home-category-nav"]');
              const header = document.querySelector('[data-testid="venue-header"]');
              if (!(nav instanceof HTMLElement) || !(header instanceof HTMLElement)) {
                return 999;
              }
              return Math.abs(nav.getBoundingClientRect().top - header.getBoundingClientRect().bottom);
            }),
          )
          .toBeLessThanOrEqual(1);
        await expect(page.getByTestId('venue-home-category-nav')).toBeInViewport();
        await assertHeaderHeight(page, viewportKey);
        await snapHeaderClip(
          page,
          `venue-header-home-sticky-${theme}-${viewportKey}.png`,
        );
      });
    }
  });
}

test.describe('venue header self-review sequence @ m390 classic', () => {
  test.beforeEach(async ({ seed }) => {
    await applyTheme(seed.restaurantId, seed.superAdmin.auth.accessToken, 'classic');
    await ensureStableVenue(seed.restaurantId, seed.restaurantAdmin.auth.accessToken);
  });

  for (const step of [
    { slug: '', label: 'nav-home', readyTestId: 'restaurant-public-page' },
    { slug: '/account', label: 'nav-account', readyTestId: 'guest-account-page', needsGuest: true },
    { slug: '/pre-order', label: 'nav-preorder', readyTestId: 'preorder-page', needsGuest: true },
  ] as const) {
    test(step.label, async ({ page, seed, asGuest }) => {
      if ('needsGuest' in step && step.needsGuest) {
        void asGuest;
      }
      await page.setViewportSize(VIEWPORTS.m390);
      await page.goto(`/restaurants/${seed.restaurantId}${step.slug}`);
      await expect(page.getByTestId(step.readyTestId)).toBeVisible({ timeout: 30_000 });
      await assertHeaderHeight(page, 'm390');
      await snapHeaderClip(page, `venue-header-${step.label}-classic-m390.png`);
    });
  }

  test('home ellipsis with logo @ m360', async ({ page, seed }) => {
    await apiClient.patchRestaurant(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, {
      name: 'E2E Cafe Very Long Venue Name For Header Ellipsis',
      logoUrl: `${getBaseUrl()}/e2e/venue-logo.png`,
    });
    await revalidateRestaurantPublicPage(seed.restaurantId);
    await page.setViewportSize(VIEWPORTS.m360);
    await page.goto(`/restaurants/${seed.restaurantId}`);
    await expect(page.getByTestId('restaurant-public-page')).toBeVisible({ timeout: 30_000 });
    await assertHeaderHeight(page, 'm360');
    await snapHeaderClip(page, 'venue-header-home-ellipsis-classic-m360.png');
  });
});
