import { test, expect } from '../fixtures/test';

async function assertVenueFooterSvelsLink(
  page: import('@playwright/test').Page,
): Promise<void> {
  const footer = page.getByTestId('restaurant-footer');
  await expect(footer).toBeVisible();
  const link = footer.getByTestId('restaurant-footer-svels-home');
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', '/');
  await expect(link).toHaveAttribute('aria-label', 'Svels — главная');
}

test.describe('Venue footer on guest subpages', () => {
  test('главная страница заведения показывает подвал', async ({ page, seed }) => {
    await page.goto(`/restaurants/${seed.restaurantId}`);
    await expect(page.getByTestId('restaurant-public-page')).toBeVisible();
    await assertVenueFooterSvelsLink(page);
  });

  test('личный кабинет показывает подвал', async ({ page, seed, asGuest }) => {
    void asGuest;
    await page.goto(`/restaurants/${seed.restaurantId}/account`);
    await expect(page.getByTestId('guest-account-page')).toBeVisible({ timeout: 30_000 });
    await assertVenueFooterSvelsLink(page);
  });

  test('избранное показывает подвал', async ({ page, seed }) => {
    await page.goto(`/restaurants/${seed.restaurantId}/favorites`);
    await expect(page.getByTestId('guest-favorites-page')).toBeVisible({ timeout: 30_000 });
    await assertVenueFooterSvelsLink(page);
  });
});
