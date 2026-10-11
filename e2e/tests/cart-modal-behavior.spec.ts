import { test, expect, apiClient } from '../fixtures/test';
import { revalidateRestaurantPublicPage } from '../helpers/revalidate-public-page';
import { assertCartTitleCentered } from '../helpers/cart-visual';
import type { CartLineItem } from '../../src/shared/types/cart';

function buildLine(): CartLineItem {
  return {
    id: 'cart-modal-line-1',
    lineKey: 'modal-1',
    menuItemId: 'modal-item-1',
    name: 'Тестовое блюдо',
    variantLabel: null,
    quantity: 1,
    unitPrice: 10,
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

test.describe('Cart modal behavior', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('закрытие по backdrop, Escape и ×; заголовок по центру', async ({
    page,
    seed,
    asGuest,
  }) => {
    void asGuest;
    await seedCart(page, seed.restaurantId);
    await page.goto(`/restaurants/${seed.restaurantId}`);
    const opener = page.getByTestId('cart-button');
    await opener.click();
    const panel = page.getByTestId('cart-modal-panel');
    await expect(page.getByTestId('restaurant-cart-modal')).toBeVisible();
    await assertCartTitleCentered(panel);

    await page.keyboard.press('Escape');
    await expect(page.getByTestId('restaurant-cart-modal')).toBeHidden();
    await expect(opener).toBeFocused();

    await opener.click();
    await page.getByTestId('cart-close').click();
    await expect(page.getByTestId('restaurant-cart-modal')).toBeHidden();

    await opener.click();
    await page.evaluate(() => {
      const backdrop = document.querySelector('.ui-modal__backdrop');
      if (backdrop instanceof HTMLButtonElement) {
        backdrop.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        backdrop.click();
      }
    });
    await expect(page.getByTestId('restaurant-cart-modal')).toBeHidden();
  });

  test('Escape на шаге 2 закрывает модалку (не возврат на шаг 1)', async ({
    page,
    seed,
    asGuest,
  }) => {
    void asGuest;
    await seedCart(page, seed.restaurantId);
    await page.goto(`/restaurants/${seed.restaurantId}`);
    await page.getByTestId('cart-button').click();
    await page.getByTestId('cart-go-to-checkout').click();
    await expect(page.getByTestId('cart-checkout-step')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('restaurant-cart-modal')).toBeHidden();
  });

  test('«Очистить» в секции позиций, не в шапке', async ({ page, seed, asGuest }) => {
    void asGuest;
    await seedCart(page, seed.restaurantId);
    await page.goto(`/restaurants/${seed.restaurantId}`);
    await page.getByTestId('cart-button').click();
    await expect(page.getByTestId('cart-clear')).toBeVisible();
    await expect(page.getByTestId('cart-header-bar').getByTestId('cart-clear')).toHaveCount(0);
    await page.getByTestId('cart-clear').click();
    await page.getByTestId('cart-clear-confirm-yes').click();
    await expect(page.getByTestId('cart-empty')).toBeVisible();
  });

  test('время: SegmentedControl как у оплаты', async ({ page, seed, asGuest }) => {
    void asGuest;
    const adminToken = seed.restaurantAdmin.auth.accessToken;
    await apiClient.setOrderSettings(seed.restaurantId, adminToken, {
      fulfillmentDelivery: true,
      fulfillmentTakeaway: false,
      fulfillmentDineIn: false,
      paymentCash: true,
      paymentCardOnSite: true,
    });
    await revalidateRestaurantPublicPage(seed.restaurantId);
    await seedCart(page, seed.restaurantId);
    await page.goto(`/restaurants/${seed.restaurantId}`);
    await page.getByTestId('cart-button').click();
    await page.getByTestId('cart-go-to-checkout').click();
    const timeRow = page.getByTestId('cart-time-row');
    await timeRow.getByRole('button').click();
    await expect(page.getByTestId('cart-requested-time-segmented')).toBeVisible();
    await page.getByTestId('cart-payment-row').getByRole('button').click();
    const timeSeg = page.getByTestId('cart-requested-time-segmented');
    const paySeg = page.getByTestId('cart-payment-segmented');
    await expect(timeSeg).toHaveClass(/ui-segmented/);
    await expect(paySeg).toHaveClass(/ui-segmented/);

    const streetBox = await page.getByTestId('delivery-street').boundingBox();
    const houseBox = await page.getByTestId('delivery-house').boundingBox();
    expect(streetBox).not.toBeNull();
    expect(houseBox).not.toBeNull();
    expect(Math.abs(streetBox!.y - houseBox!.y)).toBeLessThanOrEqual(8);

    const asapLabel = page.getByTestId('requested-time-asap').locator('.ui-seg__label');
    const labelBox = await asapLabel.boundingBox();
    const lineHeight = await asapLabel.evaluate((el) => {
      const value = getComputedStyle(el).lineHeight;
      return Number.parseFloat(value);
    });
    expect(labelBox).not.toBeNull();
    expect(labelBox!.height).toBeLessThanOrEqual(lineHeight * 1.35);

    const chevronBox = await timeRow.locator('.cart-detail-row__chevron').boundingBox();
    const triggerBox = await timeRow.locator('.cart-detail-row__trigger').boundingBox();
    expect(chevronBox).not.toBeNull();
    expect(triggerBox).not.toBeNull();
    const rightGap = triggerBox!.x + triggerBox!.width - (chevronBox!.x + chevronBox!.width);
    expect(rightGap).toBeGreaterThanOrEqual(8);
    expect(rightGap).toBeLessThanOrEqual(24);
  });
});
