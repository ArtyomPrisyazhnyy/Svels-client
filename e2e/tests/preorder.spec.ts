import { test, expect, apiClient } from '../fixtures/test';
import { getApiUrl } from '../helpers/env';
import { revalidateRestaurantPublicPage } from '../helpers/revalidate-public-page';
import type { OrderDto } from '../../src/shared/types/pre-order';
import type { RestaurantOrderSettings } from '../../src/shared/types/order-settings';

async function fetchMyOrders(token: string): Promise<OrderDto[]> {
  const response = await fetch(`${getApiUrl()}/users/me/pre-orders`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`GET /users/me/pre-orders → ${response.status}`);
  }
  return (await response.json()) as OrderDto[];
}

async function setOrdersPaused(
  restaurantId: string,
  token: string,
  ordersPaused: boolean,
): Promise<RestaurantOrderSettings> {
  const response = await fetch(
    `${getApiUrl()}/restaurants/${restaurantId}/order-settings/pause`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ordersPaused }),
    },
  );
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`PATCH order-settings/pause → ${response.status}: ${text}`);
  }
  return (await response.json()) as RestaurantOrderSettings;
}

async function addFirstMenuItemToCart(
  page: import('@playwright/test').Page,
  restaurantId: string,
  preferredMenuItemId?: string,
) {
  let menuItemId = preferredMenuItemId;
  if (!menuItemId) {
    const menu = await apiClient.getMenu(restaurantId);
    menuItemId = menu.categories.flatMap((c) => c.items)[0]?.id;
  }
  test.skip(!menuItemId, 'Need a menu item in seeded restaurant');

  await page.getByTestId(`menu-item-${menuItemId}`).click();
  await expect(page.getByTestId('menu-add-to-cart')).toBeVisible();
  await page.getByTestId('menu-add-to-cart').click();
  await page.getByTestId('cart-button').click();
  await expect(page.getByTestId('restaurant-cart-modal')).toBeVisible();
}

test.describe('Pre-order', () => {
  test('неавторизованный → редирект на auth', async ({ page, seed }) => {
    await page.goto(`/restaurants/${seed.restaurantId}/pre-order`);
    await expect(page).toHaveURL(new RegExp(`/restaurants/${seed.restaurantId}/auth`));
  });

  test('страница «Мои заказы» для авторизованного гостя', async ({ page, seed, asGuest }) => {
    void asGuest;
    await page.goto(`/restaurants/${seed.restaurantId}/pre-order`);
    await expect(page.getByTestId('preorder-page')).toBeVisible();
    await expect(
      page.locator('.restaurant-styled').filter({ has: page.getByTestId('preorder-page') }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Мои заказы' })).toBeVisible();
  });

  test('самовывоз + наличные → заказ создан', async ({ page, seed, asGuest }) => {
    void asGuest;
    const adminToken = seed.restaurantAdmin.auth.accessToken;

    await apiClient.setOrderSettings(seed.restaurantId, adminToken, {
      fulfillmentDelivery: false,
      fulfillmentTakeaway: true,
      fulfillmentDineIn: false,
      paymentCash: true,
      paymentCardOnSite: false,
      paymentOnline: false,
    });
    await setOrdersPaused(seed.restaurantId, adminToken, false);
    await revalidateRestaurantPublicPage(seed.restaurantId);

    await page.goto(`/restaurants/${seed.restaurantId}`);
    await addFirstMenuItemToCart(page, seed.restaurantId, seed.menu.defaultMenuItemId);

    await page.getByTestId('cart-go-to-checkout').click();
    await expect(page.getByTestId('cart-checkout-step')).toBeVisible();

    const phoneField = page.locator('#cart-customer-phone');
    if ((await phoneField.inputValue()).replace(/\D/g, '').length < 9) {
      await phoneField.fill('29 123 45 67');
    }

    await page.getByTestId('cart-submit').click();
    await expect(page.getByTestId('cart-order-success')).toBeVisible({ timeout: 20_000 });

    const orders = await fetchMyOrders(seed.guest.accessToken);
    const latest = orders.find((o) => o.restaurantId === seed.restaurantId);
    expect(latest).toBeTruthy();
    expect(latest!.fulfillmentType).toBe('takeaway');
    expect(latest!.customerPhone.replace(/\D/g, '')).toMatch(/^375/);
  });

  test('доставка без адреса → кнопка оформления неактивна', async ({ page, seed, asGuest }) => {
    void asGuest;
    const adminToken = seed.restaurantAdmin.auth.accessToken;

    await apiClient.setOrderSettings(seed.restaurantId, adminToken, {
      fulfillmentDelivery: true,
      fulfillmentTakeaway: false,
      fulfillmentDineIn: false,
      paymentCash: true,
    });
    await setOrdersPaused(seed.restaurantId, adminToken, false);
    await revalidateRestaurantPublicPage(seed.restaurantId);

    await page.goto(`/restaurants/${seed.restaurantId}`);
    await addFirstMenuItemToCart(page, seed.restaurantId, seed.menu.defaultMenuItemId);

    await page.getByTestId('cart-go-to-checkout').click();
    await expect(page.getByTestId('delivery-address-fields')).toBeVisible();
    await page.getByTestId('delivery-street').fill('');
    await page.getByTestId('delivery-house').fill('');
    const submit = page.getByTestId('cart-submit');
    await expect(submit).toBeEnabled();
    await expect(submit).toHaveText('Укажите адрес');
  });

  test('корзина: шаг 1 → шаг оформления', async ({ page, seed, asGuest }) => {
    void asGuest;
    await page.goto(`/restaurants/${seed.restaurantId}`);
    await addFirstMenuItemToCart(page, seed.restaurantId, seed.menu.defaultMenuItemId);
    await expect(page.getByTestId('cart-go-to-checkout')).toBeVisible();
    await page.getByTestId('cart-go-to-checkout').click();
    await expect(page.getByTestId('cart-checkout-step')).toBeVisible();
    await page.getByTestId('cart-back-to-step-1').click();
    await expect(page.getByRole('heading', { name: 'Корзина' })).toBeVisible();
  });

  test('пауза приёма → сообщение и неактивная кнопка', async ({ page, seed, asGuest }) => {
    void asGuest;
    const adminToken = seed.restaurantAdmin.auth.accessToken;

    await setOrdersPaused(seed.restaurantId, adminToken, true);
    await revalidateRestaurantPublicPage(seed.restaurantId);

    try {
      await page.goto(`/restaurants/${seed.restaurantId}`);
      await addFirstMenuItemToCart(page, seed.restaurantId, seed.menu.defaultMenuItemId);
      await expect(page.getByTestId('orders-paused-banner')).toHaveText(
        /не принимает заказы/i,
      );
      await expect(page.getByTestId('cart-go-to-checkout')).toBeDisabled();
    } finally {
      await setOrdersPaused(seed.restaurantId, adminToken, false);
    }
  });
});
