import { test, expect } from '@playwright/test';
import { prepareForScreenshot, VIEWPORTS, type VisualViewportKey } from '../helpers/visual';
import type { RestaurantColorTheme } from '../../src/shared/types/restaurant-styling';

const THEMES = ['classic', 'midnight', 'monochrome', 'ocean'] as const satisfies readonly RestaurantColorTheme[];
const VIEWPORT_KEYS: VisualViewportKey[] = ['m390', 'd1280'];

for (const theme of THEMES) {
  for (const viewportKey of VIEWPORT_KEYS) {
    test(`loyalty flame header states — ${theme} @ ${viewportKey}`, async ({ page }) => {
      await page.setViewportSize(VIEWPORTS[viewportKey]);
      await page.goto(`/dev/loyalty-flame?theme=${theme}&view=states`);
      const showcase = page.getByTestId('loyalty-flame-states-showcase');
      await expect(showcase).toBeVisible();
      await prepareForScreenshot(page);
      await expect(showcase).toHaveScreenshot(`loyalty-flame-states-${theme}-${viewportKey}.png`, {
        maxDiffPixelRatio: 0.01,
      });
    });

    test(`loyalty flame modal — ${theme} @ ${viewportKey}`, async ({ page }) => {
      await page.setViewportSize(VIEWPORTS[viewportKey]);
      await page.goto(`/dev/loyalty-flame?theme=${theme}&openModal=1&state=active`);
      const panel = page.getByTestId('loyalty-flame-info-panel');
      await expect(panel).toBeVisible();
      await expect(page.getByTestId('loyalty-flame-streak-hero')).toBeVisible();
      await prepareForScreenshot(page);
      await expect(panel).toHaveScreenshot(`loyalty-flame-modal-${theme}-${viewportKey}.png`, {
        maxDiffPixelRatio: 0.01,
      });
    });
  }
}
