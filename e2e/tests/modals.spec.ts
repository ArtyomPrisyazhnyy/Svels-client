import { test, expect } from '../fixtures/test';
import { assertCartTitleCentered } from '../helpers/cart-visual';
import type { CartLineItem } from '../../src/shared/types/cart';

function buildLine(): CartLineItem {
  return {
    id: 'modals-line-1',
    lineKey: 'modals-1',
    menuItemId: 'modals-item-1',
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

async function clickBackdrop(page: import('@playwright/test').Page, rootTestId: string) {
  const root = page.getByTestId(rootTestId);
  await expect(root).toBeVisible();
  await page.waitForFunction((testId) => {
    const modal = document.querySelector(`[data-testid="${testId}"]`);
    const backdrop = modal?.previousElementSibling;
    return (
      backdrop instanceof HTMLElement &&
      backdrop.classList.contains('ui-modal__backdrop--active')
    );
  }, rootTestId);

  const point = await page.evaluate((testId) => {
    const modal = document.querySelector(`[data-testid="${testId}"]`);
    const backdrop = modal?.previousElementSibling;
    if (!(backdrop instanceof HTMLElement) || !modal) {
      return null;
    }
    const panel = modal.querySelector('.ui-overlay-panel');
    const panelTop = panel?.getBoundingClientRect().top ?? 80;
    const x = 16;
    const candidates = [Math.max(4, panelTop - 8), 8, panelTop / 2];
    for (const y of candidates) {
      if (document.elementFromPoint(x, y) === backdrop) {
        return { x, y };
      }
    }
    for (let y = 4; y < window.innerHeight; y += 6) {
      if (document.elementFromPoint(x, y) === backdrop) {
        return { x, y };
      }
    }
    return null;
  }, rootTestId);

  if (!point) {
    throw new Error(`backdrop not hittable for ${rootTestId}`);
  }
  await page.mouse.click(point.x, point.y);
}

test.describe('Modals', () => {
  test('корзина: backdrop, Escape, ×, фокус, заголовок по центру', async ({
    page,
    seed,
    asGuest,
  }) => {
    void asGuest;
    await seedCart(page, seed.restaurantId);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/restaurants/${seed.restaurantId}`);
    const opener = page.getByTestId('cart-button');
    await opener.click();
    const root = page.getByTestId('restaurant-cart-modal');
    const panel = page.getByTestId('cart-modal-panel');
    await expect(root).toBeVisible();
    await assertCartTitleCentered(panel);
    await expect(page.getByTestId('cart-header-bar').getByTestId('cart-clear')).toHaveCount(0);

    await page.keyboard.press('Escape');
    await expect(root).toBeHidden();
    await expect(opener).toBeFocused();

    await opener.click();
    await page.getByTestId('cart-close').click();
    await expect(root).toBeHidden();
    await expect(opener).toBeFocused();

    await opener.click();
    await clickBackdrop(page, 'restaurant-cart-modal');
    await expect(root).toBeHidden();
    await expect(opener).toBeFocused();

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`/restaurants/${seed.restaurantId}`);
    await page.getByTestId('cart-button').click();
    await expect(page.getByTestId('restaurant-cart-modal')).toBeVisible();
    await assertCartTitleCentered(page.getByTestId('cart-modal-panel'));
  });

  test('карточка блюда: backdrop, Escape, ×, фокус возвращается', async ({
    page,
    seed,
    asGuest,
  }) => {
    void asGuest;
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/restaurants/${seed.restaurantId}`);
    const opener = page.locator('[data-testid^="menu-item-"]').first();
    await expect(opener).toBeVisible();
    await opener.click();
    const root = page.getByTestId('menu-product-modal');
    await expect(root).toBeVisible();
    await expect(page.getByTestId('menu-product-modal-title')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(root).toBeHidden();
    await expect(opener).toBeFocused();

    await opener.click();
    await page.getByTestId('menu-product-modal-close').click();
    await expect(root).toBeHidden();
    await expect(opener).toBeFocused();

    await opener.click();
    await clickBackdrop(page, 'menu-product-modal');
    await expect(root).toBeHidden();
    await expect(opener).toBeFocused();
  });

  test('вход гостя: backdrop, Escape, ×, фокус возвращается', async ({ page, seed }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/restaurants/${seed.restaurantId}`);
    const opener = page.getByTestId('guest-profile-button');
    await opener.click();
    const root = page.getByTestId('restaurant-auth-modal');
    await expect(root).toBeVisible();
    await expect(page.getByTestId('restaurant-auth-modal-title')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(root).toBeHidden();
    await expect(opener).toBeFocused();

    await opener.click();
    await page.getByTestId('restaurant-auth-modal-close').click();
    await expect(root).toBeHidden();
    await expect(opener).toBeFocused();

    await opener.click();
    await clickBackdrop(page, 'restaurant-auth-modal');
    await expect(root).toBeHidden();
    await expect(opener).toBeFocused();
  });
});
