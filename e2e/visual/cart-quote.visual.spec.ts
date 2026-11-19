import { test, expect, apiClient } from '../fixtures/test';
import { revalidateRestaurantPublicPage } from '../helpers/revalidate-public-page';
import { snapCartPanel, waitForCartTotals } from '../helpers/cart-visual';
import { clearGuestAddresses } from '../helpers/guest-addresses';
import { fulfillCartQuote, quoteWithPercentDiscount } from '../helpers/cart-quote-mock';
import { VIEWPORTS } from '../helpers/visual';
import type { CartLineItem } from '../../src/shared/types/cart';
import type { CartQuoteResponse } from '../../src/shared/types/pre-order';
import type { RestaurantColorTheme } from '../../src/shared/types/restaurant-styling';

const THEMES = ['classic', 'midnight'] as const;
const VIEWPORTS_KEYS = ['m390', 'd1280'] as const;

const LINE: CartLineItem = {
  id: 'quote-visual-line',
  lineKey: 'quote-visual',
  menuItemId: 'quote-visual-item',
  name: 'Бургер для котировки',
  variantLabel: 'Стандарт',
  quantity: 2,
  unitPrice: 12,
  imageUrl: '',
  imageWebpUrl: null,
  modifiers: [],
  modifierSelections: {},
};

const DISCOUNT_QUOTE = quoteWithPercentDiscount({
  menuItemId: LINE.menuItemId,
  name: LINE.name,
  quantity: LINE.quantity,
  unitPrice: LINE.unitPrice,
  levelName: 'Искра',
  percentOff: 10,
  giftName: 'Кофе в подарок',
});

const PLAIN_QUOTE: CartQuoteResponse = {
  ...DISCOUNT_QUOTE,
  loyaltyDiscount: null,
  giftRewards: [],
  total: DISCOUNT_QUOTE.subtotal,
};

let orderSettingsApplied = false;
let appliedTheme: RestaurantColorTheme | null = null;
let guestAddressesCleared = false;

