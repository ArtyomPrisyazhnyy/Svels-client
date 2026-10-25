import { test, expect, apiClient } from '../fixtures/test';

const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mP8z8BQz0AEYBxVSF+FABJADveWkH6oAAAAAElFTkSuQmCC',
  'base64',
);

test.describe('Онбординг владельца', () => {
  test('УНП с буквами не уходит и объясняет, что писать', async ({ page }) => {
    await page.goto('/auth/restaurant');
    await expect(page.getByTestId('auth-unp-hint')).toBeVisible();
    await page.locator('#rest-firstName').fill('Анна');
    await page.locator('#rest-lastName').fill('Кофе');
    await page.locator('#rest-email').fill(`bad.unp.${Date.now().toString(36)}@svels.test`);
    await page.locator('#rest-password').fill('OwnerPass123');
    await page.locator('#rest-confirm').fill('OwnerPass123');
    await page.locator('#rest-business').fill('Кофейня без УНП');
    await page.locator('#rest-unp').fill('12345');
    await page.locator('#loc-city-0').fill('Минск');
    await page.locator('#loc-address-0').fill('ул. Немига 5');
    await page.getByTestId('auth-register-submit').click();
    await expect(page.getByTestId('auth-error')).toContainText('9 цифр');
    await expect(page.getByTestId('owner-application-status')).toHaveCount(0);
  });

  test('от заявки до ссылки для гостей', async ({ page, seed }) => {
    test.setTimeout(180_000);
    await page.context().clearCookies();
    const stamp = Date.now().toString(36);
    const email = `e2e.owner.${stamp}@svels.test`;
    const password = `OwnerPass!${stamp}`;
    const businessName = `Кофейня ${stamp}`;

    await page.goto('/auth/restaurant');
    await page.locator('#rest-firstName').fill('Анна');
    await page.locator('#rest-lastName').fill('Владелец');
    await page.locator('#rest-email').fill(email);
    await page.locator('#rest-password').fill(password);
    await page.locator('#rest-confirm').fill(password);
    await page.locator('#rest-business').fill(businessName);
    await page.locator('#rest-unp').fill(String(Math.floor(100000000 + Math.random() * 899999999)));
    await page.locator('#loc-city-0').fill('Минск');
    await page.locator('#loc-address-0').fill('ул. Немига 5');
    await page.getByTestId('auth-register-submit').click();

    const status = page.getByTestId('owner-application-status');
    await expect(status).toBeVisible();
    await expect(status).toHaveAttribute('data-status', 'pending');
    await expect(status).toContainText('на проверке');

    await page.goto('/restaurant-admin/launch');
    await expect(page).toHaveURL(/\/auth\/restaurant/);
    await expect(page.getByTestId('owner-application-status')).toBeVisible();

    const pending = await apiClient.getPendingRegistrations(seed.superAdmin.auth.accessToken);
    const request = pending.find((item) => item.name === businessName);
    expect(request).toBeTruthy();
    await apiClient.reviewRegistration(seed.superAdmin.auth.accessToken, request!.id, 'approve');

    await page.getByTestId('owner-status-logout').click();
    await page.goto('/auth/restaurant');
    await page.getByTestId('auth-tab-login').click();
    await page.getByTestId('login-email').fill(email);
    await page.getByTestId('login-password').fill(password);
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/\/restaurant-admin\/launch$/);
    await expect(page.getByTestId('launch-checklist')).toBeVisible();
    await expect(page.getByTestId('launch-progress')).toBeVisible();
    await expect(page.getByTestId('launch-step-payments')).toHaveAttribute('data-done', 'false');

    await page.getByTestId('venue-description').fill('Кофейня на Немиге. Варим фильтр и отдаём десерты с собой.');
    await page.getByTestId('venue-profile-save').click();
    await expect(page.getByTestId('launch-step-profile')).toHaveAttribute('data-done', 'true');

    await page.getByTestId('launch-step-hours-cta').click();
    await expect(page).toHaveURL(/\/restaurant-admin\/hours$/);
    await page.getByTestId('hours-apply-default').click();
    await expect(page.getByTestId('hours-admin')).toContainText('Часы сохранены');

    await page.getByTestId('nav-menu').click();
    await expect(page.getByTestId('menu-empty')).toBeVisible();
    await page.getByTestId('new-category-name').fill('Кофе');
    await page.getByTestId('category-create').click();
    await expect(page.getByText('Кофе').first()).toBeVisible();
    const uploadDone = page.waitForResponse(
      (response) =>
        response.url().includes('/menu/upload-image') && response.request().method() === 'POST',
    );
    await page.getByTestId('menu-item-photo').setInputFiles({
      name: 'coffee.png',
      mimeType: 'image/png',
      buffer: PNG,
    });
    const uploaded = await uploadDone;
    expect(uploaded.ok(), await uploaded.text()).toBeTruthy();
    await expect(page.getByTestId('menu-item-photo-ready')).toBeVisible();
    await page.locator('#item-name').fill('Капучино');
    await page.locator('#item-price').fill('7.50');
    await expect(page.getByTestId('item-category')).toHaveValue(/.+/);
    await expect(page.getByTestId('menu-item-submit')).toBeEnabled();
    await page.getByTestId('menu-item-submit').click();
    await expect(page.getByTestId('menu-item-error')).toHaveCount(0);
    await expect(page.locator('#item-name')).toHaveValue('');
    await expect(page.getByText('Капучино')).toBeVisible();

    await page.getByTestId('nav-styling').click();
    await page.locator('label', { has: page.locator('input[name="fontFamily"][value="georgia"]') }).click();
    await page.locator('label', { has: page.locator('input[name="colorTheme"][value="citrus"]') }).click();
    await page.locator('label', { has: page.locator('input[name="cardStyle"][value="elevated"]') }).click();
    await page.getByTestId('styling-save').click();
    await expect(page.getByText('Стилизация сохранена')).toBeVisible();

    await page.getByTestId('nav-order-settings').click();
    await expect(page.getByTestId('payment-optional-hint')).toHaveCount(0);
    const online = page.getByTestId('order-toggle-paymentOnline');
    await expect(online).toBeChecked();
    await online.uncheck();
    await page.getByTestId('order-settings-save').click();
    await expect(page.getByText('Настройки сохранены')).toBeVisible();

    await page.getByTestId('nav-payment-settings').click();
    await expect(page.getByTestId('payment-optional-hint')).toContainText('bePaid не нужен');

    await page.getByTestId('nav-orders').click();
    await page.getByTestId('telegram-create-link').click();
    await expect(page.getByTestId('telegram-link-code')).toBeVisible();
    await expect(page.getByTestId('telegram-bot-missing')).toBeVisible();

    await page.getByTestId('nav-preview').click();
    await expect(page.getByRole('heading', { name: 'Страница заведения' })).toBeVisible();
    await expect(page.getByText('Капучино').first()).toBeVisible();

    await page.getByTestId('nav-launch').click();
    await expect(page.getByTestId('launch-step-hours')).toHaveAttribute('data-done', 'true');
    await expect(page.getByTestId('launch-step-menu')).toHaveAttribute('data-done', 'true');
    await expect(page.getByTestId('launch-step-preview')).toHaveAttribute('data-done', 'true');
    await expect(page.getByTestId('launch-step-payments')).toHaveAttribute('data-done', 'true');
    await expect(page.getByTestId('launch-progress')).toContainText('из');
    await expect(page.getByTestId('launch-public-link')).toBeVisible();

    await page.getByTestId('app-request-phone').fill('+375 29 000-00-01');
    await page.getByTestId('app-request-submit').click();
    await expect(page.getByTestId('app-request-form')).toContainText(/Заявка/);
    await expect(page.getByTestId('launch-step-app')).toHaveAttribute('data-done', 'true');
  });
});
