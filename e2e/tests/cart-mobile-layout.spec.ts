import { test, expect, apiClient } from '../fixtures/test';
import { revalidateRestaurantPublicPage } from '../helpers/revalidate-public-page';
import { assertCartMobileLayoutNoOverlap } from '../helpers/cart-layout-overlap';
import type { CartLineItem } from '../../src/shared/types/cart';

function buildStressLine(index: number): CartLineItem {
  return {
    id: `stress-line-${index}`,
    lineKey: `stress-${index}`,
    menuItemId: `stress-item-${index}`,
    name: `Очень длинное название блюда №${index} с модификаторами и вариантом`,
    variantLabel: 'Большая порция 450 г',
    quantity: 1,
    unitPrice: 1234.5,
    imageUrl: 'https://placehold.co/96x96/png',
    imageWebpUrl: null,
    modifiers: [
      { groupName: 'Добавки', optionName: 'Сыр моцарелла и соус барбекю', priceDelta: 0 },
      { groupName: 'Острота', optionName: 'Очень остро', priceDelta: 0 },
    ],
    modifierSelections: {},
  };
}

async function seedCartItems(page: import('@playwright/test').Page, restaurantId: string, count: number) {
  const items = Array.from({ length: count }, (_, i) => buildStressLine(i + 1));
  await page.addInitScript(
    ({ rid, cartItems }) => {
      const payload = {
        state: {
          version: 2,
          restaurantId: rid,
          items: cartItems,
          checkoutByRestaurant: {},
        },
        version: 2,
      };
      window.localStorage.setItem('svels-cart', JSON.stringify(payload));
    },
    { rid: restaurantId, cartItems: items },
  );
}

async function openCartStep1(page: import('@playwright/test').Page, restaurantId: string) {
  await page.goto(`/restaurants/${restaurantId}`);
  await page.getByTestId('cart-button').click();
  await expect(page.getByTestId('restaurant-cart-modal')).toBeVisible();
}

test.describe('Cart mobile layout', () => {
  test.use({ viewport: { width: 360, height: 740 } });

  test('нет пересечений ключевых элементов на шаге 1 (4 позиции)', async ({
    page,
    seed,
    asGuest,
  }) => {
    void asGuest;
    await seedCartItems(page, seed.restaurantId, 4);
    await openCartStep1(page, seed.restaurantId);
    await assertCartMobileLayoutNoOverlap(page);
  });

  test('нет пересечений на шаге 2 (самовывоз)', async ({ page, seed, asGuest }) => {
    void asGuest;
    await seedCartItems(page, seed.restaurantId, 1);
    await openCartStep1(page, seed.restaurantId);
    await page.getByTestId('cart-go-to-checkout').click();
    await expect(page.getByTestId('cart-checkout-step')).toBeVisible();
    await assertCartMobileLayoutNoOverlap(page);
  });

  test('нет пересечений при CTA «Укажите адрес»', async ({ page, seed, asGuest }) => {
    void asGuest;
    const adminToken = seed.restaurantAdmin.auth.accessToken;
    await apiClient.setOrderSettings(seed.restaurantId, adminToken, {
      fulfillmentDelivery: true,
      fulfillmentTakeaway: false,
      fulfillmentDineIn: false,
      paymentCash: true,
    });
    await revalidateRestaurantPublicPage(seed.restaurantId);
    await seedCartItems(page, seed.restaurantId, 1);
    await openCartStep1(page, seed.restaurantId);
    await page.getByTestId('cart-go-to-checkout').click();
    await page.getByTestId('delivery-street').fill('');
    await page.getByTestId('delivery-house').fill('');
    await expect(page.getByTestId('cart-submit')).toHaveText('Укажите адрес');
    await assertCartMobileLayoutNoOverlap(page);
  });
});
