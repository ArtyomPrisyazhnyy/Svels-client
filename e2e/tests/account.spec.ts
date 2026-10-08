import { test, expect } from '../fixtures/test';

test.describe('Guest account', () => {
  test('неавторизованный → auth', async ({ page, seed }) => {
    await page.goto(`/restaurants/${seed.restaurantId}/account`);
    await expect(page).toHaveURL(new RegExp(`/restaurants/${seed.restaurantId}/auth`));
  });

  test('кабинет показывает профиль и блок броней', async ({ page, seed, asGuest }) => {
    void asGuest;
    await page.goto(`/restaurants/${seed.restaurantId}/account`);

    await expect(page.getByTestId('guest-account-page')).toBeVisible();
    await expect(page.getByText(/Seed/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /выйти/i })).toBeVisible();
  });

  test('выход из аккаунта очищает сессию', async ({ page, seed, asGuest }) => {
    void asGuest;
    await page.goto(`/restaurants/${seed.restaurantId}/account`);
    await expect(page.getByTestId('guest-account-page')).toBeVisible();
    await page.getByRole('button', { name: /выйти/i }).click();

    await page.goto(`/restaurants/${seed.restaurantId}/account`);
    await expect(page).toHaveURL(new RegExp(`/restaurants/${seed.restaurantId}/auth`));
  });
});
