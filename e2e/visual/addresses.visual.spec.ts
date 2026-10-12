import { test, expect, apiClient } from '../fixtures/test';
import { revalidateRestaurantPublicPage } from '../helpers/revalidate-public-page';
import { prepareForScreenshot, VIEWPORTS, type VisualViewportKey } from '../helpers/visual';
import { assertCartTitleCentered } from '../helpers/cart-visual';
import type { CartLineItem } from '../../src/shared/types/cart';
import type { RestaurantColorTheme } from '../../src/shared/types/restaurant-styling';

const THEMES = ['classic', 'midnight', 'warm'] as const;
const VIEWPORT_KEYS: VisualViewportKey[] = ['m360', 'm390', 'd1280'];

type AddressScenario =
  | 'delivery-0'
  | 'delivery-1'
  | 'delivery-3'
  | 'address-form'
  | 'profile-list';

let orderSettingsApplied = false;
let appliedTheme: RestaurantColorTheme | null = null;

function buildLine(): CartLineItem {
  return {
    id: 'visual-address-line',
    lineKey: 'va-line',
    menuItemId: 'va-item',
    name: 'Блюдо для адреса',
    variantLabel: null,
    quantity: 1,
    unitPrice: 9.9,
    imageUrl: '',
    imageWebpUrl: null,
    modifiers: [],
    modifierSelections: {},
  };
}

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
                saveDeliveryAddress: true,
                deliveryAddressLabel: '',
              },
            },
          },
          version: 2,
        }),
      );
    },
    { rid: restaurantId, cartItem: buildLine() },
  );
}

async function applyTheme(restaurantId: string, adminToken: string, theme: RestaurantColorTheme) {
  if (appliedTheme === theme) {
    return;
  }
  const switcherStyle =
    theme === 'midnight' ? 'segmented' : theme === 'warm' ? 'tabs' : 'pill';
  await apiClient.patchStyling(restaurantId, adminToken, {
    colorTheme: theme,
    cardStyle: 'classic',
    headerStyle: 'solid',
    switcherStyle,
  });
  await revalidateRestaurantPublicPage(restaurantId);
  appliedTheme = theme;
}

async function ensureDeliverySettings(restaurantId: string, adminToken: string) {
  if (orderSettingsApplied) {
    return;
  }
  await apiClient.setOrderSettings(restaurantId, adminToken, {
    fulfillmentDelivery: true,
    fulfillmentTakeaway: false,
    fulfillmentDineIn: false,
    paymentCash: true,
    paymentCardOnSite: true,
    deliveryForSomeoneElse: false,
  });
  await revalidateRestaurantPublicPage(restaurantId);
  orderSettingsApplied = true;
}

async function resetGuestAddresses(restaurantId: string, guestToken: string) {
  const rows = await apiClient.listGuestAddresses(restaurantId, guestToken);
  for (const row of rows) {
    await apiClient.deleteGuestAddress(restaurantId, guestToken, row.id);
  }
}

async function seedAddresses(
  restaurantId: string,
  guestToken: string,
  count: number,
  includeLong = false,
) {
  if (count === 0) {
    return;
  }
  await apiClient.createGuestAddress(restaurantId, guestToken, {
    label: 'Дом',
    street: 'Короткая',
    house: '1',
    isDefault: true,
  });
  if (count >= 2) {
    await apiClient.createGuestAddress(restaurantId, guestToken, {
      label: 'Работа',
      street: 'Очень длинное название улицы для проверки переноса',
      house: '99',
      apartment: '12',
    });
  }
  if (count >= 3 || includeLong) {
    await apiClient.createGuestAddress(restaurantId, guestToken, {
      label: 'Дача',
      street: 'Садовая аллея имени длинного героя',
      house: '7',
      apartment: '3',
    });
  }
}

async function openDeliveryCheckout(page: import('@playwright/test').Page) {
  await page.getByTestId('cart-button').click();
  await page.getByTestId('cart-go-to-checkout').click();
  await expect(page.getByTestId('cart-checkout-step')).toBeVisible();
}

test.describe('Addresses visual', () => {
  test.beforeEach(async ({ seed, asGuest }) => {
    void asGuest;
    await ensureDeliverySettings(seed.restaurantId, seed.restaurantAdmin.auth.accessToken);
    await resetGuestAddresses(seed.restaurantId, seed.guest.accessToken);
  });

  for (const theme of THEMES) {
    for (const viewportKey of VIEWPORT_KEYS) {
      for (const scenario of [
        'delivery-0',
        'delivery-1',
        'delivery-3',
        'address-form',
      ] as AddressScenario[]) {
        test(`${scenario} ${theme} @${viewportKey}`, async ({ page, seed, asGuest }) => {
          void asGuest;
          await page.setViewportSize(VIEWPORTS[viewportKey]);
          await applyTheme(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, theme);

          const count =
            scenario === 'delivery-0'
              ? 0
              : scenario === 'delivery-1'
                ? 1
                : scenario === 'delivery-3'
                  ? 3
                  : 1;
          await seedAddresses(seed.restaurantId, seed.guest.accessToken, count, true);

          await seedCart(page, seed.restaurantId);
          await page.goto(`/restaurants/${seed.restaurantId}`);
          await openDeliveryCheckout(page);

          if (scenario === 'address-form') {
            await page.getByTestId('checkout-address-row').getByRole('button').first().click();
            await page.getByTestId('address-add').click();
            const panel = page.getByTestId('address-sheet');
            await expect(panel).toBeVisible();
            await prepareForScreenshot(page);
            await expect(panel).toHaveScreenshot(
              `addresses-${scenario}-${theme}-${viewportKey}.png`,
            );
            return;
          }

          const panel = page.getByTestId('cart-modal-panel');
          await assertCartTitleCentered(panel);
          await prepareForScreenshot(page);
          await expect(panel).toHaveScreenshot(`addresses-${scenario}-${theme}-${viewportKey}.png`);
        });
      }

      test(`profile-list ${theme} @${viewportKey}`, async ({ page, seed, asGuest }) => {
        void asGuest;
        await page.setViewportSize(VIEWPORTS[viewportKey]);
        await applyTheme(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, theme);
        await seedAddresses(seed.restaurantId, seed.guest.accessToken, 3, true);
        await page.goto(`/restaurants/${seed.restaurantId}/account`);
        const section = page.getByTestId('account-addresses');
        await expect(section).toBeVisible();
        await prepareForScreenshot(page);
        await expect(section).toHaveScreenshot(`addresses-profile-list-${theme}-${viewportKey}.png`);
      });
    }
  }
});
