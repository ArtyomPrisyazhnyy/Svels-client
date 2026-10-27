import { test, expect, apiClient } from '../fixtures/test';
import { revalidateRestaurantPublicPage } from '../helpers/revalidate-public-page';
import {
  assertCartTitleCentered,
  assertExpandedRowContentGap,
  snapCartCrop,
  snapCartPanel,
} from '../helpers/cart-visual';
import { VIEWPORTS, type VisualViewportKey } from '../helpers/visual';
import { clearGuestAddresses } from '../helpers/guest-addresses';
import type { CartLineItem } from '../../src/shared/types/cart';
import type { RestaurantColorTheme } from '../../src/shared/types/restaurant-styling';

const THEMES = ['classic', 'midnight', 'warm'] as const;
const CHECKOUT_SHEET_THEMES = ['classic', 'midnight', 'neon', 'citrus'] as const;
const VIEWPORT_KEYS: VisualViewportKey[] = ['m360', 'm390', 't768'];
const DESKTOP_SCENARIOS: CheckoutScenario[] = ['step1', 'step2-delivery', 'step2-pickup'];
const CHECKOUT_STEP2_SCENARIOS = ['step2-delivery', 'step2-pickup', 'step2-dine-in'] as const;
const CHECKOUT_SHEET_VIEWPORTS: VisualViewportKey[] = ['m390', 'd1280'];

/** One styling/settings write per worker. Repeating them on every shot trips the API rate limit and drops the pickup row. */
let orderSettingsApplied = false;
let appliedTheme: RestaurantColorTheme | null = null;
let guestAddressesCleared = false;

type CheckoutScenario =
  | 'step1'
  | 'step2-delivery'
  | 'step2-pickup'
  | 'step2-dine-in'
  | 'row-time'
  | 'row-time-slot'
  | 'row-payment'
  | 'row-comment'
  | 'row-address-extra'
  | 'row-recipient';

function buildLine(index = 1): CartLineItem {
  return {
    id: `visual-checkout-${index}`,
    lineKey: `vc-${index}`,
    menuItemId: `vc-item-${index}`,
    name: index === 1 ? 'Блюдо для визуального теста корзины' : `Блюдо ${index}`,
    variantLabel: 'Стандарт',
    quantity: 1,
    unitPrice: 7.5,
    imageUrl: '',
    imageWebpUrl: null,
    modifiers: [],
    modifierSelections: {},
  };
}

async function seedCart(
  page: import('@playwright/test').Page,
  restaurantId: string,
  fulfillment:
    | 'fulfillmentDelivery'
    | 'fulfillmentTakeaway'
    | 'fulfillmentDineIn' = 'fulfillmentDelivery',
  itemCount = 1,
  saveAddressPrompt = false,
) {
  await page.addInitScript(
    ({ rid, cartItems, fulfillmentKey, showSavePrompt }) => {
      window.localStorage.setItem(
        'svels-cart',
        JSON.stringify({
          state: {
            version: 2,
            restaurantId: rid,
            items: cartItems,
            checkoutByRestaurant: {
              [rid]: {
                fulfillment: fulfillmentKey,
                customerName: 'Тест',
                phone: '+375290000002',
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
                saveAddressPromptVisible: showSavePrompt,
              },
            },
          },
          version: 2,
        }),
      );
    },
    {
      rid: restaurantId,
      cartItems: Array.from({ length: itemCount }, (_, index) => buildLine(index + 1)),
      fulfillmentKey: fulfillment,
      showSavePrompt: saveAddressPrompt,
    },
  );
}

async function applyTheme(
  restaurantId: string,
  adminToken: string,
  theme: RestaurantColorTheme,
) {
  if (appliedTheme === theme) {
    return;
  }
  const switcherStyle =
    theme === 'midnight' || theme === 'neon'
      ? 'segmented'
      : theme === 'warm' || theme === 'citrus'
        ? 'tabs'
        : 'pill';
  await apiClient.patchStyling(restaurantId, adminToken, {
    colorTheme: theme,
    cardStyle: 'classic',
    headerStyle: 'solid',
    switcherStyle,
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
    fulfillmentDineIn: true,
    paymentCash: true,
    paymentCardOnSite: true,
    deliveryForSomeoneElse: true,
  });
  await revalidateRestaurantPublicPage(restaurantId);
  orderSettingsApplied = true;
}

async function waitForSaveAddressPrompt(page: import('@playwright/test').Page) {
  await expect(page.getByTestId('delivery-address-fields')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('address-save-checkbox')).toBeVisible();
}

