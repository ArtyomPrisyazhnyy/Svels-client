import { test, expect } from '@playwright/test';
import { prepareForScreenshot, VIEWPORTS } from '../helpers/visual';
import { CAPTURE_THEMES, FLAME_HEADER_STATES } from '../capture/loyalty-flame-capture.fixtures';

const VIEWPORTS_CAPTURE = [
  { key: '390', size: VIEWPORTS.m390 },
  { key: '1280', size: VIEWPORTS.d1280 },
] as const;

for (const theme of CAPTURE_THEMES) {
  for (const { key: viewportKey, size } of VIEWPORTS_CAPTURE) {
    for (const state of FLAME_HEADER_STATES) {
      test(`loyalty flame header ${state.key} — ${theme} @ ${viewportKey}`, async ({ page }) => {
        await page.setViewportSize(size);
        await page.goto(`/dev/loyalty-flame?theme=${theme}&view=states`);
        const tile = page.getByTestId(state.testId);
        await expect(tile).toBeVisible();
        await prepareForScreenshot(page);
        await expect(tile).toHaveScreenshot(
          `loyalty-flame-header-${state.key}-${theme}-${viewportKey}.png`,
          { maxDiffPixelRatio: 0.01 },
        );
      });
    }
  }
}

for (const theme of ['classic', 'midnight'] as const) {
  test(`loyalty flame modal — ${theme} @ 390`, async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.m390);
    await page.goto(`/dev/loyalty-flame?theme=${theme}&openModal=1&state=active`);
    const panel = page.getByTestId('loyalty-flame-info-panel');
    await expect(panel).toBeVisible();
    await prepareForScreenshot(page);
    await expect(panel).toHaveScreenshot(`loyalty-flame-modal-${theme}-390.png`, {
      maxDiffPixelRatio: 0.01,
    });
  });
}
