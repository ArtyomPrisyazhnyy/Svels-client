import { test, expect } from '@playwright/test';

const LONG_NAME =
  'Очень длинное название блюда с двойной порцией, сезонными добавками и соусом на выбор';

async function assertStageFits(page: import('@playwright/test').Page) {
  const fit = await page.evaluate(() => {
    const root = document.documentElement;
    const stage = document.querySelector('[data-testid="cart-variant-stage"]');
    const name = document.querySelector(
      '.restaurant-cart-modal__item-title, .cart-dock__name, .cart-receipt__name',
    );
    return {
      page: root.scrollWidth - root.clientWidth,
      stage: stage instanceof HTMLElement ? stage.scrollWidth - stage.clientWidth : 0,
      name: name instanceof HTMLElement ? name.scrollWidth - name.clientWidth : 0,
    };
  });
  expect(fit.page).toBeLessThanOrEqual(1);
  expect(fit.stage).toBeLessThanOrEqual(1);
  expect(fit.name).toBeLessThanOrEqual(1);
}

test.describe('Cart variant preview', () => {
  test('noindex, вкладки и одни и те же позиции', async ({ page }) => {
    await page.goto('/dev/cart-variants?theme=classic&variant=summary');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.getByTestId('cart-variants-page')).toBeVisible();
    await expect(page.getByTestId('cart-variant-stage')).toHaveAttribute('data-variant', 'summary');
    await expect(page.getByTestId('cart-variant-panel')).toContainText('Капучино');
    await expect(page.getByTestId('cart-variant-panel')).toContainText(LONG_NAME);

    await page.getByTestId('cart-variant-tab-dock').click();
    await expect(page.getByTestId('cart-variant-stage')).toHaveAttribute('data-variant', 'dock');
    await expect(page.getByTestId('cart-variant-dock-summary')).toBeVisible();
    await expect(page.getByTestId('cart-variant-panel')).toContainText(LONG_NAME);

    await page.getByTestId('cart-variant-tab-receipt').click();
    await expect(page.getByTestId('cart-variant-stage')).toHaveAttribute('data-variant', 'receipt');
    await expect(page.getByTestId('cart-variant-receipt-fulfillment')).toBeVisible();
    await expect(page.getByTestId('cart-variant-panel')).toContainText('Чизкейк');
  });

  test('количество сохраняется при смене варианта, очистка показывает пустую корзину', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/dev/cart-variants?theme=classic&variant=summary');
    const counter = page.getByTestId('cart-item-counter').first();
    await counter.getByRole('button', { name: 'Увеличить количество' }).click();
    await expect(counter).toContainText('2');

    await page.getByTestId('cart-variant-tab-dock').click();
    await expect(page.getByTestId('cart-item-counter').first()).toContainText('2');

    await page.getByTestId('cart-variant-tab-summary').click();
    await page.getByTestId('cart-clear').click();
    await page.getByTestId('cart-clear-confirm-yes').click();
    await expect(page.getByTestId('cart-empty')).toBeVisible();
    await expect(page.getByTestId('cart-variant-checkout')).toBeDisabled();

    await page.getByTestId('cart-variant-tab-receipt').click();
    await expect(page.getByTestId('cart-variant-empty')).toBeVisible();
  });

  test('док открывает sheet деталей, чек раскрывает получение на месте', async ({ page }) => {
    await page.goto('/dev/cart-variants?theme=midnight&variant=dock');
    await page.getByTestId('cart-variant-dock-summary').click();
    await expect(page.getByTestId('cart-variant-dock-sheet')).toBeVisible();
    await page.getByRole('radio', { name: 'Самовывоз' }).click();
    await page.getByTestId('cart-variant-dock-done').click();
    await expect(page.getByTestId('cart-variant-dock-sheet')).toBeHidden();
    await expect(page.getByTestId('cart-variant-dock-summary')).toContainText('Самовывоз');

    await page.getByTestId('cart-variant-tab-receipt').click();
    await page.getByTestId('cart-variant-receipt-fulfillment').click();
    await expect(page.getByTestId('cart-fulfillment-segmented')).toBeVisible();
  });

  test('нет горизонтального переполнения на 320, 390 и 1280', async ({ page }) => {
    for (const width of [320, 390, 1280]) {
      await page.setViewportSize({ width, height: 800 });
      for (const variant of ['summary', 'dock', 'receipt'] as const) {
        await page.goto(`/dev/cart-variants?theme=classic&variant=${variant}`);
        await expect(page.getByTestId('cart-variant-panel')).toBeVisible();
        await assertStageFits(page);
      }
    }
  });

  test('скрины тем отличаются', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/dev/cart-variants?theme=classic&variant=summary');
    const panel = page.getByTestId('cart-variant-panel');
    await expect(panel).toBeVisible();
    const classic = await panel.screenshot();
    await page.goto('/dev/cart-variants?theme=midnight&variant=summary');
    await expect(panel).toBeVisible();
    const midnight = await panel.screenshot();
    await page.goto('/dev/cart-variants?theme=neon&variant=summary');
    await expect(panel).toBeVisible();
    const neon = await panel.screenshot();
    await page.goto('/dev/cart-variants?theme=citrus&variant=summary');
    await expect(panel).toBeVisible();
    const citrus = await panel.screenshot();
    expect(Buffer.compare(classic, midnight)).not.toBe(0);
    expect(Buffer.compare(classic, neon)).not.toBe(0);
    expect(Buffer.compare(classic, citrus)).not.toBe(0);
    expect(Buffer.compare(midnight, neon)).not.toBe(0);
    expect(Buffer.compare(neon, citrus)).not.toBe(0);
  });
});
