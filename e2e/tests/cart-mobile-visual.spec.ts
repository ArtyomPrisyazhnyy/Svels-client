import { test, expect, apiClient } from '../fixtures/test';
import { revalidateRestaurantPublicPage } from '../helpers/revalidate-public-page';
import type { CartLineItem } from '../../src/shared/types/cart';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = '/opt/cursor/artifacts/cart-mobile-v2';

const VIEWPORTS = [
  { w: 360, h: 740, tag: '360x740' },
  { w: 390, h: 844, tag: '390x844' },
  { w: 768, h: 1024, tag: '768x1024' },
] as const;

function buildStressLine(index: number): CartLineItem {
  return {
    id: `visual-line-${index}`,
    lineKey: `visual-${index}`,
    menuItemId: `visual-item-${index}`,
    name: `Очень длинное название блюда №${index} с модификаторами и вариантом`,
    variantLabel: 'Большая порция 450 г',
    quantity: 1,
    unitPrice: 1234.5,
    imageUrl: 'https://placehold.co/96x96/png',
    imageWebpUrl: null,
    modifiers: [
      { groupName: 'Добавки', optionName: 'Сыр моцарелла и соус барбекю', priceDelta: 120 },
      { groupName: 'Острота', optionName: 'Очень остро', priceDelta: 0 },
    ],
    modifierSelections: {},
  };
}

async function seedCart(
  page: import('@playwright/test').Page,
  restaurantId: string,
  count: number,
  fulfillment: 'fulfillmentDelivery' | 'fulfillmentTakeaway' = 'fulfillmentDelivery',
) {
  const items = Array.from({ length: count }, (_, i) => buildStressLine(i + 1));
  await page.addInitScript(
    ({ rid, cartItems, fulfillmentKey }) => {
      const payload = {
        state: {
          version: 2,
          restaurantId: rid,
          items: cartItems,
          checkoutByRestaurant: {
            [rid]: {
              fulfillment: fulfillmentKey,
              customerName: '',
              phone: '',
              deliveryAddress: {
                street: '',
                house: '',
                apartment: '',
                entrance: '',
                floor: '',
                intercom: '',
                comment: '',
              },
              locationId: null,
              requestedAtMode: 'asap',
              requestedAtSlotIso: null,
              orderForSomeoneElse: false,
              recipientName: '',
              recipientPhone: '',
              comment: '',
            },
          },
        },
        version: 2,
      };
      window.localStorage.setItem('svels-cart', JSON.stringify(payload));
    },
    { rid: restaurantId, cartItems: items, fulfillmentKey: fulfillment },
  );
}

async function snap(page: import('@playwright/test').Page, name: string) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  const filePath = path.join(ARTIFACT_DIR, `${name}.png`);
  await page.getByTestId('cart-modal-panel').screenshot({ path: filePath });
}

test.describe('Cart mobile visual captures', () => {
  test.skip(!process.env.CART_MOBILE_SCREENSHOTS, 'Set CART_MOBILE_SCREENSHOTS=1 to capture');

  for (const vp of VIEWPORTS) {
    test.describe(vp.tag, () => {
      test.use({ viewport: { width: vp.w, height: vp.h } });

      test('step1 x1', async ({ page, seed, asGuest }) => {
        void asGuest;
        await seedCart(page, seed.restaurantId, 1);
        await page.goto(`/restaurants/${seed.restaurantId}`);
        await page.getByTestId('cart-button').click();
        await snap(page, `step1-1item-${vp.tag}`);
      });

      test('step1 x4', async ({ page, seed, asGuest }) => {
        void asGuest;
        await seedCart(page, seed.restaurantId, 4);
        await page.goto(`/restaurants/${seed.restaurantId}`);
        await page.getByTestId('cart-button').click();
        await snap(page, `step1-4items-${vp.tag}`);
      });

      test('step2 pickup collapsed', async ({ page, seed, asGuest }) => {
        void asGuest;
        const adminToken = seed.restaurantAdmin.auth.accessToken;
        await apiClient.setOrderSettings(seed.restaurantId, adminToken, {
          fulfillmentDelivery: false,
          fulfillmentTakeaway: true,
          fulfillmentDineIn: false,
          paymentCash: true,
        });
        await revalidateRestaurantPublicPage(seed.restaurantId);
        await seedCart(page, seed.restaurantId, 2, 'fulfillmentTakeaway');
        await page.goto(`/restaurants/${seed.restaurantId}`);
        await page.getByTestId('cart-button').click();
        await page.getByTestId('cart-go-to-checkout').click();
        await expect(page.getByTestId('cart-checkout-step')).toBeVisible();
        await expect(page.getByTestId('cart-header-title')).toHaveText('Самовывоз');
        await snap(page, `step2-pickup-collapsed-${vp.tag}`);
      });

      test('step2 delivery collapsed', async ({ page, seed, asGuest }) => {
        void asGuest;
        const adminToken = seed.restaurantAdmin.auth.accessToken;
        await apiClient.setOrderSettings(seed.restaurantId, adminToken, {
          fulfillmentDelivery: true,
          fulfillmentTakeaway: true,
          fulfillmentDineIn: false,
          paymentCash: true,
        });
        await revalidateRestaurantPublicPage(seed.restaurantId);
        await seedCart(page, seed.restaurantId, 1);
        await page.goto(`/restaurants/${seed.restaurantId}`);
        await page.getByTestId('cart-button').click();
        await page.getByRole('tab', { name: 'Доставка' }).click();
        await page.getByTestId('cart-go-to-checkout').click();
        await expect(page.getByTestId('cart-header-title')).toHaveText('Доставка');
        await snap(page, `step2-delivery-collapsed-${vp.tag}`);
      });

      test('step2 delivery expanded + error CTA', async ({ page, seed, asGuest }) => {
        void asGuest;
        const adminToken = seed.restaurantAdmin.auth.accessToken;
        await apiClient.setOrderSettings(seed.restaurantId, adminToken, {
          fulfillmentDelivery: true,
          fulfillmentTakeaway: false,
          fulfillmentDineIn: false,
          paymentCash: true,
          deliveryForSomeoneElse: true,
        });
        await revalidateRestaurantPublicPage(seed.restaurantId);
        await seedCart(page, seed.restaurantId, 1);
        await page.goto(`/restaurants/${seed.restaurantId}`);
        await page.getByTestId('cart-button').click();
        await page.getByTestId('cart-go-to-checkout').click();
        await page.getByTestId('cart-address-extra-row').getByRole('button').click();
        await page.getByTestId('cart-time-row').getByRole('button').click();
        const paymentRow = page.getByTestId('cart-payment-row');
        if (await paymentRow.isVisible()) {
          await paymentRow.getByRole('button').click();
        }
        await page.getByTestId('cart-comment-row').getByRole('button').click();
        const recipientRow = page.getByTestId('cart-recipient-row');
        if (await recipientRow.isVisible()) {
          await recipientRow.getByRole('button').click();
        }
        await page.getByTestId('delivery-street').fill('');
        await page.getByTestId('delivery-house').fill('');
        await expect(page.getByTestId('cart-submit')).toHaveText('Укажите адрес');
        await snap(page, `step2-delivery-expanded-error-${vp.tag}`);
      });
    });
  }
});
