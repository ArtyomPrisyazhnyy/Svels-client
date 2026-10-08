import { test, expect } from '../fixtures/test';

test.describe('Platform redirects', () => {
  test('/auth → /auth/restaurant', async ({ page }) => {
    await page.goto('/auth');
    await expect(page).toHaveURL(/\/auth\/restaurant$/);
  });

  test('/auth/guest → /', async ({ page }) => {
    await page.goto('/auth/guest');
    await expect(page).toHaveURL(/\/$/);
  });

  test('/booking → /', async ({ page }) => {
    await page.goto('/booking');
    await expect(page).toHaveURL(/\/$/);
  });

  test('/pre-order → /', async ({ page }) => {
    await page.goto('/pre-order');
    await expect(page).toHaveURL(/\/$/);
  });

  test('/account → /', async ({ page }) => {
    await page.goto('/account');
    await expect(page).toHaveURL(/\/$/);
  });

  test('/restaurant-admin → /restaurant-admin/menu (после auth)', async ({
    page,
    asRestaurantAdmin,
  }) => {
    void asRestaurantAdmin;
    await page.goto('/restaurant-admin');
    await expect(page).toHaveURL(/\/restaurant-admin\/menu$/);
  });
});
