import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getOrderLineOptionLabels } from './order-line-item.util.ts';

describe('getOrderLineOptionLabels', () => {
  it('returns option names for each modifier group', () => {
    assert.deepEqual(
      getOrderLineOptionLabels([
        { groupName: 'Молоко', optionName: 'Овсяное молоко', priceDelta: 2.5 },
        { groupName: 'Размер', optionName: '400 мл', priceDelta: 0 },
      ]),
      ['Овсяное молоко', '400 мл'],
    );
  });
});
