import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { CartLineItem } from '../types/cart.ts';
import type { OrderDto } from '../types/pre-order.ts';
import {
  loyaltyDiscountLabel,
  moneyEquals,
  readOrderPriceBreakdown,
  toQuoteItems,
} from './order-price.util.ts';

function line(): CartLineItem {
  return {
    id: 'line-1',
    lineKey: 'k',
    menuItemId: 'item-1',
    name: 'Бургер',
    variantLabel: null,
    imageUrl: '',
    quantity: 2,
    unitPrice: 12,
    modifiers: [{ groupName: 'Соус', optionName: 'Сырный', priceDelta: 2 }],
    modifierSelections: { group: ['opt'] },
  };
}

describe('order price helpers', () => {
  it('quote payload keeps only ids, quantity and modifiers', () => {
    const payload = toQuoteItems([line()]);
    assert.deepEqual(payload, [
      { menuItemId: 'item-1', quantity: 2, modifierSelections: { group: ['opt'] } },
    ]);
    assert.equal('unitPrice' in payload[0], false);
  });

  it('formats percent and fixed level discounts', () => {
    assert.equal(
      loyaltyDiscountLabel({
        levelName: 'Искра',
        rewardType: 'percent_discount',
        percentOff: 10,
        amountOff: null,
      }),
      'Скидка уровня «Искра» −10%',
    );
    assert.equal(
      loyaltyDiscountLabel({
        levelName: 'Искра',
        rewardType: 'fixed_discount',
        percentOff: null,
        amountOff: 25,
      }),
      'Скидка уровня «Искра» −25 р',
    );
  });

  it('compares money in kopecks', () => {
    assert.equal(moneyEquals(21.6, 21.601), true);
    assert.equal(moneyEquals(21.6, 21.5), false);
  });

  it('hides breakdown for old orders and zero discounts', () => {
    const legacy = { totalAmount: 10 } as unknown as OrderDto;
    assert.equal(readOrderPriceBreakdown(legacy), null);
    const plain = {
      totalAmount: 10,
      subtotalAmount: 10,
      loyaltyDiscountAmount: 0,
      loyaltyDiscount: null,
      giftRewards: [],
    } as unknown as OrderDto;
    assert.equal(readOrderPriceBreakdown(plain), null);
  });

  it('reads discount and gifts from the order snapshot', () => {
    const order = {
      totalAmount: 21.6,
      subtotalAmount: 24,
      loyaltyDiscountAmount: 2.4,
      loyaltyLevelName: 'Искра',
      loyaltyDiscount: {
        levelId: 'lvl',
        levelName: 'Искра',
        rewardType: 'percent_discount',
        percentOff: 10,
        amountOff: null,
        amount: 2.4,
      },
      giftRewards: [{ name: 'Кофе в подарок' }],
    } as unknown as OrderDto;
    assert.deepEqual(readOrderPriceBreakdown(order), {
      subtotal: 24,
      discountAmount: 2.4,
      discountLabel: 'Скидка уровня «Искра» −10%',
      gifts: [{ name: 'Кофе в подарок' }],
    });
  });
});
