import { test, expect, apiClient } from '../fixtures/test';
import { revalidateRestaurantPublicPage } from '../helpers/revalidate-public-page';
import { prepareForScreenshot, VIEWPORTS, type VisualViewportKey } from '../helpers/visual';
import { assertCartTitleCentered, snapCartPanel, snapOverlayPanel } from '../helpers/cart-visual';
import type { CartLineItem } from '../../src/shared/types/cart';
import type { RestaurantColorTheme } from '../../src/shared/types/restaurant-styling';
import { clearGuestAddresses } from '../helpers/guest-addresses';

const THEMES = ['classic', 'midnight', 'warm'] as const;
const VIEWPORT_KEYS: VisualViewportKey[] = ['m360', 'm390', 't768', 'd1280'];

type AddressScenario =
  | 'delivery-0'
  | 'sheet-list'
  | 'sheet-menu'
  | 'sheet-limit'
  | 'address-form'
  | 'profile-list';

const ADDRESS_LIMIT = 10;

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
                deliveryAddressLabel: 'Дом',
                saveAddressPromptVisible: true,
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

async function seedAddresses(
  restaurantId: string,
  guestToken: string,
  count: number,
) {
  if (count <= 0) {
    return;
  }
  const templates = [
    { label: 'Дом', street: 'Короткая', house: '1', isDefault: true },
    {
      label: 'Работа',
      street: 'Очень длинное название улицы для проверки переноса',
      house: '99',
      apartment: '12',
    },
    {
      label: 'Дача',
      street: 'Садовая аллея имени длинного героя',
      house: '7',
      apartment: '3',
    },
  ];

  for (let i = 0; i < count; i += 1) {
    const base = templates[i % templates.length];
    await apiClient.createGuestAddress(restaurantId, guestToken, {
      label: i < templates.length ? base.label : `Адрес ${i + 1}`,
      street: base.street,
      house: base.house,
      apartment: base.apartment,
      isDefault: i === 0,
    });
  }
}

async function openDeliveryCheckout(page: import('@playwright/test').Page) {
  await page.getByTestId('cart-button').click();
  await page.getByTestId('cart-go-to-checkout').click();
  await expect(page.getByTestId('cart-checkout-step')).toBeVisible();
}

async function openAddressSheetFromCheckout(page: import('@playwright/test').Page) {
  await openDeliveryCheckout(page);
  await page.getByTestId('checkout-address-row').getByRole('button').first().click();
  await expect(page.getByTestId('address-sheet')).toBeVisible();
  await expect(page.getByTestId('guest-address-list')).toBeVisible();
}

test.describe('Addresses visual', () => {
  test.beforeEach(async ({ seed, asGuest }) => {
    void asGuest;
    await ensureDeliverySettings(seed.restaurantId, seed.restaurantAdmin.auth.accessToken);
    await clearGuestAddresses(seed.restaurantId, seed.guest.accessToken);
  });

  for (const theme of THEMES) {
    for (const viewportKey of VIEWPORT_KEYS) {
      for (const scenario of [
        'delivery-0',
        'sheet-list',
        'sheet-menu',
        'sheet-limit',
        'address-form',
      ] as AddressScenario[]) {
        test(`${scenario} ${theme} @${viewportKey}`, async ({ page, seed, asGuest }) => {
          void asGuest;
          await page.setViewportSize(VIEWPORTS[viewportKey]);
          await applyTheme(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, theme);

          if (scenario === 'address-form') {
            await seedAddresses(seed.restaurantId, seed.guest.accessToken, 1);
            await page.goto(`/restaurants/${seed.restaurantId}/account`);
            await page.getByTestId('address-add').click();
            const panel = page.getByTestId('address-sheet');
            await expect(panel).toBeVisible();
            await expect(page.getByTestId('guest-address-form')).toBeVisible();
            await snapOverlayPanel(
              page,
              panel,
              `addresses-${scenario}-${theme}-${viewportKey}`,
            );
            return;
          }

          if (scenario === 'delivery-0') {
            await seedCart(page, seed.restaurantId);
            await page.goto(`/restaurants/${seed.restaurantId}`);
            await openDeliveryCheckout(page);
            const panel = page.getByTestId('cart-modal-panel');
            await assertCartTitleCentered(panel);
            await snapCartPanel(
              page,
              panel,
              `addresses-${scenario}-${theme}-${viewportKey}`,
            );
            return;
          }

          const addressCount =
            scenario === 'sheet-limit' ? ADDRESS_LIMIT : 3;
          await seedAddresses(seed.restaurantId, seed.guest.accessToken, addressCount);
          await seedCart(page, seed.restaurantId);
          await page.goto(`/restaurants/${seed.restaurantId}`);

          if (scenario === 'sheet-list') {
            await openAddressSheetFromCheckout(page);
            const panel = page.getByTestId('address-sheet');
            await snapOverlayPanel(
              page,
              panel,
              `addresses-${scenario}-${theme}-${viewportKey}`,
            );
            return;
          }

          if (scenario === 'sheet-menu') {
            await openAddressSheetFromCheckout(page);
            const addresses = await apiClient.listGuestAddresses(
              seed.restaurantId,
              seed.guest.accessToken,
            );
            const work = addresses.find((row) => row.label === 'Работа');
            expect(work).toBeTruthy();
            await page.getByTestId(`address-menu-${work!.id}`).click();
            await expect(page.getByTestId('address-action-menu')).toBeVisible();
            await page.getByTestId('address-delete-start').click();
            await expect(page.getByTestId('address-delete-confirm')).toBeVisible();
            const panel = page.getByTestId('address-sheet');
            await snapOverlayPanel(
              page,
              panel,
              `addresses-${scenario}-${theme}-${viewportKey}`,
            );
            return;
          }

          if (scenario === 'sheet-limit') {
            await openAddressSheetFromCheckout(page);
            await expect(page.getByTestId('address-limit-hint')).toBeVisible();
            const panel = page.getByTestId('address-sheet');
            await snapOverlayPanel(
              page,
              panel,
              `addresses-${scenario}-${theme}-${viewportKey}`,
            );
          }
        });
      }

      test(`profile-list ${theme} @${viewportKey}`, async ({ page, seed, asGuest }) => {
        void asGuest;
        await page.setViewportSize(VIEWPORTS[viewportKey]);
        await applyTheme(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, theme);
        await seedAddresses(seed.restaurantId, seed.guest.accessToken, 3);
        await page.goto(`/restaurants/${seed.restaurantId}/account`);
        const section = page.getByTestId('account-addresses');
        await expect(section).toBeVisible();
        await prepareForScreenshot(page);
        await expect(section).toHaveScreenshot(
          `addresses-profile-list-${theme}-${viewportKey}.png`,
          { maxDiffPixelRatio: 0.01 },
        );
      });
    }
  }
});
