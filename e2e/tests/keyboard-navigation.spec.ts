import { test, expect, apiClient } from '../fixtures/test';
import type { CartLineItem } from '../../src/shared/types/cart';

function buildLine(): CartLineItem {
  return {
    id: 'kbd-line-1',
    lineKey: 'kbd-1',
    menuItemId: 'kbd-item-1',
    name: 'Блюдо для клавиатуры',
    variantLabel: null,
    quantity: 1,
    unitPrice: 12,
    imageUrl: '',
    imageWebpUrl: null,
    modifiers: [],
    modifierSelections: {},
  };
}

async function seedCart(page: import('@playwright/test').Page, restaurantId: string) {
  await page.addInitScript(
    ({ rid, cartItems }) => {
      window.localStorage.setItem(
        'svels-cart',
        JSON.stringify({
          state: {
            version: 2,
            restaurantId: rid,
            items: cartItems,
            checkoutByRestaurant: {},
          },
          version: 2,
        }),
      );
    },
    { rid: restaurantId, cartItems: [buildLine()] },
  );
}

test.describe('Keyboard navigation', () => {
  test('cart modal: trap, Escape, focus return', async ({ page, seed, asGuest }) => {
    void asGuest;
    await seedCart(page, seed.restaurantId);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/restaurants/${seed.restaurantId}`);

    const opener = page.getByTestId('cart-button');
    await opener.focus();
    await page.keyboard.press('Enter');
    const root = page.getByTestId('restaurant-cart-modal');
    await expect(root).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(root).toBeHidden();
    await expect(opener).toBeFocused();
  });

  test('checkout step 2: keyboard through primary controls', async ({ page, seed, asGuest }) => {
    void asGuest;
    await seedCart(page, seed.restaurantId);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/restaurants/${seed.restaurantId}`);
    await page.getByTestId('cart-button').click();
    await expect(page.getByTestId('restaurant-cart-modal')).toBeVisible();

    await page.getByTestId('cart-go-to-checkout').click();
    await expect(page.getByTestId('cart-submit')).toBeVisible({ timeout: 15_000 });

    await page.getByTestId('cart-customer-name').focus();
    await expect(page.getByTestId('cart-customer-name')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByTestId('cart-customer-phone')).toBeFocused();
  });

  test('venue guest login page: tab to phone and consent', async ({ page, seed }) => {
    await page.context().clearCookies();
    await page.goto(`/restaurants/${seed.restaurantId}/auth`);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await expect(page.getByTestId('guest-otp-phone-form')).toBeVisible();

    await page.getByTestId('otp-phone').focus();
    await expect(page.getByTestId('otp-phone')).toBeFocused();

    await page.getByTestId('guest-otp-privacy-consent').focus();
    await expect(page.getByTestId('guest-otp-privacy-consent')).toBeFocused();

    await page.getByTestId('otp-send-submit').focus();
    await expect(page.getByTestId('otp-send-submit')).toBeFocused();
  });

  test('segmented control: arrow keys change fulfillment', async ({ page, seed, asGuest }) => {
    void asGuest;
    await apiClient.setOrderSettings(seed.restaurantId, seed.restaurantAdmin.auth.accessToken, {
      fulfillmentDelivery: true,
      fulfillmentTakeaway: true,
      fulfillmentDineIn: false,
    });
    await seedCart(page, seed.restaurantId);
    await page.goto(`/restaurants/${seed.restaurantId}`);
    await page.getByTestId('cart-button').click();
    await expect(page.getByTestId('restaurant-cart-modal')).toBeVisible();

    const seg = page.getByTestId('cart-fulfillment-switcher');
    await expect(seg).toBeVisible();
    await seg.locator('[role="radio"][aria-checked="true"]').focus();
    await page.keyboard.press('ArrowRight');
    const checked = seg.locator('[role="radio"][aria-checked="true"]');
    await expect(checked).toHaveCount(1);
  });
});
