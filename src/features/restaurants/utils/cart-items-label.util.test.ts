import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { formatCartItemsCount, sumCartQuantity } from './cart-items-label.util.ts';

describe('sumCartQuantity', () => {
  it('sums quantities across lines instead of counting lines', () => {
    assert.equal(sumCartQuantity([]), 0);
    assert.equal(sumCartQuantity([{ quantity: 3 }]), 3);
    assert.equal(sumCartQuantity([{ quantity: 1 }, { quantity: 2 }]), 3);
    assert.equal(sumCartQuantity([{ quantity: 4 }, { quantity: 0 }, { quantity: 7 }]), 11);
  });
});

describe('formatCartItemsCount', () => {
  it('uses Russian plurals, including the 11–14 exception', () => {
    assert.equal(formatCartItemsCount(1), '1 товар');
    assert.equal(formatCartItemsCount(21), '21 товар');
    assert.equal(formatCartItemsCount(101), '101 товар');

    for (const count of [2, 3, 4, 22, 23, 24, 102]) {
      assert.equal(formatCartItemsCount(count), `${count} товара`);
    }

    for (const count of [0, 5, 6, 11, 12, 13, 14, 15, 111, 112, 113, 114]) {
      assert.equal(formatCartItemsCount(count), `${count} товаров`);
    }
  });

  it('labels the summed quantity', () => {
    const lines = [{ quantity: 3 }];
    assert.equal(formatCartItemsCount(sumCartQuantity(lines)), '3 товара');
  });
});
