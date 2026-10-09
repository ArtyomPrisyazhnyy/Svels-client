import { test, expect, apiClient } from '../fixtures/test';
import { getApiUrl, readSeed } from '../helpers/env';

test.describe('Super admin', () => {
  test('панель модерации открывается', async ({ page, asSuperAdmin }) => {
    void asSuperAdmin;
    await page.goto('/admin');

    await expect(page.getByTestId('super-admin-page')).toBeVisible();
    await expect(page.getByText(/Суперадмин/i)).toBeVisible();
    await expect(
      page.getByText(/Нет заявок на модерации|Загрузка заявок|УНП:/i).first(),
    ).toBeVisible({ timeout: 15_000 });
  });

  test('одобрение заявки через UI', async ({ page, asSuperAdmin, seed }) => {
    void asSuperAdmin;

    const stamp = Date.now().toString(36);
    const email = `e2e.mod.${stamp}@svels.test`;
    const password = `E2eMod!${stamp}`;
    const name = `Moderation Cafe ${stamp}`;

    const registered = await apiClient.register({
      email,
      password,
      firstName: 'Mod',
      lastName: 'Owner',
    });
    const request = await apiClient.registerRestaurant(registered.accessToken, {
      name,
      unp: String(Math.floor(100000000 + Math.random() * 899999999)),
      isChain: false,
      locations: [{ address: 'ул. Модерации 2' }],
    });

    await page.goto('/admin');
    await expect(page.getByTestId(`registration-card-${request.id}`)).toBeVisible({
      timeout: 15_000,
    });
    await page.getByTestId(`registration-approve-${request.id}`).click();
    await expect(page.getByTestId(`registration-card-${request.id}`)).toHaveCount(0, {
      timeout: 15_000,
    });

    const adminAuth = await apiClient.login(email, password);
    expect(adminAuth.user.role).toBe('restaurant_admin');
    expect(adminAuth.user.restaurantId).toBeTruthy();
  });

  test('отклонение заявки через UI', async ({ page, asSuperAdmin }) => {
    void asSuperAdmin;

    const stamp = Date.now().toString(36);
    const email = `e2e.rej.${stamp}@svels.test`;
    const password = `E2eRej!${stamp}`;
    const name = `Reject Cafe ${stamp}`;

    const registered = await apiClient.register({
      email,
      password,
      firstName: 'Rej',
      lastName: 'Owner',
    });
    const request = await apiClient.registerRestaurant(registered.accessToken, {
      name,
      unp: String(Math.floor(100000000 + Math.random() * 899999999)),
      isChain: false,
      locations: [{ address: 'ул. Отклонения 3' }],
    });

    await page.goto('/admin');
    await expect(page.getByTestId(`registration-card-${request.id}`)).toBeVisible({
      timeout: 15_000,
    });

    page.once('dialog', (dialog) => dialog.accept('e2e reject'));
    await page.getByTestId(`registration-reject-${request.id}`).click();
    await expect(page.getByTestId(`registration-card-${request.id}`)).toHaveCount(0, {
      timeout: 15_000,
    });
  });

  test('logout суперадмина', async ({ page, asSuperAdmin }) => {
    void asSuperAdmin;
    await page.goto('/admin');
    await page.getByTestId('super-admin-logout').click();
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/auth\/restaurant/);
  });

  test('вкладки «Заявки» и «Заведения»', async ({ page, asSuperAdmin }) => {
    void asSuperAdmin;
    await page.goto('/admin');
    await expect(page.getByTestId('super-admin-tab-registrations')).toBeVisible();
    await page.getByTestId('super-admin-tab-restaurants').click();
    await expect(page.getByTestId('super-admin-restaurants-tab')).toBeVisible();
    await expect(page.getByTestId('restaurants-search')).toBeVisible();
    await page.getByTestId('super-admin-tab-registrations').click();
    await expect(
      page.getByText(/Нет заявок на модерации|Загрузка заявок|УНП:/i).first(),
    ).toBeVisible();
  });
});

test.describe('Super admin restaurants', () => {
  test('создание заведения и ссылка владельцу', async ({ page, asSuperAdmin }) => {
    void asSuperAdmin;
    const stamp = Date.now().toString(36);
    const ownerEmail = `e2e.owner.${stamp}@svels.test`;

    await page.goto('/admin');
    await page.getByTestId('super-admin-tab-restaurants').click();
    await page.getByTestId('restaurants-create-toggle').click();

    await page.getByTestId('create-restaurant-name').fill(`Onboard Cafe ${stamp}`);
    await page.getByTestId('create-restaurant-address').fill('ул. Онбординга 1');
    await page.getByTestId('create-restaurant-owner-email').fill(ownerEmail);
    await page.getByTestId('create-restaurant-owner-first-name').fill('Owner');
    await page.getByTestId('create-restaurant-submit').click();

    await expect(page.getByTestId('owner-set-password-url')).toBeVisible({ timeout: 20_000 });
    const setPasswordUrl = await page.getByTestId('owner-set-password-url').inputValue();
    expect(setPasswordUrl).toMatch(/token=/);

    await expect(page.getByTestId('owner-invite-telegram')).toHaveAttribute(
      'href',
      /t\.me\/share\/url/,
    );
  });

  test('страница установки пароля и вход владельца', async ({ page }) => {
    const stamp = Date.now().toString(36);

    const seed = readSeed();
    const superToken = seed.superAdmin.auth.accessToken;

    const createResponse = await page.request.post(
      `${getApiUrl()}/restaurants/admin/create`,
      {
        headers: {
          Authorization: `Bearer ${superToken}`,
          'Content-Type': 'application/json',
        },
        data: {
          name: `SetPwd Cafe ${stamp}`,
          address: 'ул. Пароля 5',
          owner: {
            email: `e2e.setpwd.${stamp}@svels.test`,
            firstName: 'New',
            lastName: 'Owner',
          },
        },
      },
    );

    expect(createResponse.ok()).toBeTruthy();

    const body = (await createResponse.json()) as { setPasswordUrl: string };
    const token = new URL(body.setPasswordUrl).searchParams.get('token');
    expect(token).toBeTruthy();

    const password = `E2eOwner!${stamp}`;
    await page.goto(`/auth/set-password?token=${encodeURIComponent(token!)}`);
    await expect(page.getByTestId('set-password-page')).toBeVisible();
    await page.getByTestId('set-password-input').fill(password);
    await page.getByTestId('set-password-confirm').fill(password);
    await page.getByTestId('set-password-submit').click();

    await expect(page).toHaveURL(/\/restaurant-admin/, { timeout: 20_000 });
  });
});
