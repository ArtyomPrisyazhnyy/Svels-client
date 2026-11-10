import { test, expect, apiClient } from '../fixtures/test';
import { normalizeStyling, toStylingPayload } from '../../src/features/restaurant-admin/styling/styling-model';

test.describe('Стилизация заведения', () => {
  test('шрифт, карточка и тема сразу видны в превью и сохраняются', async ({
    page,
    seed,
    asRestaurantAdmin,
  }) => {
    void asRestaurantAdmin;
    const original = normalizeStyling(await apiClient.getStyling(seed.restaurantId));
    const font = original.fontFamily === 'playfair' ? 'montserrat' : 'playfair';
    const card = original.cardStyle === 'magazine' ? 'overlay' : 'magazine';
    const theme = original.colorTheme === 'neon' ? 'citrus' : 'neon';

    try {
      await page.goto('/restaurant-admin/styling');
      await expect(page.getByRole('heading', { name: 'Стилизация' })).toBeVisible();
      const preview = page.getByTestId('styling-preview');
      await expect(preview).toBeVisible();

      await page.getByTestId(`styling-font-${font}`).click();
      await page.getByTestId(`styling-card-${card}`).click();
      await page.getByTestId(`styling-theme-${theme}`).click();

      const shell = preview.locator('xpath=..');
      await expect(preview).toHaveAttribute('data-preview-font', font);
      await expect(shell).toHaveAttribute('data-rs-theme', theme);
      await expect(shell).toHaveAttribute('data-rs-card-style', card);
      await expect(page.getByTestId(`styling-font-${font}`)).toHaveAttribute('aria-checked', 'true');

      await expect(page.getByTestId('styling-save')).toBeEnabled();
      await page.getByTestId('styling-save').click();
      await expect(page.getByText('Стилизация сохранена')).toBeVisible();

      await page.reload();
      await expect(page.getByTestId(`styling-theme-${theme}`)).toHaveAttribute('aria-checked', 'true');
      await expect(page.getByTestId(`styling-card-${card}`)).toHaveAttribute('aria-checked', 'true');
      await expect(page.getByTestId(`styling-font-${font}`)).toHaveAttribute('aria-checked', 'true');
      await expect(page.getByTestId('styling-preview')).toHaveAttribute('data-preview-font', font);
      await expect(page.getByTestId('styling-preview').locator('xpath=..')).toHaveAttribute('data-rs-theme', theme);
    } finally {
      await apiClient.patchStyling(
        seed.restaurantId,
        seed.restaurantAdmin.auth.accessToken,
        toStylingPayload(original),
      );
    }
  });

  test('на узком экране превью открывается нижней шторкой', async ({ page, asRestaurantAdmin }) => {
    void asRestaurantAdmin;
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/restaurant-admin/styling');

    await expect(page.getByTestId('styling-preview-open')).toBeVisible();
    await expect(page.getByTestId('styling-preview')).toHaveCount(0);

    await page.getByTestId('styling-theme-citrus').click();
    await page.getByTestId('styling-preview-open').click();
    const sheet = page.getByTestId('styling-preview-sheet');
    await expect(sheet).toBeVisible();
    await expect(page.getByTestId('styling-preview-sheet-close')).toHaveCount(0);
    await expect(sheet.getByText('Закрыть')).toHaveCount(0);
    await expect(page.getByTestId('styling-preview')).toBeVisible();
    await expect(page.getByTestId('styling-preview').locator('xpath=..')).toHaveAttribute(
      'data-rs-theme',
      'citrus',
    );

    await page.locator('.ui-sheet__backdrop').click({ position: { x: 12, y: 12 } });
    await expect(sheet).toBeHidden();
  });
});
