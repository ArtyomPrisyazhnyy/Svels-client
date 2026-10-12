import { test, expect, apiClient } from '../fixtures/test';
import { revalidateRestaurantPublicPage } from '../helpers/revalidate-public-page';
import {
  assertCartTitleCentered,
  assertExpandedRowContentGap,
  snapCartCrop,
  snapCartPanel,
} from '../helpers/cart-visual';
import { VIEWPORTS, type VisualViewportKey } from '../helpers/visual';
import type { CartLineItem } from '../../src/shared/types/cart';
import type { RestaurantColorTheme } from '../../src/shared/types/restaurant-styling';

const THEMES = ['classic', 'midnight', 'warm'] as const;
const VIEWPORT_KEYS: VisualViewportKey[] = ['m360', 'm390', 't768'];
const DESKTOP_SCENARIOS: CheckoutScenario[] = ['step1', 'step2-delivery', 'step2-pickup'];

/** One styling/settings write per worker. Repeating them on every shot trips the API rate limit and drops the pickup row. */
let orderSettingsApplied = false;
let appliedTheme: RestaurantColorTheme | null = null;

type CheckoutScenario =
  | 'step1'
  | 'step2-delivery'
  | 'step2-pickup'
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
  fulfillment: 'fulfillmentDelivery' | 'fulfillmentTakeaway' = 'fulfillmentDelivery',
  itemCount = 1,
) {
  await page.addInitScript(
    ({ rid, cartItems, fulfillmentKey }) => {
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
    deliveryForSomeoneElse: true,
  });
  await revalidateRestaurantPublicPage(restaurantId);
  orderSettingsApplied = true;
}

async function openScenario(
  page: import('@playwright/test').Page,
  restaurantId: string,
  scenario: CheckoutScenario,
) {
  await page.goto(`/restaurants/${restaurantId}`);
  await page.getByTestId('cart-button').click();
  const panel = page.getByTestId('cart-modal-panel');
  await expect(panel).toBeVisible();

  if (scenario === 'step1') {
    return panel;
  }

  if (scenario === 'step2-pickup') {
    await page.getByRole('radio', { name: 'Самовывоз' }).click();
  }

  await page.getByTestId('cart-go-to-checkout').click();
  await expect(page.getByTestId('cart-checkout-step')).toBeVisible();

  if (scenario === 'step2-pickup') {
    await expect(page.getByTestId('cart-location-row')).toBeVisible({ timeout: 30_000 });
  }

  if (scenario === 'step2-delivery' || scenario === 'step2-pickup') {
    return panel;
  }

  if (scenario === 'row-time-slot') {
    const timeRow = page.getByTestId('cart-time-row');
    await timeRow.getByRole('button').first().click();
    await page.getByTestId('requested-time-slot-mode').click();
    await expect(page.getByTestId('requested-time-slot-select')).toBeVisible();
    await assertExpandedRowContentGap(timeRow);
    await timeRow.evaluate((el) => el.scrollIntoView({ block: 'start', inline: 'nearest' }));
    return panel;
  }

  const rowMap: Record<string, string> = {
    'row-time': 'cart-time-row',
    'row-payment': 'cart-payment-row',
    'row-comment': 'cart-comment-row',
    'row-address-extra': 'cart-address-extra-row',
    'row-recipient': 'cart-recipient-row',
  };
  const rowTestId = rowMap[scenario];
  const row = page.getByTestId(rowTestId);
  await expect(row).toBeVisible();
  await row.getByRole('button').first().click();
  await assertExpandedRowContentGap(row);
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
  });

  for (const theme of THEMES) {
    for (const viewportKey of VIEWPORT_KEYS) {
      for (const scenario of scenarios) {
        test(`${scenario} ${theme} @${viewportKey}`, async ({ page, seed, asGuest }) => {
          void asGuest;
          await page.setViewportSize(VIEWPORTS[viewportKey]);
          await applyTheme(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, theme);
          const fulfillment =
            scenario === 'step2-pickup' ? 'fulfillmentTakeaway' : 'fulfillmentDelivery';
          await seedCart(
            page,
            seed.restaurantId,
            fulfillment,
            scenario === 'step1' ? 3 : 1,
          );
          const panel = await openScenario(page, seed.restaurantId, scenario);
          await assertCartTitleCentered(panel);
          await snapCartPanel(page, panel, `cart-${scenario}-${theme}-${viewportKey}`);
        });
      }

      test(`crops header+selectors ${theme} @${viewportKey}`, async ({ page, seed, asGuest }) => {
        void asGuest;
        await page.setViewportSize(VIEWPORTS[viewportKey]);
        await applyTheme(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, theme);
        await seedCart(page, seed.restaurantId, 'fulfillmentDelivery');
        const panel = await openScenario(page, seed.restaurantId, 'step2-delivery');
        await page.getByTestId('cart-time-row').getByRole('button').first().click();
        await page.getByTestId('requested-time-slot-mode').click();
        await page.getByTestId('cart-payment-row').getByRole('button').first().click();
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
        await seedCart(page, seed.restaurantId, fulfillment, scenario === 'step1' ? 3 : 1);
        const panel = await openScenario(page, seed.restaurantId, scenario);
        await assertCartTitleCentered(panel);
        await snapCartPanel(page, panel, `cart-${scenario}-${theme}-d1280`);
      });
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
