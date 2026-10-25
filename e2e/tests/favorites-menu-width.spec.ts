import { test, expect, apiClient } from '../fixtures/test';

const WIDTHS = [390, 1280] as const;

interface FrameMetrics {
  width: number;
  maxWidth: string;
  paddingLeft: string;
  paddingRight: string;
}

interface CardMetrics {
  width: number;
  columns: number;
}

async function frameMetrics(
  frame: import('@playwright/test').Locator,
): Promise<FrameMetrics> {
  return frame.evaluate((element) => {
    const style = getComputedStyle(element);
    const box = element.getBoundingClientRect();
    return {
      width: box.width,
      maxWidth: style.maxWidth,
      paddingLeft: style.paddingLeft,
      paddingRight: style.paddingRight,
    };
  });
}

async function cardMetrics(
  card: import('@playwright/test').Locator,
): Promise<CardMetrics> {
  return card.evaluate((element) => {
    const grid = element.parentElement;
    const columns = grid
      ? getComputedStyle(grid)
          .gridTemplateColumns.split(' ')
          .map((part) => part.trim())
          .filter(Boolean).length
      : 0;
    return {
      width: element.getBoundingClientRect().width,
      columns,
    };
  });
}

test.describe('favorites menu matches venue home', () => {
  test.beforeEach(async ({ seed }) => {
    await apiClient.addGuestFavorite(
      seed.restaurantId,
      seed.guest.accessToken,
      seed.menu.defaultMenuItemId,
    );
  });

  test.afterEach(async ({ seed }) => {
    await apiClient
      .removeGuestFavorite(
        seed.restaurantId,
        seed.guest.accessToken,
        seed.menu.defaultMenuItemId,
      )
      .catch(() => undefined);
  });

  for (const width of WIDTHS) {
    test(`card and container widths match @${width}`, async ({ page, seed, asGuest }) => {
      void asGuest;
      await page.setViewportSize({ width, height: 900 });
      const item = page.getByTestId(`menu-item-${seed.menu.defaultMenuItemId}`);

      await page.goto(`/restaurants/${seed.restaurantId}`);
      const homeFrame = page.locator('[data-venue-menu-frame]');
      await expect(homeFrame).toBeVisible();
      await expect(homeFrame).toHaveClass(/venue-menu-frame/);
      await expect(item).toBeVisible();
      const homeFrameMetrics = await frameMetrics(homeFrame);
      const homeCardMetrics = await cardMetrics(item);

      await page.goto(`/restaurants/${seed.restaurantId}/favorites`);
      const favoritesFrame = page.getByTestId('guest-favorites-page');
      await expect(favoritesFrame).toBeVisible({ timeout: 30_000 });
      await expect(favoritesFrame).toHaveClass(/venue-menu-frame/);
      await expect(item).toBeVisible({ timeout: 30_000 });
      const favoritesFrameMetrics = await frameMetrics(favoritesFrame);
      const favoritesCardMetrics = await cardMetrics(item);

      expect(favoritesFrameMetrics.maxWidth).toBe(homeFrameMetrics.maxWidth);
      expect(favoritesFrameMetrics.paddingLeft).toBe(homeFrameMetrics.paddingLeft);
      expect(favoritesFrameMetrics.paddingRight).toBe(homeFrameMetrics.paddingRight);
      expect(Math.abs(favoritesFrameMetrics.width - homeFrameMetrics.width)).toBeLessThanOrEqual(1);
      expect(favoritesCardMetrics.columns).toBe(homeCardMetrics.columns);
      expect(favoritesCardMetrics.columns).toBeGreaterThan(0);
      expect(Math.abs(favoritesCardMetrics.width - homeCardMetrics.width)).toBeLessThanOrEqual(1);
    });
  }
});
