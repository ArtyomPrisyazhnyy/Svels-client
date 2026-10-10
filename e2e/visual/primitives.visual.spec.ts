import { test, expect } from '@playwright/test';
import { prepareForScreenshot, VIEWPORTS, type VisualViewportKey } from '../helpers/visual';

const THEMES = ['classic', 'midnight', 'warm'] as const;

const FULL_BOARDS = [
  'ui-board-modal',
  'ui-board-sheet',
  'ui-board-segmented',
  'ui-board-buttons',
  'ui-board-fields',
] as const;

const PARTIAL_BOARDS = ['ui-board-stack', 'ui-board-skeleton', 'ui-board-pagetitle'] as const;

const FULL_VIEWPORTS: VisualViewportKey[] = ['m360', 'm390', 't768', 'd1280'];
const PARTIAL_VIEWPORTS: VisualViewportKey[] = ['m390', 'd1280'];

test.describe('UI primitives boards (/dev/ui)', () => {
  for (const theme of THEMES) {
    for (const board of FULL_BOARDS) {
      for (const viewportKey of FULL_VIEWPORTS) {
        test(`${board} ${theme} @ ${viewportKey}`, async ({ page }) => {
          await page.goto(`/dev/ui?theme=${theme}`, { waitUntil: 'networkidle' });
          await expect(page.getByTestId('ui-primitives-board')).toBeVisible();
          await page.setViewportSize(VIEWPORTS[viewportKey]);
          const section = page.getByTestId(board);
          await section.scrollIntoViewIfNeeded();
          await prepareForScreenshot(page);
          await expect(section).toHaveScreenshot(`${board}-${theme}-${viewportKey}.png`);
        });
      }
    }

    for (const board of PARTIAL_BOARDS) {
      for (const viewportKey of PARTIAL_VIEWPORTS) {
        test(`${board} ${theme} @ ${viewportKey}`, async ({ page }) => {
          await page.goto(`/dev/ui?theme=${theme}`, { waitUntil: 'networkidle' });
          await expect(page.getByTestId('ui-primitives-board')).toBeVisible();
          await page.setViewportSize(VIEWPORTS[viewportKey]);
          const section = page.getByTestId(board);
          await section.scrollIntoViewIfNeeded();
          await prepareForScreenshot(page);
          await expect(section).toHaveScreenshot(`${board}-${theme}-${viewportKey}.png`);
        });
      }
    }
  }
});
