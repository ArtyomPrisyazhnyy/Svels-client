import { expect, test } from '../fixtures/test';

test.describe('Friendly API errors', () => {
  test('shows friendly network copy without raw fetch message', async ({ page, seed, asGuest }) => {
    void asGuest;

    await page.route('**/users/me/pre-orders**', async (route) => {
      await route.abort('failed');
    });

    await page.goto(`/restaurants/${seed.restaurantId}/pre-order`, { waitUntil: 'domcontentloaded' });

    await expect(page.getByText('Нет подключения к интернету')).toBeVisible();
    await expect(page.getByText('Failed to fetch')).toHaveCount(0);
    await expect(page.getByText(/backend запущен/i)).toHaveCount(0);
  });
});
