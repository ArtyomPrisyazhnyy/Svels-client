import { test, expect } from '../fixtures/test';

test.describe('Legal pages (platform)', () => {
  test('политика конфиденциальности отображает черновик и основные разделы', async ({ page }) => {
    await page.goto('/privacypolicy');

    await expect(page.getByTestId('privacy-policy-page')).toBeVisible();
    await expect(page.getByText(/ЧЕРНОВИК, требует проверки юристом/)).toBeVisible();
    await expect(page.getByRole('heading', { name: /Политика конфиденциальности Svels/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Права субъекта персональных данных' })).toBeVisible();
  });

  test('публичная оферта доступна на /offer', async ({ page }) => {
    await page.goto('/offer');

    await expect(page.getByTestId('offer-page')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Публичная оферта/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Годовая подписка' })).toBeVisible();
    await expect(page.getByText(/возврат уплаченных средств за неиспользованный период годовой подписки не производится/i)).toBeVisible();
  });
});

test.describe('Guest OTP privacy consent', () => {
  test('без согласия кнопка отправки кода неактивна', async ({ page, seed }) => {
    await page.goto(`/restaurants/${seed.restaurantId}/auth`);

    await page.getByTestId('otp-phone').fill('+375291234567');
    const submit = page.getByTestId('otp-send-submit');
    await expect(submit).toBeDisabled();

    await page.getByTestId('guest-otp-privacy-consent').check();
    await expect(submit).toBeEnabled();
    await expect(page.getByRole('link', { name: 'политикой конфиденциальности' })).toHaveAttribute(
      'href',
      '/privacypolicy',
    );
  });
});

test.describe('Restaurant legal (guest)', () => {
  test('в подвале есть ссылка на реквизиты', async ({ page, seed }) => {
    await page.goto(`/restaurants/${seed.restaurantId}`);

    const link = page.getByTestId('restaurant-footer-legal');
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(new RegExp(`/restaurants/${seed.restaurantId}/legal$`));
    await expect(page.getByTestId('restaurant-legal-page')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Условия обслуживания гостей/ })).toBeVisible();
  });
});

test.describe('Restaurant admin legal', () => {
  test('владелец видит раздел реквизитов в навигации', async ({ page, asRestaurantAdmin: _auth }) => {
    void _auth;
    await page.goto('/restaurant-admin/legal');
    await expect(page.getByTestId('legal-admin-page')).toBeVisible();
    await expect(page.getByTestId('legal-admin-legal-name')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Реквизиты' })).toBeVisible();
  });
});
