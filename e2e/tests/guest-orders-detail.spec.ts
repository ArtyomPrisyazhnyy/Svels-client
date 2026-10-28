import { test, expect, apiClient } from '../fixtures/test';
import { injectAuth } from '../helpers/auth';
import type { CreatePreOrderPayload } from '../../src/shared/types/pre-order';
import type { MenuItem } from '../../src/shared/types/menu';

const E2E_GUEST_PHONE = '+375290000002';

interface CappuccinoSeed {
  menuItemId: string;
  groupId: string;
  regularOptionId: string;
  oatOptionId: string;
}

async function seedCappuccinoWithMilkModifiers(
  restaurantId: string,
  adminToken: string,
): Promise<CappuccinoSeed> {
  const category = await apiClient.createMenuCategory(
    restaurantId,
    adminToken,
    `E2E напитки ${Date.now()}`,
  );

  const created = (await apiClient.createMenuItem(restaurantId, adminToken, {
    categoryId: category.id,
    name: 'Капучино',
    price: 6.9,
    description: 'e2e cappuccino',
    imageUrl: '/e2e/menu-dish.png',
    modifierGroups: [
      {
        name: 'Молоко',
        selectionType: 'single',
        required: true,
        options: [
          { name: 'Обычное', priceDelta: 0 },
          { name: 'Овсяное молоко', priceDelta: 2.5 },
        ],
      },
    ],
  })) as MenuItem;

  const milkGroup = created.modifierGroups[0];
  const regular = milkGroup?.options.find((o) => o.name === 'Обычное');
  const oat = milkGroup?.options.find((o) => o.name === 'Овсяное молоко');
  if (!milkGroup?.id || !regular?.id || !oat?.id) {
    throw new Error('Cappuccino modifier groups were not returned with ids');
  }

  return {
    menuItemId: created.id,
    groupId: milkGroup.id,
    regularOptionId: regular.id,
    oatOptionId: oat.id,
  };
}

test.describe('Guest order detail', () => {
  test('shows modifier options and maps Telegram cancel reason', async ({ seed, page }) => {
    const adminToken = seed.restaurantAdmin.auth.accessToken;
    await apiClient.setOrderSettings(seed.restaurantId, adminToken, {
      fulfillmentTakeaway: true,
      paymentCash: true,
    });

    const { menuItemId, groupId, regularOptionId, oatOptionId } =
      await seedCappuccinoWithMilkModifiers(seed.restaurantId, adminToken);

    const locations = await apiClient.listRestaurantLocations(seed.restaurantId, adminToken);
    const locationId = locations[0]?.id;
    test.skip(!locationId, 'Need location');

    const { auth: detailGuest } = await apiClient.createGuest(
      seed.restaurantId,
      'Order',
      'Detail',
    );

    const payload: CreatePreOrderPayload = {
      fulfillmentType: 'takeaway',
      paymentMethod: 'cash',
      locationId,
      customerName: 'E2E Гость',
      customerPhone: E2E_GUEST_PHONE,
      items: [
        {
          menuItemId,
          quantity: 1,
          modifierSelections: { [groupId]: [regularOptionId] },
        },
        {
          menuItemId,
          quantity: 1,
          modifierSelections: { [groupId]: [oatOptionId] },
        },
      ],
    };

    const created = await apiClient.createOrder(
      seed.restaurantId,
      detailGuest.accessToken,
      payload,
    );

    await apiClient.changePreOrderStatus(
      seed.restaurantId,
      created.id,
      adminToken,
      { status: 'cancelled', cancelReason: 'Отклонено в Telegram' },
    );

    await injectAuth(page, detailGuest);
    await page.goto(`/restaurants/${seed.restaurantId}/pre-order`);
    await page.getByTestId(`guest-order-row-${created.orderNumber}`).click();
    const detail = page.getByTestId('guest-order-detail');
    await expect(detail).toBeVisible();
    await expect(detail.getByTestId('order-line-options').first()).toContainText('Обычное');
    await expect(detail.getByTestId('order-line-options').nth(1)).toContainText('Овсяное молоко');
    await expect(page.getByTestId('guest-order-cancel-reason')).toHaveText('Заведение отклонило заказ');
    await expect(page.getByTestId('guest-order-cancel-reason')).not.toContainText('Telegram');
  });
});
