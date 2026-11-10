import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { resolveVenueHeaderActionOrder } from './venue-header-actions.order.ts';

describe('resolveVenueHeaderActionOrder', () => {
  it('places cart before profile so keyboard focus follows the icons', () => {
    assert.deepEqual(
      resolveVenueHeaderActionOrder({ flame: true, favorites: true, cart: true }),
      ['flame', 'favorites', 'cart', 'profile'],
    );
  });

  it('keeps profile last when optional actions are hidden', () => {
    assert.deepEqual(
      resolveVenueHeaderActionOrder({ flame: false, favorites: false, cart: false }),
      ['profile'],
    );
    assert.deepEqual(
      resolveVenueHeaderActionOrder({ flame: true, favorites: false, cart: true }),
      ['flame', 'cart', 'profile'],
    );
    assert.deepEqual(
      resolveVenueHeaderActionOrder({ flame: false, favorites: true, cart: false }),
      ['favorites', 'profile'],
    );
  });

  it('is the order used by both venue headers', () => {
    const headers = [
      new URL('../../../shared/ui/VenueHeader/VenueHeaderActions.tsx', import.meta.url),
      new URL('../components/RestaurantPublicHeader.tsx', import.meta.url),
    ];
    for (const file of headers) {
      const source = readFileSync(file, 'utf8');
      assert.match(source, /resolveVenueHeaderActionOrder\(/);
      assert.match(source, /actionOrder\.map\(/);
    }
  });
});
