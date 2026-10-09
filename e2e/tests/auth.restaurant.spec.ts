import { test, expect, apiClient } from '../fixtures/test';

test.describe('Restaurant auth UI', () => {
  test('страница регистрации/логина рендерится', async ({ page }) => {
    await page.goto('/auth/restaurant');

    await expect(page.getByTestId('restaurant-auth-page')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Для заведений' })).toBeVisible();
    await expect(page.getByTestId('auth-tab-register')).toBeVisible();
    await expect(page.getByTestId('auth-tab-login')).toBeVisible();
    await expect(page.getByLabel('Название заведения / сети')).toBeVisible();
  });

  test('переключение на вкладку входа показывает форму', async ({ page }) => {
    await page.goto('/auth/restaurant');
    await page.getByTestId('auth-tab-login').click();
    await expect(page.getByTestId('login-form')).toBeVisible();
    await expect(page.getByTestId('login-email')).toBeVisible();
    await expect(page.getByTestId('login-password')).toBeVisible();
  });

  test('неверный логин показывает ошибку', async ({ page }) => {
    await page.goto('/auth/restaurant');
    await page.getByTestId('auth-tab-login').click();
    await page.getByTestId('login-email').fill('nobody@svels.test');
    await page.getByTestId('login-password').fill('WrongPass123');
    await page.getByTestId('login-submit').click();
    await expect(page.getByTestId('auth-error')).toBeVisible();
  });

  test('суперадмин входит и попадает в /admin', async ({ page, seed }) => {
    await page.goto('/auth/restaurant');
    await page.getByTestId('auth-tab-login').click();
    await page.getByTestId('login-email').fill(seed.superAdmin.email);
    await page.getByTestId('login-password').fill(seed.superAdmin.password);
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByTestId('super-admin-page')).toBeVisible();
  });

  test('админ заведения входит и попадает в /restaurant-admin/menu', async ({ page, seed }) => {
    await page.goto('/auth/restaurant');
    await page.getByTestId('auth-tab-login').click();
    await page.getByTestId('login-email').fill(seed.restaurantAdmin.email);
    await page.getByTestId('login-password').fill(seed.restaurantAdmin.password);
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/\/restaurant-admin\/menu$/);
    await expect(page.getByTestId('restaurant-admin-layout')).toBeVisible();
  });

  test('подача заявки на регистрацию ресторана', async ({ page, seed }) => {
    test.setTimeout(120_000);
    await page.context().clearCookies();
    const stamp = Date.now().toString(36);
    const email = `e2e.reg.${stamp}@svels.test`;
    const password = `E2eReg!${stamp}`;
    const businessName = `Pending Cafe ${stamp}`;

    await page.goto('/auth/restaurant');
    await page.locator('#rest-firstName').fill('E2E');
    await page.locator('#rest-lastName').fill('Owner');
    await page.locator('#rest-email').fill(email);
    await page.locator('#rest-password').fill(password);
    await page.locator('#rest-confirm').fill(password);
    await page.locator('#rest-business').fill(businessName);
    await page.locator('#rest-unp').fill(String(Math.floor(100000000 + Math.random() * 899999999)));
    await page.locator('#loc-city-0').fill('Минск');
    await page.locator('#loc-address-0').fill('ул. Очереди 5');

    // После setAuth RestaurantAuthRoute редиректит role=user на `/`,
    // поэтому success-баннер на /auth/restaurant не успевает остаться в DOM.
    const [response] = await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes('/restaurants/register') && res.request().method() === 'POST',
        { timeout: 90_000 },
      ),
      page.getByRole('button', { name: 'Отправить заявку' }).click(),
    ]);
    expect(response.ok()).toBeTruthy();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('button', { name: /выйти/i })).toBeVisible();

    const pending = await apiClient.getPendingRegistrations(seed.superAdmin.auth.accessToken);
    expect(pending.some((item) => item.name.includes(businessName))).toBeTruthy();
  });
});
