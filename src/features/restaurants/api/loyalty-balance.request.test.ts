import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import {
  canFetchGuestLoyaltyBalance,
  guestLoyaltyMePath,
} from './loyalty-balance.request.ts';

describe('guest loyalty balance request', () => {
  it('builds the guest balance path', () => {
    assert.equal(
      guestLoyaltyMePath('rest-1'),
      '/restaurants/rest-1/loyalty/me',
    );
  });

  it('fetches only when the guest session has an access token', () => {
    assert.equal(canFetchGuestLoyaltyBalance(true, null), false);
    assert.equal(canFetchGuestLoyaltyBalance(true, undefined), false);
    assert.equal(canFetchGuestLoyaltyBalance(true, ''), false);
    assert.equal(canFetchGuestLoyaltyBalance(false, 'guest-token'), false);
    assert.equal(canFetchGuestLoyaltyBalance(true, 'guest-token'), true);
  });

  it('passes the access token into apiRequest', () => {
    const source = readFileSync(new URL('./loyalty-balance.api.ts', import.meta.url), 'utf8');
    assert.match(source, /fetchGuestLoyaltyBalance\(\s*restaurantId: string,\s*token: string,/);
    assert.match(
      source,
      /apiRequest<LoyaltyBalance>\(guestLoyaltyMePath\(restaurantId\), \{ token \}\)/,
    );
  });
});
