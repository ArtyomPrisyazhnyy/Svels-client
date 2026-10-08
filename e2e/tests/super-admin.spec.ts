import { test, expect, apiClient } from '../fixtures/test';

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
});
