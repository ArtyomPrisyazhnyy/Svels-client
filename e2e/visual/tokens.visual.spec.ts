import { test, expect } from '@playwright/test';
import { prepareForScreenshot, VIEWPORTS } from '../helpers/visual';

const SNAPSHOT_VIEWPORTS = ['m390', 'd1280'] as const;

test.describe('UI tokens board (/dev/ui)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dev/ui?theme=classic', { waitUntil: 'networkidle' });
    await expect(page.getByTestId('ui-tokens-board')).toBeVisible();
  });

  for (const viewportKey of SNAPSHOT_VIEWPORTS) {
    test(`classic theme @ ${viewportKey}`, async ({ page }) => {
      const viewport = VIEWPORTS[viewportKey];
      await page.setViewportSize(viewport);
      await prepareForScreenshot(page);
      await expect(page.getByTestId('ui-tokens-board')).toHaveScreenshot(
        `tokens-classic-${viewportKey}.png`,
      );
    });
  }
});
