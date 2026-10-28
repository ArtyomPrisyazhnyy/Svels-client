import { apiClient } from './api';
import type { CreatePreOrderPayload } from '../../src/shared/types/pre-order';
import type { MenuItem } from '../../src/shared/types/menu';
import type { AuthResponse } from './api';

export interface VisualGuestOrderSeed {
  guestAuth: AuthResponse;
  orderNumber: number;
}

async function seedCappuccino(
  restaurantId: string,
  adminToken: string,
): Promise<{
  menuItemId: string;
  groupId: string;
  regularOptionId: string;
  oatOptionId: string;
}> {
  const category = await apiClient.createMenuCategory(
    restaurantId,
    adminToken,
    `E2E visual drinks ${Date.now()}`,
  );

  const created = (await apiClient.createMenuItem(restaurantId, adminToken, {
    categoryId: category.id,
    name: 'Капучино',
    price: 6.9,
    description: 'visual cappuccino',
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
    throw new Error('Cappuccino modifiers missing ids');
  }

  return {
    menuItemId: created.id,
    groupId: milkGroup.id,
    regularOptionId: regular.id,
    oatOptionId: oat.id,
  };
}

export async function seedVisualCancelledGuestOrder(
  restaurantId: string,
  adminToken: string,
  guestAuth: AuthResponse,
): Promise<VisualGuestOrderSeed> {
  await apiClient.setOrderSettings(restaurantId, adminToken, {
    fulfillmentTakeaway: true,
    paymentCash: true,
  });

  const { menuItemId, groupId, regularOptionId, oatOptionId } = await seedCappuccino(
    restaurantId,
    adminToken,
  );

  const locations = await apiClient.listRestaurantLocations(restaurantId, adminToken);
  const locationId = locations[0]?.id;
  if (!locationId) {
    throw new Error('E2E restaurant must have a location');
  }

  const guestPhone = guestAuth.user.phone ?? '+375290000001';

  const payload: CreatePreOrderPayload = {
    fulfillmentType: 'takeaway',
    paymentMethod: 'cash',
    locationId,
    customerName: `${guestAuth.user.firstName} ${guestAuth.user.lastName}`.trim(),
    customerPhone: guestPhone,
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

  const created = await apiClient.createOrder(restaurantId, guestAuth.accessToken, payload);
  await apiClient.changePreOrderStatus(restaurantId, created.id, adminToken, {
    status: 'cancelled',
    cancelReason: 'Отклонено в Telegram',
  });

  return { guestAuth, orderNumber: created.orderNumber };
}
