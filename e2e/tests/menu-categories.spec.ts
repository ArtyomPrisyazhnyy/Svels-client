import { test, expect, apiClient } from '../fixtures/test';

test.describe('Menu categories', () => {
  test('переименование, сортировка и удаление пустой категории', async ({
    page,
    asRestaurantAdmin,
    seed,
  }) => {
    void asRestaurantAdmin;
    const stamp = Date.now().toString(36);
    const restaurantId = seed.restaurantId;
    const token = seed.restaurantAdmin.auth.accessToken;

    const catA = await apiClient.createMenuCategory(restaurantId, token, `Cat A ${stamp}`);
    const catB = await apiClient.createMenuCategory(restaurantId, token, `Cat B ${stamp}`);

    await page.goto('/restaurant-admin/menu');
    await expect(page.getByTestId(`menu-category-${catA.id}`)).toBeVisible({ timeout: 15_000 });

    page.once('dialog', (dialog) => dialog.accept(`Renamed ${stamp}`));
    await page.getByTestId(`category-rename-${catA.id}`).click();
    await expect(page.getByTestId(`menu-category-${catA.id}`)).toContainText(`Renamed ${stamp}`);

    await page.getByTestId(`category-move-up-${catB.id}`).click();
    await page.getByTestId(`category-move-down-${catA.id}`).click();

    page.once('dialog', (dialog) => dialog.accept());
    await page.getByTestId(`category-delete-${catB.id}`).click();
    await expect(page.getByTestId(`menu-category-${catB.id}`)).toHaveCount(0, {
      timeout: 15_000,
    });
  });

  test('удаление непустой категории показывает понятную ошибку', async ({
    page,
    asRestaurantAdmin,
    seed,
  }) => {
    void asRestaurantAdmin;
    const stamp = Date.now().toString(36);
    const restaurantId = seed.restaurantId;
    const token = seed.restaurantAdmin.auth.accessToken;

    const category = await apiClient.createMenuCategory(restaurantId, token, `Full ${stamp}`);
    await apiClient.createMenuItem(restaurantId, token, {
      categoryId: category.id,
      name: `Dish ${stamp}`,
      price: 10,
      imageUrl: 'https://example.com/e2e.jpg',
    });

    await page.goto('/restaurant-admin/menu');
    await expect(page.getByTestId(`menu-category-${category.id}`)).toBeVisible({
      timeout: 15_000,
    });

    page.once('dialog', (dialog) => dialog.accept());
    await page.getByTestId(`category-delete-${category.id}`).click();
    await expect(page.getByText(/с позициями меню/i)).toBeVisible({ timeout: 10_000 });
  });
});
