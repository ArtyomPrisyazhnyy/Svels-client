import { test, expect } from '@playwright/test';
import { snapCartPanel } from '../helpers/cart-visual';
import { VIEWPORTS } from '../helpers/visual';

const THEMES = ['classic', 'midnight', 'neon', 'citrus'] as const;

test.describe('Cart variant preview visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  for (const theme of THEMES) {
    for (const viewportKey of ['m390', 'd1280'] as const) {
      test(`summary ${theme} @${viewportKey}`, async ({ page }) => {
        // Tall viewport so the sheet, including the sticky total, is fully in frame.
        await page.setViewportSize({ ...VIEWPORTS[viewportKey], height: 1400 });
        await page.goto(`/dev/cart-variants?theme=${theme}&variant=summary`, {
          waitUntil: 'networkidle',
        });
        const panel = page.getByTestId('cart-variant-panel');
        await expect(panel).toBeVisible();
        await expect(panel.getByText('Капучино')).toBeVisible();
        await expect(panel.getByTestId('cart-modal-footer')).toBeVisible();
        const box = await panel.boundingBox();
        expect(box).not.toBeNull();
        expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(1400);
        const photo = panel.locator('.restaurant-cart-modal__item-media img').first();
        await expect(photo).toBeVisible();
        await expect
          .poll(() => photo.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0))
          .toBe(true);
        await snapCartPanel(page, panel, `cart-variant-summary-${theme}-${viewportKey}`);
      });
    }
  }

  for (const variant of ['dock', 'receipt'] as const) {
    test(`${variant} classic @m390`, async ({ page }) => {
      await page.setViewportSize({ ...VIEWPORTS.m390, height: 1400 });
      await page.goto(`/dev/cart-variants?theme=classic&variant=${variant}`, {
        waitUntil: 'networkidle',
      });
      const panel = page.getByTestId('cart-variant-panel');
      await expect(panel).toBeVisible();
      await expect(panel.getByText('Капучино')).toBeVisible();
      const footerId = variant === 'dock' ? 'cart-variant-dock-checkout' : 'cart-modal-footer';
      await expect(panel.getByTestId(footerId)).toBeVisible();
      const box = await panel.boundingBox();
      expect(box).not.toBeNull();
      expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(1400);
      await snapCartPanel(page, panel, `cart-variant-${variant}-classic-m390`);
    });
  }
});
