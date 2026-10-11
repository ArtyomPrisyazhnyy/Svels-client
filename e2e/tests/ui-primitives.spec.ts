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

  test('modal header title stays centered with headerEnd action', async ({ page }) => {
    const panel = page.getByTestId('ui-modal-header-preview');
    await expect(panel).toBeVisible();
    const title = panel.locator('.ui-overlay-panel__title');
    const panelBox = await panel.boundingBox();
    const titleBox = await title.boundingBox();
    expect(panelBox).not.toBeNull();
    expect(titleBox).not.toBeNull();
    if (panelBox && titleBox) {
      const panelCenter = panelBox.x + panelBox.width / 2;
      const titleCenter = titleBox.x + titleBox.width / 2;
      expect(Math.abs(panelCenter - titleCenter)).toBeLessThanOrEqual(1);
    }
  });

  test('sheet inside modal survives parent rerender; escape closes sheet first', async ({ page }) => {
    await page.getByTestId('ui-rerender-modal-open').click();
    await expect(page.getByTestId('ui-rerender-modal')).toBeVisible();
    await page.getByTestId('ui-rerender-sheet-open').click();
    await expect(page.getByTestId('ui-rerender-sheet')).toBeVisible();
    await page.getByTestId('ui-rerender-bump').click();
    await expect(page.getByTestId('ui-rerender-tick')).toContainText('tick=1');
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('ui-rerender-sheet')).toBeHidden();
    await expect(page.getByTestId('ui-rerender-modal')).toBeVisible();
  });

  test('segmented labels fit at 360 without ellipsis', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto('/dev/ui?theme=classic', { waitUntil: 'networkidle' });
    const board = page.getByTestId('ui-board-segmented');
    await expect(board).toBeVisible();
    const labels = await board.locator('.ui-seg__label').evaluateAll((nodes) =>
      nodes.map((node) => {
        const el = node as HTMLElement;
        const style = getComputedStyle(el);
        const range = document.createRange();
        range.selectNodeContents(el);
        return {
          text: (el.textContent ?? '').trim(),
          lines: range.getClientRects().length,
          textOverflow: style.textOverflow,
          whiteSpace: style.whiteSpace,
        };
      }),
    );
    expect(labels.map((label) => label.text)).toEqual(
      expect.arrayContaining([
        'Как можно скорее',
        'Ко времени',
        'Самовывоз',
        'Доставка',
        'В зале',
        'Наличными',
        'Картой на месте',
        'Картой онлайн',
      ]),
    );
    for (const label of labels) {
      expect(label.textOverflow, label.text).not.toBe('ellipsis');
      expect(label.whiteSpace, label.text).not.toBe('nowrap');
      expect(label.lines, label.text).toBeLessThanOrEqual(2);
    }
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
