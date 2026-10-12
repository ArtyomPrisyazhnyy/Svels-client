import { test, expect, apiClient } from '../fixtures/test';
import { VIEWPORTS, type VisualViewportKey } from '../helpers/visual';

const PAGES = [
  { path: 'account', skeletonTestId: 'guest-account-skeleton', readyTestId: 'guest-account-page' },
  { path: 'pre-order', skeletonTestId: 'guest-preorder-skeleton', readyTestId: 'preorder-page' },
  { path: 'booking', skeletonTestId: 'guest-booking-skeleton', readyTestId: 'guest-booking-page' },
  { path: 'favorites', skeletonTestId: 'guest-favorites-skeleton', readyTestId: 'guest-favorites-page' },
] as const;

const VIEWPORT_KEYS: VisualViewportKey[] = ['m390', 'd1280'];

async function firstBlockTop(page: import('@playwright/test').Page): Promise<number> {
  const block = page.getByTestId('guest-page-first-block').first();
  await expect(block).toBeVisible();
  await block.scrollIntoViewIfNeeded();
  const top = await block.evaluate((element) => element.getBoundingClientRect().top);
  if (!Number.isFinite(top)) {
    throw new Error(`guest-page-first-block top is not finite: ${String(top)}`);
  }
  return top;
}

for (const viewportKey of VIEWPORT_KEYS) {
  for (const pageDef of PAGES) {
    test(`first content block aligns ±1px: ${pageDef.path} @ ${viewportKey}`, async ({
      browser,
      page,
      seed,
      asGuest,
    }) => {
      void asGuest;
      const viewport = VIEWPORTS[viewportKey];
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      const noJs = await browser.newContext({
        javaScriptEnabled: false,
        viewport: { width: viewport.width, height: viewport.height },
      });
      const skeletonPage = await noJs.newPage();
      await skeletonPage.goto(`/restaurants/${seed.restaurantId}/${pageDef.path}`);
      await expect(skeletonPage.getByTestId(pageDef.skeletonTestId)).toBeVisible();
      const skeletonTop = await firstBlockTop(skeletonPage);
      await noJs.close();

      if (pageDef.path === 'favorites') {
        await apiClient.addGuestFavorite(
          seed.restaurantId,
          seed.guest.accessToken,
          seed.menu.defaultMenuItemId,
        );
      }

      await page.goto(`/restaurants/${seed.restaurantId}/${pageDef.path}`);
      await expect(page.getByTestId(pageDef.readyTestId)).toBeVisible({ timeout: 30_000 });
      await expect(page.getByTestId('guest-page-first-block')).toBeVisible({ timeout: 30_000 });
      const loadedTop = await firstBlockTop(page);

      expect(Math.abs(skeletonTop - loadedTop)).toBeLessThanOrEqual(1);
    });
  }
}
