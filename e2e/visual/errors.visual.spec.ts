import { expect, test } from '@playwright/test';

const THEMES = ['classic', 'midnight'] as const;
const VARIANTS = ['network', 'server'] as const;

const VIEWPORTS = [
  { name: 'm390', width: 390, height: 844 },
  { name: 'd1280', width: 1280, height: 800 },
] as const;

for (const theme of THEMES) {
  for (const variant of VARIANTS) {
    for (const viewport of VIEWPORTS) {
      test(`error state ${variant} — ${theme} @ ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(`/dev/ui/errors?theme=${theme}&variant=${variant}`, {
          waitUntil: 'networkidle',
        });

        const panel = page.getByTestId(`dev-error-${variant}`);
        await expect(panel).toBeVisible();

        await expect(panel).toHaveScreenshot(
          `error-${variant}-${theme}-${viewport.name}.png`,
        );
      });
    }
  }
}
