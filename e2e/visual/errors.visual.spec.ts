import { expect, test } from '@playwright/test';
import { E2E_ERROR_VISUAL_THEMES } from '../helpers/restaurant-themes';
import { expectRestaurantThemeApplied } from '../helpers/expect-restaurant-theme';
import type { RestaurantColorTheme } from '../../src/shared/types/restaurant-styling';

const VARIANTS = ['network', 'server'] as const;

const VIEWPORTS = [
  { name: 'm390', width: 390, height: 844 },
  { name: 'd1280', width: 1280, height: 800 },
] as const;

for (const theme of E2E_ERROR_VISUAL_THEMES) {
  for (const variant of VARIANTS) {
    for (const viewport of VIEWPORTS) {
      test(`error state ${variant} — ${theme} @ ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(`/dev/ui/errors?theme=${theme}&variant=${variant}`, {
          waitUntil: 'networkidle',
        });

        await expectRestaurantThemeApplied(page, theme as RestaurantColorTheme, `errors/${theme}`);

        const root = page.getByTestId('dev-error-playground-root');
        await expect(root).toBeVisible();

        await expect(root).toHaveScreenshot(`error-${variant}-${theme}-${viewport.name}.png`);
      });
    }
  }
}
