import { test, expect } from '@playwright/test';
import { prepareForScreenshot, VIEWPORTS, type VisualViewportKey } from '../helpers/visual';

const THEMES = ['classic', 'midnight', 'neon', 'citrus'] as const;
const VARIANTS = ['studio', 'canvas', 'inspector'] as const;
const VIEWPORT_KEYS: VisualViewportKey[] = ['m390', 'd1280'];

test.describe('Admin styling variants', () => {
  for (const variant of VARIANTS) {
    for (const theme of THEMES) {
      for (const viewportKey of VIEWPORT_KEYS) {
        test(`${variant} ${theme} @ ${viewportKey}`, async ({ page }) => {
          await page.setViewportSize(VIEWPORTS[viewportKey]);
          await page.goto(`/dev/admin-styling-variants?variant=${variant}&theme=${theme}`, {
            waitUntil: 'networkidle',
          });
          await expect(page.getByTestId('styling-variants')).toBeVisible();
          await expect(page.getByTestId(`styling-theme-${theme}`)).toHaveAttribute('aria-checked', 'true');
          if (variant !== 'studio' || viewportKey === 'd1280') {
            const previewId = variant === 'studio' ? 'styling-preview' : 'styling-preview-site';
            await expect(page.getByTestId(previewId).locator('xpath=..')).toHaveAttribute('data-rs-theme', theme);
          }
          await prepareForScreenshot(page);
          await expect(page).toHaveScreenshot(`admin-styling-${variant}-${theme}-${viewportKey}.png`);
        });
      }
    }
  }
});
