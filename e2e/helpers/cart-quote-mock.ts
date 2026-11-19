import type { Page, Route } from '@playwright/test';
import type { CartLineItem } from '../../src/shared/types/cart';
import type { CartLoyaltyDiscount, CartQuoteResponse } from '../../src/shared/types/pre-order';

export function plainQuoteFromLines(
  items: Array<Pick<CartLineItem, 'menuItemId' | 'name' | 'unitPrice' | 'quantity'>>,
): CartQuoteResponse {
  const lines = items.map((item) => {
    const lineTotal = Math.round(item.unitPrice * item.quantity * 100) / 100;
    return {
      menuItemId: item.menuItemId,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      modifiers: [],
      lineTotal,
    };
  });
  const subtotal = Math.round(lines.reduce((sum, line) => sum + line.lineTotal, 0) * 100) / 100;
  return {
    lines,
    subtotal,
    loyaltyDiscount: null,
    giftRewards: [],
    total: subtotal,
  };
}

export function quoteWithPercentDiscount(input: {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  levelName: string;
  percentOff: number;
  giftName?: string;
}): CartQuoteResponse {
  const subtotal = Math.round(input.unitPrice * input.quantity * 100) / 100;
  const amount = Math.round(subtotal * (input.percentOff / 100) * 100) / 100;
  const loyaltyDiscount: CartLoyaltyDiscount = {
    levelId: 'level-iskra',
    levelName: input.levelName,
    rewardType: 'percent_discount',
    percentOff: input.percentOff,
    amountOff: null,
    amount,
  };
  return {
    lines: [
      {
        menuItemId: input.menuItemId,
        name: input.name,
        quantity: input.quantity,
        unitPrice: input.unitPrice,
        modifiers: [],
        lineTotal: subtotal,
      },
    ],
    subtotal,
    loyaltyDiscount,
    giftRewards: input.giftName ? [{ name: input.giftName }] : [],
    total: Math.round((subtotal - amount) * 100) / 100,
  };
}

export async function fulfillCartQuote(route: Route, quote: CartQuoteResponse): Promise<void> {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(quote),
  });
}

/** Успешная котировка без скидки: итог совпадает с клиентской суммой строк. */
export async function mockPlainCartQuote(
  page: Page,
  restaurantId: string,
  items: Array<Pick<CartLineItem, 'menuItemId' | 'name' | 'unitPrice' | 'quantity'>>,
): Promise<void> {
  const prices = new Map(items.map((item) => [item.menuItemId, item]));
  await page.route(`**/restaurants/${restaurantId}/pre-orders/quote`, async (route) => {
    if (route.request().method() !== 'POST') {
      await route.fallback();
      return;
    }
    const body = route.request().postDataJSON() as {
      items?: Array<{ menuItemId: string; quantity: number }>;
    };
    const quoted = (body.items ?? []).map((item) => {
      const known = prices.get(item.menuItemId);
      return {
        menuItemId: item.menuItemId,
        name: known?.name ?? 'Блюдо',
        unitPrice: known?.unitPrice ?? 0,
        quantity: item.quantity,
      };
    });
    await fulfillCartQuote(route, plainQuoteFromLines(quoted));
  });
}
