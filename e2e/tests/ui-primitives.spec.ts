import { test, expect } from '@playwright/test';

test.describe('UI primitives playground', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dev/ui?theme=classic', { waitUntil: 'networkidle' });
    await expect(page.getByTestId('ui-primitives-board')).toBeVisible();
  });

  test('modal closes via backdrop, escape, close button; focus returns', async ({ page }) => {
    const opener = page.getByTestId('ui-open-modal');
    await opener.click();
    const modal = page.getByTestId('ui-live-modal');
    await expect(modal).toBeVisible();

    await page.getByTestId('ui-live-modal-body').click();
    await expect(modal).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden();
    await expect(opener).toBeFocused();

    await opener.click();
    await expect(modal).toBeVisible();
    await page.getByTestId('ui-live-modal-close').click();
    await expect(modal).toBeHidden();
    await expect(opener).toBeFocused();

    await opener.click();
    await expect(modal).toBeVisible();
    const backdrop = page.locator('.ui-modal__backdrop');
    await backdrop.click({ position: { x: 8, y: 8 } });
    await expect(modal).toBeHidden();
  });

  test('tab focus stays inside modal', async ({ page }) => {
    await page.getByTestId('ui-open-modal').click();
    const modal = page.getByTestId('ui-live-modal');
    await expect(modal).toBeVisible();
    await page.keyboard.press('Tab');
    await expect.poll(async () => {
      return modal.evaluate((el) => {
        const active = document.activeElement;
        return Boolean(active && el.contains(active));
      });
    }).toBe(true);
  });

  test('nested modal and sheet: escape closes only top layer', async ({ page }) => {
    await page.getByRole('button', { name: 'Вложенная модалка + sheet' }).click();
    await expect(page.getByTestId('ui-nested-modal')).toBeVisible();
    await page.getByRole('button', { name: 'Открыть sheet' }).click();
    await expect(page.getByTestId('ui-nested-sheet')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByTestId('ui-nested-sheet')).toBeHidden();
    await expect(page.getByTestId('ui-nested-modal')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByTestId('ui-nested-modal')).toBeHidden();
  });

  test('segmented control arrow keys change value', async ({ page }) => {
    const group = page.getByTestId('ui-seg-md');
    await group.getByRole('radio', { name: 'Как можно скорее' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(group.getByRole('radio', { name: 'Ко времени' })).toHaveAttribute('aria-checked', 'true');
    await page.keyboard.press('ArrowLeft');
    await expect(group.getByRole('radio', { name: 'Как можно скорее' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  test('loading button keeps width', async ({ page }) => {
    const button = page.getByTestId('ui-btn-loading');
    const before = await button.boundingBox();
    await button.click();
    await expect(button).toHaveAttribute('aria-busy', 'true');
    const during = await button.boundingBox();
    expect(before?.width).toBeDefined();
    expect(during?.width).toBe(before?.width);
  });
});