async function openScenario(
  page: import('@playwright/test').Page,
  restaurantId: string,
  scenario: CheckoutScenario,
  options?: { deliverySnapshot?: boolean },
) {
  await page.goto(`/restaurants/${restaurantId}`);
  await page.getByTestId('cart-button').click();
  const panel = page.getByTestId('cart-modal-panel');
  await expect(panel).toBeVisible();

  if (scenario === 'step1') {
    return panel;
  }

  if (scenario === 'step2-pickup' || scenario === 'step2-dine-in') {
    const fulfillment = page.getByTestId('cart-fulfillment-segmented');
    await expect(fulfillment).toBeVisible();
    const label = scenario === 'step2-pickup' ? 'Самовывоз' : 'На месте';
    await fulfillment.getByRole('radio', { name: label }).click();
    await expect(fulfillment.getByRole('radio', { name: label })).toBeChecked();
  }

  await page.getByTestId('cart-go-to-checkout').click();
  await expect(page.getByTestId('cart-checkout-step')).toBeVisible();

  if (scenario === 'step2-pickup') {
    await expect(page.getByTestId('cart-location-row')).toBeVisible({ timeout: 30_000 });
  }

  if (scenario === 'step2-delivery') {
    if (options?.deliverySnapshot) {
      await waitForSaveAddressPrompt(page);
    } else {
      await expect(page.getByTestId('delivery-address-fields')).toBeVisible({ timeout: 15_000 });
    }
    return panel;
  }

  if (scenario === 'step2-pickup' || scenario === 'step2-dine-in') {
    return panel;
  }

  if (scenario === 'row-time') {
    const timeRow = page.getByTestId('cart-time-row');
    await expect(page.getByTestId('cart-requested-time-segmented')).toBeVisible();
    await timeRow.evaluate((el) => el.scrollIntoView({ block: 'start', inline: 'nearest' }));
    return panel;
  }

  if (scenario === 'row-time-slot') {
    const timeRow = page.getByTestId('cart-time-row');
    await page.getByTestId('requested-time-slot-mode').click();
    await expect(page.getByTestId('requested-time-slot-select')).toBeVisible();
    await timeRow.evaluate((el) => el.scrollIntoView({ block: 'start', inline: 'nearest' }));
    return panel;
  }

  if (scenario === 'row-payment') {
    const paymentRow = page.getByTestId('cart-payment-row');
    await expect(page.getByTestId('cart-payment-segmented')).toBeVisible();
    await paymentRow.evaluate((el) => el.scrollIntoView({ block: 'start', inline: 'nearest' }));
    return panel;
  }

  const rowMap: Record<string, string> = {
    'row-comment': 'cart-comment-row',
    'row-address-extra': 'cart-address-extra-row',
    'row-recipient': 'cart-recipient-row',
  };
  const rowTestId = rowMap[scenario];
  const row = page.getByTestId(rowTestId);
  await expect(row).toBeVisible();
  if (scenario === 'row-recipient') {
    await page.getByTestId('cart-recipient-checkbox').check();
  } else {
    await row.getByRole('button').first().click();
    await assertExpandedRowContentGap(row);
  }
  await row.evaluate((el) => el.scrollIntoView({ block: 'start', inline: 'nearest' }));
  return panel;
}

test.describe('Cart checkout visual', () => {
  const scenarios: CheckoutScenario[] = [
    'step1',
    'step2-delivery',
    'step2-pickup',
    'row-time',
    'row-time-slot',
    'row-payment',
    'row-comment',
    'row-address-extra',
    'row-recipient',
  ];

  test.beforeEach(async ({ seed, asGuest }) => {
    void asGuest;
    await ensureCheckoutOrderSettings(seed.restaurantId, seed.restaurantAdmin.auth.accessToken);
    if (!guestAddressesCleared) {
      await clearGuestAddresses(seed.restaurantId, seed.guest.accessToken);
      guestAddressesCleared = true;
    }
  });

  for (const theme of THEMES) {
    for (const viewportKey of VIEWPORT_KEYS) {
      for (const scenario of scenarios) {
        test(`${scenario} ${theme} @${viewportKey}`, async ({ page, seed, asGuest }) => {
          void asGuest;
          await page.setViewportSize(VIEWPORTS[viewportKey]);
          await applyTheme(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, theme);
          const fulfillment =
            scenario === 'step2-pickup'
              ? 'fulfillmentTakeaway'
              : scenario === 'step2-dine-in'
                ? 'fulfillmentDineIn'
                : 'fulfillmentDelivery';
          await seedCart(
            page,
            seed.restaurantId,
            fulfillment,
            scenario === 'step1' ? 3 : 1,
            scenario === 'step2-delivery',
          );
          const panel = await openScenario(page, seed.restaurantId, scenario, {
            deliverySnapshot: scenario === 'step2-delivery',
          });
          await assertCartTitleCentered(panel);
          if (viewportKey === 't768') {
            const panelBox = await panel.boundingBox();
            expect(panelBox).not.toBeNull();
            expect(panelBox!.width).toBeGreaterThanOrEqual(500);
            expect(panelBox!.width).toBeLessThanOrEqual(540);
          }
          await snapCartPanel(page, panel, `cart-${scenario}-${theme}-${viewportKey}`);
        });
      }

      test(`crops header+selectors ${theme} @${viewportKey}`, async ({ page, seed, asGuest }) => {
        void asGuest;
        await page.setViewportSize(VIEWPORTS[viewportKey]);
        await applyTheme(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, theme);
        await seedCart(page, seed.restaurantId, 'fulfillmentDelivery');
        const panel = await openScenario(page, seed.restaurantId, 'step2-delivery');
        await page.getByTestId('requested-time-slot-mode').click();
        await assertCartTitleCentered(panel);
        await snapCartCrop(
          page,
          page.getByTestId('cart-header-bar'),
          `cart-crop-header-${theme}-${viewportKey}`,
        );
        await snapCartCrop(
          page,
          page.getByTestId('cart-requested-time-segmented'),
          `cart-crop-time-seg-${theme}-${viewportKey}`,
        );
        await snapCartCrop(
          page,
          page.getByTestId('cart-payment-segmented'),
          `cart-crop-payment-seg-${theme}-${viewportKey}`,
        );
      });
    }
  }

  for (const theme of THEMES) {
    for (const scenario of DESKTOP_SCENARIOS) {
      test(`${scenario} ${theme} @d1280`, async ({ page, seed, asGuest }) => {
        void asGuest;
        await page.setViewportSize(VIEWPORTS.d1280);
        await applyTheme(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, theme);
        const fulfillment =
          scenario === 'step2-pickup' ? 'fulfillmentTakeaway' : 'fulfillmentDelivery';
        await seedCart(
          page,
          seed.restaurantId,
          fulfillment,
          scenario === 'step1' ? 3 : 1,
          scenario === 'step2-delivery',
        );
        const panel = await openScenario(page, seed.restaurantId, scenario, {
          deliverySnapshot: scenario === 'step2-delivery',
        });
        await assertCartTitleCentered(panel);
        const panelBox = await panel.boundingBox();
        expect(panelBox).not.toBeNull();
        expect(panelBox!.width).toBeGreaterThanOrEqual(500);
        expect(panelBox!.width).toBeLessThanOrEqual(540);
        await snapCartPanel(page, panel, `cart-${scenario}-${theme}-d1280`);
      });
    }
  }
});

