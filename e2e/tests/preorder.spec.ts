import { test, expect } from '../fixtures/test';

test.describe('Pre-order', () => {
  test('placeholder-страница доступна авторизованному гостю', async ({
    page,
    seed,
    asGuest,
  }) => {
    void asGuest;
    await page.goto(`/restaurants/${seed.restaurantId}/pre-order`);

    await expect(page.getByTestId('preorder-page')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Предзаказ' })).toBeVisible();
    await expect(page.getByText(/в разработке/i)).toBeVisible();
  });

  test('неавторизованный → редирект на auth', async ({ page, seed }) => {
    await page.goto(`/restaurants/${seed.restaurantId}/pre-order`);
    await expect(page).toHaveURL(new RegExp(`/restaurants/${seed.restaurantId}/auth`));
  });
});
