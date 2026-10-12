import { test, expect, apiClient } from '../fixtures/test';
import { revalidateRestaurantPublicPage } from '../helpers/revalidate-public-page';
import { clearGuestAddresses } from '../helpers/guest-addresses';
import { readSeed } from '../helpers/env';
async function enableDeliveryOnly(restaurantId: string, adminToken: string) {
  await apiClient.setOrderSettings(restaurantId, adminToken, {
    fulfillmentDelivery: true,
    fulfillmentTakeaway: false,
    fulfillmentDineIn: false,
    paymentCash: true,
    paymentCardOnSite: false,
    paymentOnline: false,
  });
  await revalidateRestaurantPublicPage(restaurantId);
}

async function addMenuItemToCart(page: import('@playwright/test').Page, menuItemId: string) {
  await page.getByTestId(`menu-item-${menuItemId}`).click();
  await page.getByTestId('menu-add-to-cart').click();
  await page.getByTestId('cart-button').click();
  await expect(page.getByTestId('restaurant-cart-modal')).toBeVisible();
}

async function goToDeliveryCheckout(page: import('@playwright/test').Page) {
  await page.getByTestId('cart-go-to-checkout').click();
  await expect(page.getByTestId('cart-checkout-step')).toBeVisible();
}

test.describe('Guest saved addresses', () => {
  test('checkout: сохранение адреса, sheet, default, заказ с addressId', async ({
    page,
    seed,
    asGuest,
  }) => {
    void asGuest;
    const { restaurantId } = seed;
    const guestToken = seed.guest.accessToken;
    const adminToken = seed.restaurantAdmin.auth.accessToken;

    const existing = await apiClient.listGuestAddresses(restaurantId, guestToken);
    for (const row of existing) {
      await apiClient.deleteGuestAddress(restaurantId, guestToken, row.id);
    }

    await enableDeliveryOnly(restaurantId, adminToken);
    await page.goto(`/restaurants/${restaurantId}`);
    await addMenuItemToCart(page, seed.menu.defaultMenuItemId);
    await goToDeliveryCheckout(page);

    await expect(page.getByTestId('delivery-address-fields')).toBeVisible();
    await expect(page.getByTestId('address-save-checkbox')).toBeVisible();
    await expect(page.getByTestId('address-save-checkbox')).toBeChecked();
    await page.getByTestId('delivery-street').fill('Пушкина');
    await page.getByTestId('delivery-house').fill('10');
    await page.getByTestId('cart-submit').click();
    await expect(page.getByTestId('cart-order-success')).toBeVisible({ timeout: 20_000 });
    await page.getByTestId('cart-close').click();
    await expect(page.getByTestId('restaurant-cart-modal')).toHaveCount(0);

    await addMenuItemToCart(page, seed.menu.defaultMenuItemId);
    await goToDeliveryCheckout(page);
    await expect(page.getByTestId('checkout-address-row')).toBeVisible();
    await expect(page.getByTestId('checkout-address-row')).toContainText('Пушкина');

    await page.getByTestId('checkout-address-row').getByRole('button').first().click();
    await expect(page.getByTestId('address-sheet')).toBeVisible();
    await page.getByTestId('address-sheet').getByTestId('address-add').click();
    await page.getByTestId('delivery-street').fill('Ленина');
    await page.getByTestId('delivery-house').fill('5');
    await page.getByTestId('address-label-chips').getByRole('button', { name: 'Работа' }).click();
    await page.getByTestId('address-default-checkbox').check();
    await page.getByTestId('address-save').click();
    await expect(page.getByTestId('guest-address-list')).toBeVisible();

    const addresses = await apiClient.listGuestAddresses(restaurantId, guestToken);
    const work = addresses.find((row) => row.label === 'Работа');
    expect(work).toBeTruthy();
    expect(work!.isDefault).toBe(true);

    await expect(page.getByTestId(`address-option-${work!.id}`)).toBeVisible();
    await page
      .getByTestId('address-sheet')
      .getByTestId(`address-option-${work!.id}`)
      .getByRole('button')
      .first()
      .click();
    await expect(page.getByTestId('address-sheet')).toHaveCount(0);
    await expect(page.getByTestId('checkout-address-row')).toContainText('Работа');

    const home = addresses.find((row) => row.street === 'Пушкина');
    expect(home).toBeTruthy();
    await page.getByTestId('checkout-address-row').getByRole('button').first().click();
    await page.getByTestId(`address-menu-${home!.id}`).click();
    await page.getByRole('button', { name: 'Изменить' }).click();
    await page.getByTestId('address-label-input').fill('Домик');
    await page.getByTestId('address-save').click();

    await page.getByTestId(`address-menu-${home!.id}`).click();
    await page.getByTestId('address-delete-start').click();
    await page.getByTestId('address-delete-yes').click();
    await expect(page.getByTestId(`address-option-${home!.id}`)).toHaveCount(0);

    await page.getByTestId(`address-option-${work!.id}`).getByRole('button').first().click();
    await page.getByTestId('cart-submit').click();
    await expect(page.getByTestId('cart-order-success')).toBeVisible({ timeout: 20_000 });

    await page.goto(`/restaurants/${restaurantId}/pre-order`);
    await expect(page.getByTestId('guest-orders-list')).toBeVisible();
    await page.locator('[data-testid^="guest-order-row-"]').first().click();
    await expect(page.getByTestId('guest-order-detail')).toContainText('Ленина');

    await page.goto(`/restaurants/${restaurantId}/account`);
    await expect(page.getByTestId('account-addresses')).toBeVisible();
    await expect(page.getByTestId('guest-address-list')).toBeVisible();
  });

  test.afterAll(async () => {
    const seed = readSeed();
    await clearGuestAddresses(seed.restaurantId, seed.guest.accessToken);
  });

  test('лимит 10 адресов — подсказка в sheet', async ({ page, seed, asGuest }) => {
    void asGuest;
    const { restaurantId } = seed;
    const guestToken = seed.guest.accessToken;
    const adminToken = seed.restaurantAdmin.auth.accessToken;

    const existing = await apiClient.listGuestAddresses(restaurantId, guestToken);
    for (const row of existing) {
      await apiClient.deleteGuestAddress(restaurantId, guestToken, row.id);
    }
    await apiClient.seedGuestAddresses(restaurantId, guestToken, 10);

    await enableDeliveryOnly(restaurantId, adminToken);
    await page.goto(`/restaurants/${restaurantId}`);
    await addMenuItemToCart(page, seed.menu.defaultMenuItemId);
    await goToDeliveryCheckout(page);
    await page.getByTestId('checkout-address-row').getByRole('button').first().click();
    await expect(page.getByTestId('address-limit-hint')).toBeVisible();
  });
});