test.describe('Cart checkout sheet step 2 (themes)', () => {
  test.beforeEach(async ({ seed, asGuest }) => {
    void asGuest;
    await ensureCheckoutOrderSettings(seed.restaurantId, seed.restaurantAdmin.auth.accessToken);
    if (!guestAddressesCleared) {
      await clearGuestAddresses(seed.restaurantId, seed.guest.accessToken);
      guestAddressesCleared = true;
    }
  });

  for (const theme of CHECKOUT_SHEET_THEMES) {
    for (const viewportKey of CHECKOUT_SHEET_VIEWPORTS) {
      for (const scenario of CHECKOUT_STEP2_SCENARIOS) {
        test(`${scenario} ${theme} @${viewportKey}`, async ({ page, seed, asGuest }) => {
          void asGuest;
          await page.setViewportSize(VIEWPORTS[viewportKey]);
          await applyTheme(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, theme);
          const fulfillment =
            scenario === 'step2-pickup'
              ? 'fulfillmentTakeaway'
              : scenario === 'step2-dine-in'
                ? 'fulfillmentDineIn'
                : 'fulfillmentDelivery';
          await seedCart(
            page,
            seed.restaurantId,
            fulfillment,
            1,
            scenario === 'step2-delivery',
          );
          const panel = await openScenario(page, seed.restaurantId, scenario, {
            deliverySnapshot: scenario === 'step2-delivery',
          });
          await assertCartTitleCentered(panel);
          await snapCartPanel(page, panel, `cart-${scenario}-${theme}-${viewportKey}`);
        });
      }
    }
  }
});

test.describe('Product and auth modal visual', () => {
  for (const viewportKey of ['m390', 'd1280'] as const) {
    test(`product modal classic @${viewportKey}`, async ({ page, seed, asGuest }) => {
      void asGuest;
      await page.setViewportSize(VIEWPORTS[viewportKey]);
      await applyTheme(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, 'classic');
      await page.goto(`/restaurants/${seed.restaurantId}`);
      const opener = page.locator('[data-testid^="menu-item-"]').first();
      await expect(opener).toBeVisible();
      await opener.click();
      const panel = page.getByTestId('menu-product-modal-panel');
      await expect(panel).toBeVisible();
      await expect(page.getByTestId('menu-product-modal-title')).toBeVisible();
      const photo = panel.locator('.menu-product-modal__media img');
      await expect(photo).toBeVisible();
      await expect
        .poll(() => photo.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0))
        .toBe(true);
      await snapCartPanel(page, panel, `product-modal-classic-${viewportKey}`);
    });

    test(`auth modal classic @${viewportKey}`, async ({ page, seed }) => {
      await page.setViewportSize(VIEWPORTS[viewportKey]);
      await applyTheme(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, 'classic');
      await page.goto(`/restaurants/${seed.restaurantId}`);
      await page.getByTestId('guest-profile-button').click();
      const panel = page.getByTestId('restaurant-auth-modal-panel');
      await expect(panel).toBeVisible();
      await expect(page.getByTestId('restaurant-auth-modal-title')).toBeVisible();
      await page.getByTestId('restaurant-auth-modal-title').evaluate((el) => {
        el.textContent = 'Вход в E2E Cafe';
      });
      await snapCartPanel(page, panel, `auth-modal-classic-${viewportKey}`);
    });
  }
});