async function seedCart(page: import('@playwright/test').Page, restaurantId: string) {
  await page.addInitScript(
    ({ rid, cartItem }) => {
      window.localStorage.setItem(
        'svels-cart',
        JSON.stringify({
          state: {
            version: 2,
            restaurantId: rid,
            items: [cartItem],
            checkoutByRestaurant: {
              [rid]: {
                fulfillment: 'fulfillmentDelivery',
                customerName: 'Тест',
                phone: '+375290000001',
                deliveryAddress: {
                  street: 'Ленина',
                  house: '1',
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
                saveDeliveryAddress: false,
                deliveryAddressLabel: '',
                saveAddressPromptVisible: false,
              },
            },
          },
          version: 2,
        }),
      );
    },
    { rid: restaurantId, cartItem: LINE },
  );
}

async function applyTheme(restaurantId: string, adminToken: string, theme: RestaurantColorTheme) {
  if (appliedTheme === theme) {
    return;
  }
  await apiClient.patchStyling(restaurantId, adminToken, {
    colorTheme: theme,
    cardStyle: 'classic',
    headerStyle: 'solid',
    switcherStyle: theme === 'midnight' ? 'segmented' : 'pill',
  });
  await revalidateRestaurantPublicPage(restaurantId);
  appliedTheme = theme;
}

async function ensureCheckoutOrderSettings(restaurantId: string, adminToken: string) {
  if (orderSettingsApplied) {
    return;
  }
  await apiClient.setOrderSettings(restaurantId, adminToken, {
    fulfillmentDelivery: true,
    fulfillmentTakeaway: true,
    fulfillmentDineIn: false,
    paymentCash: true,
    paymentCardOnSite: true,
    deliveryForSomeoneElse: false,
  });
  await revalidateRestaurantPublicPage(restaurantId);
  orderSettingsApplied = true;
}

async function openCart(page: import('@playwright/test').Page, restaurantId: string) {
  await page.goto(`/restaurants/${restaurantId}`);
  await page.getByTestId('cart-button').click();
  await expect(page.getByTestId('cart-modal-panel')).toBeVisible();
}

test.describe('Cart quote visual', () => {
  test.beforeEach(async ({ seed, asGuest }) => {
    void asGuest;
    await ensureCheckoutOrderSettings(seed.restaurantId, seed.restaurantAdmin.auth.accessToken);
    if (!guestAddressesCleared) {
      await clearGuestAddresses(seed.restaurantId, seed.guest.accessToken);
      guestAddressesCleared = true;
    }
  });

  for (const theme of THEMES) {
    for (const viewportKey of VIEWPORTS_KEYS) {
      test(`discount ${theme} @${viewportKey}`, async ({ page, seed }) => {
        await page.setViewportSize(VIEWPORTS[viewportKey]);
        await applyTheme(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, theme);
        await page.route(`**/restaurants/${seed.restaurantId}/pre-orders/quote`, async (route) => {
          await fulfillCartQuote(route, DISCOUNT_QUOTE);
        });
        await seedCart(page, seed.restaurantId);
        await openCart(page, seed.restaurantId);
        await waitForCartTotals(page);
        await expect(page.getByTestId('cart-loyalty-discount')).toContainText('Скидка уровня «Искра» −10%');
        await expect(page.getByTestId('cart-gift-reward')).toContainText('Подарок: Кофе в подарок');
        await expect(page.getByTestId('cart-submit-total')).toBeVisible();
        await snapCartPanel(page, page.getByTestId('cart-modal-panel'), `cart-quote-discount-${theme}-${viewportKey}`);
      });

      test(`plain ${theme} @${viewportKey}`, async ({ page, seed }) => {
        await page.setViewportSize(VIEWPORTS[viewportKey]);
        await applyTheme(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, theme);
        await page.route(`**/restaurants/${seed.restaurantId}/pre-orders/quote`, async (route) => {
          await fulfillCartQuote(route, PLAIN_QUOTE);
        });
        await seedCart(page, seed.restaurantId);
        await openCart(page, seed.restaurantId);
        await waitForCartTotals(page);
        await expect(page.getByTestId('cart-loyalty-discount')).toHaveCount(0);
        await expect(page.getByTestId('cart-gift-reward')).toHaveCount(0);
        await expect(page.getByTestId('cart-server-total')).toBeVisible();
        await snapCartPanel(page, page.getByTestId('cart-modal-panel'), `cart-quote-plain-${theme}-${viewportKey}`);
      });

      test(`skeleton ${theme} @${viewportKey}`, async ({ page, seed }) => {
        await page.setViewportSize(VIEWPORTS[viewportKey]);
        await applyTheme(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, theme);
        await page.route(`**/restaurants/${seed.restaurantId}/pre-orders/quote`, async () => {
          await new Promise(() => {});
        });
        await seedCart(page, seed.restaurantId);
        await openCart(page, seed.restaurantId);
        await expect(page.getByTestId('cart-totals-skeleton')).toBeVisible();
        await snapCartPanel(
          page,
          page.getByTestId('cart-modal-panel'),
          `cart-quote-skeleton-${theme}-${viewportKey}`,
        );
      });

      test(`price changed ${theme} @${viewportKey}`, async ({ page, seed }) => {
        await page.setViewportSize(VIEWPORTS[viewportKey]);
        await applyTheme(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, theme);
        let quoted = PLAIN_QUOTE;
        await page.route(`**/restaurants/${seed.restaurantId}/pre-orders/quote`, async (route) => {
          await fulfillCartQuote(route, quoted);
        });
        await seedCart(page, seed.restaurantId);
        await openCart(page, seed.restaurantId);
        await waitForCartTotals(page);
        await page.getByTestId('cart-go-to-checkout').click();
        await expect(page.getByTestId('cart-checkout-step')).toBeVisible();
        quoted = DISCOUNT_QUOTE;
        await page.getByTestId('cart-submit').click();
        await expect(page.getByTestId('cart-price-changed')).toContainText('Цена изменилась');
        await expect(page.getByTestId('cart-price-changed')).toContainText('21.60');
        await snapCartPanel(
          page,
          page.getByTestId('cart-modal-panel'),
          `cart-quote-price-changed-${theme}-${viewportKey}`,
        );
      });
    }
  }
});
