import { expect, test } from '@playwright/test';
import { readSeed } from '../helpers/env';
import { revalidateRestaurantPublicPage } from '../helpers/revalidate-public-page';

test.describe('Loyalty flame info modal', () => {
  test('clicking flame opens info modal instead of account', async ({ page, request }) => {
    const seed = readSeed();
    const { restaurantId, restaurantAdmin } = seed;

    await request.patch(
      `${process.env.E2E_API_URL ?? 'http://127.0.0.1:3000'}/restaurants/${restaurantId}/loyalty-settings`,
      {
        headers: {
          Authorization: `Bearer ${restaurantAdmin.auth.accessToken}`,
          'Content-Type': 'application/json',
        },
        data: {
          flameDisplayEnabled: true,
          flameRewardsEnabled: true,
          flameExpireDays: 14,
          flameLevels: [
            {
              id: 'e2e-level-1',
              name: 'Искра',
              requiredVisits: 2,
              rewards: [
                {
                  id: 'e2e-reward-1',
                  type: 'percent_discount',
                  title: 'Скидка 5% на заказ',
                  description: null,
                  percentOff: 5,
                  amountOff: null,
                  menuItemId: null,
                  minOrderAmount: null,
                },
              ],
            },
          ],
        },
      },
    );

    await revalidateRestaurantPublicPage(restaurantId);

    await page.goto(`/restaurants/${restaurantId}`);
    await expect(page.getByTestId('loyalty-flame-button')).toBeVisible();

    await page.getByTestId('loyalty-flame-button').click();
    await expect(page.getByTestId('loyalty-flame-info-modal')).toBeVisible();
    await expect(page.getByTestId('loyalty-flame-info-title')).toHaveText('Огонёк лояльности');
    await expect(page).not.toHaveURL(new RegExp(`/restaurants/${restaurantId}/account`));
  });
});
