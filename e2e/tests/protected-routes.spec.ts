import { test, expect, apiClient } from '../fixtures/test';
import { injectAuth } from '../helpers/auth';

test.describe('Protected routes', () => {
  test('гость без сессии не открывает /admin', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/auth\/restaurant/);
  });

  test('гость без сессии не открывает /restaurant-admin/*', async ({ page }) => {
    await page.goto('/restaurant-admin/menu');
    await expect(page).toHaveURL(/\/auth\/restaurant/);
  });

  test('restaurant_admin не открывает /admin', async ({ page, asRestaurantAdmin }) => {
    void asRestaurantAdmin;
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/restaurant-admin\/menu/);
  });

  test('super_admin перенаправляется с restaurant-admin на /admin', async ({
    page,
    asSuperAdmin,
  }) => {
    void asSuperAdmin;
    await page.goto('/restaurant-admin/menu');
    await expect(page).toHaveURL(/\/admin$/, { timeout: 10_000 });
  });

  test('чужой guest JWT не открывает account другого ресторана', async ({ page, seed }) => {
    const restaurants = await apiClient.listRestaurants();
    const other = restaurants.find((r) => r.id !== seed.restaurantId && r.status === 'approved');
    test.skip(!other, 'Need a second approved restaurant in DB');

    await injectAuth(page, seed.guest);
    await page.goto(`/restaurants/${other!.id}/account`);
    await expect(page).toHaveURL(new RegExp(`/restaurants/${other!.id}/auth`));
  });
});
