import { test, expect, apiClient } from '../fixtures/test';

test.describe('Guest OTP auth', () => {
  test('страница гостевой авторизации рендерится', async ({ page, seed }) => {
    await page.goto(`/restaurants/${seed.restaurantId}/auth`);
    await expect(page.getByTestId('guest-otp-phone-form')).toBeVisible();
    await expect(page.getByTestId('otp-phone')).toBeVisible();
  });

  test('полный OTP-флоу: телефон → код → регистрация', async ({ page, seed }) => {
    const phone = `+37529${String(Date.now()).slice(-7)}`;

    await page.goto(`/restaurants/${seed.restaurantId}/auth`);
    await page.getByTestId('otp-phone').fill(phone);
    await page.getByTestId('guest-otp-privacy-consent').check();
    await page.getByTestId('otp-send-submit').click();

    await expect(page.getByTestId('guest-otp-code-form')).toBeVisible({ timeout: 15_000 });

    const otp = await apiClient.getLastDevOtp(phone);
    await page.getByTestId('otp-code').fill(otp.code);
    await page.getByTestId('otp-verify-submit').click();

    await expect(page.getByLabel('Имя')).toBeVisible({ timeout: 10_000 });
    await page.getByLabel('Имя').fill('Гость');
    await page.getByLabel('Фамилия').fill('E2E');
    await page.getByRole('button', { name: 'Продолжить' }).click();

    await expect(page).toHaveURL(new RegExp(`/restaurants/${seed.restaurantId}/?$`));
    await expect(page.getByTestId('restaurant-public-page')).toBeVisible();
  });

  test('повторный вход существующего гостя по OTP', async ({ page, seed }) => {
    test.setTimeout(120_000);
    const phone = `+37533${String(Date.now()).slice(-7)}`;

    await page.goto(`/restaurants/${seed.restaurantId}/auth`);
    await page.getByTestId('otp-phone').fill(phone);
    await page.getByTestId('guest-otp-privacy-consent').check();
    await page.getByTestId('otp-send-submit').click();
    await expect(page.getByTestId('guest-otp-code-form')).toBeVisible({ timeout: 15_000 });

    let otp = await apiClient.getLastDevOtp(phone);
    await page.getByTestId('otp-code').fill(otp.code);
    await page.getByTestId('otp-verify-submit').click();
    await expect(page.getByLabel('Имя')).toBeVisible({ timeout: 10_000 });
    await page.getByLabel('Имя').fill('Return');
    await page.getByLabel('Фамилия').fill('Guest');
    await page.getByRole('button', { name: 'Продолжить' }).click();
    await expect(page.getByTestId('restaurant-public-page')).toBeVisible();

    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await page.goto(`/restaurants/${seed.restaurantId}/auth`);
    await page.getByTestId('otp-phone').fill(phone);
    await page.getByTestId('guest-otp-privacy-consent').check();
    await page.getByTestId('otp-send-submit').click();
    await expect(page.getByTestId('guest-otp-code-form')).toBeVisible({ timeout: 15_000 });

    otp = await apiClient.getLastDevOtp(phone);
    await page.getByTestId('otp-code').fill(otp.code);
    await page.getByTestId('otp-verify-submit').click();

    await expect(page).toHaveURL(new RegExp(`/restaurants/${seed.restaurantId}/?$`), {
      timeout: 15_000,
    });
  });
});
