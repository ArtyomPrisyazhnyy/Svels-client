import { test, expect, apiClient } from '../fixtures/test';
import type { Page } from '@playwright/test';

async function getMenuCategoryIdsInDom(page: Page): Promise<string[]> {
  const nodes = page.locator('[data-testid^="menu-category-"]');
  const count = await nodes.count();
  const ids: string[] = [];
  for (let index = 0; index < count; index += 1) {
    const testId = await nodes.nth(index).getAttribute('data-testid');
    if (testId?.startsWith('menu-category-')) {
      ids.push(testId.slice('menu-category-'.length));
    }
  }
  return ids;
}

function orderCategoriesWithPairFirst(
  categoryIds: string[],
  firstId: string,
  secondId: string,
): string[] {
  const rest = categoryIds.filter((id) => id !== firstId && id !== secondId);
  return [...rest, firstId, secondId];
}

async function expectCatBeforeCat(
  page: Page,
  beforeId: string,
  afterId: string,
): Promise<void> {
  await expect
    .poll(
      async () => {
        const ids = await getMenuCategoryIdsInDom(page);
        return ids.indexOf(beforeId) < ids.indexOf(afterId);
      },
      { timeout: 10_000 },
    )
    .toBe(true);
}

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

    const menu = await apiClient.getMenu(restaurantId);
    const orderedIds = orderCategoriesWithPairFirst(
      menu.categories.map((category) => category.id),
      catA.id,
      catB.id,
    );
    await apiClient.reorderMenuCategories(restaurantId, token, orderedIds);

    await page.goto('/restaurant-admin/menu');
    await expect(page.getByTestId(`menu-category-${catA.id}`)).toBeVisible({ timeout: 15_000 });

    await expectCatBeforeCat(page, catA.id, catB.id);

    page.once('dialog', (dialog) => dialog.accept(`Renamed ${stamp}`));
    await page.getByTestId(`category-rename-${catA.id}`).click();
    await expect(page.getByTestId(`menu-category-${catA.id}`)).toContainText(`Renamed ${stamp}`);

    await expectCatBeforeCat(page, catA.id, catB.id);

    await page.getByTestId(`category-move-up-${catB.id}`).click();
    await expectCatBeforeCat(page, catB.id, catA.id);

    const moveDown = page.getByTestId(`category-move-down-${catA.id}`);
    const idsAfterMoveUp = await getMenuCategoryIdsInDom(page);
    const catAIsLast = idsAfterMoveUp.indexOf(catA.id) === idsAfterMoveUp.length - 1;

    if (catAIsLast) {
      await expect(moveDown).toBeDisabled();
    } else {
      await expect(moveDown).toBeEnabled();
      await moveDown.click();
      await expectCatBeforeCat(page, catB.id, catA.id);
    }

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
