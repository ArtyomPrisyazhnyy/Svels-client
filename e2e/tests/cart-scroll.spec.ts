import type { Locator, Page } from '@playwright/test';
import { test, expect } from '../fixtures/test';
import { assertCartPanelBackgroundIsOpaque } from '../helpers/cart-layout-overlap';
import type { CartLineItem } from '../../src/shared/types/cart';

const LINE_COUNT = 11;

const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1280, height: 800 },
] as const;

function buildLine(index: number): CartLineItem {
  return {
    id: `scroll-line-${index}`,
    lineKey: `scroll-${index}`,
    menuItemId: `scroll-item-${index}`,
    name: `Позиция ${index}`,
    variantLabel: index % 2 === 0 ? '300 мл' : '110 г',
    quantity: 1,
    unitPrice: 4.5 + index * 0.4,
    imageUrl: '/e2e/menu-dish.png',
    imageWebpUrl: null,
    modifiers:
      index % 3 === 0
        ? [{ groupName: 'Молоко', optionName: 'Обычное', priceDelta: 0 }]
        : [],
    modifierSelections: {},
  };
}

async function seedCart(page: Page, restaurantId: string) {
  const items = Array.from({ length: LINE_COUNT }, (_, index) => buildLine(index + 1));
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
    { rid: restaurantId, cartItems: items },
  );
}

async function openCart(page: Page, restaurantId: string) {
  await page.goto(`/restaurants/${restaurantId}`);
  await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' });
  await page.getByTestId('cart-button').click();
  await expect(page.getByTestId('restaurant-cart-modal')).toBeVisible();
  await assertCartPanelBackgroundIsOpaque(page);
  await expect(page.getByTestId('cart-items-header')).toContainText('11 товаров');
}

function expectInViewport(
  box: { y: number; height: number },
  viewportHeight: number,
  label: string,
) {
  expect(box.y, `${label} top`).toBeGreaterThanOrEqual(-1);
  expect(box.y + box.height, `${label} bottom`).toBeLessThanOrEqual(viewportHeight + 1);
}

async function boxOf(locator: Locator): Promise<{ x: number; y: number; width: number; height: number }> {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  return box!;
}

test.describe('Cart list scroll', () => {
  test('11 позиций скроллятся до последней, количество растёт, «Оформить заказ» остаётся на экране', async ({
    page,
    seed,
    asGuest,
  }) => {
    void asGuest;
    await seedCart(page, seed.restaurantId);

    for (const viewport of VIEWPORTS) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await openCart(page, seed.restaurantId);

      const checkout = page.getByTestId('cart-go-to-checkout');
      const list = page.getByTestId('cart-items-list');
      const lines = page.getByTestId('cart-line');
      const footer = page.getByTestId('cart-modal-footer');
      const header = page.getByTestId('cart-header-bar');

      await expect(lines).toHaveCount(LINE_COUNT);
      await expect(checkout).toBeVisible();
      await expect(checkout).toHaveText('Оформить заказ');

      const scrollport = await list.evaluate((el) => {
        const style = getComputedStyle(el);
        return {
          overflowY: style.overflowY,
          overscrollBehaviorY: style.overscrollBehaviorY,
          minHeight: style.minHeight,
          scrollHeight: el.scrollHeight,
          clientHeight: el.clientHeight,
        };
      });
      expect(scrollport.overflowY).toBe('auto');
      expect(scrollport.overscrollBehaviorY).toBe('contain');
      expect(scrollport.minHeight).toBe('0px');
      expect(scrollport.scrollHeight).toBeGreaterThan(scrollport.clientHeight + 8);

      const checkoutBefore = await boxOf(checkout);
      const headerBefore = await boxOf(header);
      expectInViewport(checkoutBefore, viewport.height, 'checkout before scroll');
      expectInViewport(headerBefore, viewport.height, 'header');

      const panelBox = await boxOf(page.getByTestId('cart-modal-panel'));
      // dvh and the layout viewport can disagree by a device pixel.
      expect(panelBox.y + panelBox.height).toBeLessThanOrEqual(viewport.height + 2);

      const pageScrollBefore = await page.evaluate(() => window.scrollY);
      await list.hover();
      await page.mouse.wheel(0, 240);
      await expect.poll(async () => list.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
      expect(await page.evaluate(() => window.scrollY)).toBe(pageScrollBefore);

      await list.evaluate((el) => {
        el.scrollTop = el.scrollHeight;
      });
      await expect.poll(async () =>
        list.evaluate((el) => el.scrollHeight - el.clientHeight - el.scrollTop),
      ).toBeLessThanOrEqual(2);

      const checkoutAfterScroll = await boxOf(checkout);
      expectInViewport(checkoutAfterScroll, viewport.height, 'checkout after scroll');
      expect(Math.abs(checkoutAfterScroll.y - checkoutBefore.y)).toBeLessThanOrEqual(1);
      expect(Math.abs(checkoutAfterScroll.height - checkoutBefore.height)).toBeLessThanOrEqual(1);

      const headerAfterScroll = await boxOf(header);
      expect(Math.abs(headerAfterScroll.y - headerBefore.y)).toBeLessThanOrEqual(1);

      const fulfillment = page.getByTestId('cart-fulfillment-switcher');
      if ((await fulfillment.count()) > 0) {
        const fulfillmentBox = await boxOf(fulfillment);
        expectInViewport(fulfillmentBox, viewport.height, 'fulfillment');
      }

      const listBox = await boxOf(list);
      const footerBox = await boxOf(footer);
      expect(listBox.y + listBox.height).toBeLessThanOrEqual(footerBox.y + 1);

      const lastLine = lines.last();
      const lastBox = await boxOf(lastLine);
      expect(lastBox.y).toBeGreaterThanOrEqual(listBox.y - 1);
      expect(lastBox.y + lastBox.height).toBeLessThanOrEqual(listBox.y + listBox.height + 1);
      await expect(lastLine).toBeVisible();

      const firstBox = await lines.first().boundingBox();
      if (firstBox) {
        expect(firstBox.y + firstBox.height).toBeLessThanOrEqual(listBox.y + 1);
      }

      const quantity = lastLine.locator('.restaurant-cart-modal__counter-value');
      await expect(quantity).toHaveText('1');
      await lastLine.getByRole('button', { name: 'Увеличить количество' }).click();
      await expect(quantity).toHaveText('2');
      await expect(page.getByTestId('cart-items-header')).toContainText('12 товаров');

      const checkoutAfterTap = await boxOf(checkout);
      expectInViewport(checkoutAfterTap, viewport.height, 'checkout after increment');
      await expect(checkout).toBeVisible();

      await page.getByTestId('cart-close').click();
      await expect(page.getByTestId('restaurant-cart-modal')).toBeHidden();
    }
  });
});
