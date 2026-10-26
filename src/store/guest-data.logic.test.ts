import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  GUEST_DATA_PERSIST_VERSION,
  GUEST_DATA_STALE_MS,
  decodeGuestDataStorage,
  emptyGuestDataPersisted,
  filterByRestaurantId,
  guestDataCacheKey,
  isGuestDataFresh,
  migrateGuestDataPersisted,
  nextGuestDataAfterUserChange,
  type GuestDataPersistedV1,
} from './guest-data.logic.ts';

function persisted(
  userId: string,
  ordersRestaurantId: string,
  bookingsRestaurantId: string,
): GuestDataPersistedV1 {
  return {
    ownerUserId: userId,
    ordersByKey: {
      [guestDataCacheKey(userId, ordersRestaurantId)]: {
        data: [{ id: 'order-1', restaurantId: ordersRestaurantId }],
        fetchedAt: 1_000,
      },
    },
    bookingsByKey: {
      [guestDataCacheKey(userId, bookingsRestaurantId)]: {
        data: [{ id: 'booking-1', restaurantId: bookingsRestaurantId }],
        fetchedAt: 1_000,
      },
    },
  };
}

describe('guest data cache keys', () => {
  it('separates users and restaurants', () => {
    assert.equal(guestDataCacheKey('user-a', 'rest-1'), 'user-a::rest-1');
    assert.notEqual(
      guestDataCacheKey('user-a', 'rest-1'),
      guestDataCacheKey('user-a', 'rest-2'),
    );
    assert.notEqual(
      guestDataCacheKey('user-a', 'rest-1'),
      guestDataCacheKey('user-b', 'rest-1'),
    );
  });
});

describe('guest data freshness', () => {
  const now = 10_000;

  it('treats entries younger than 60s as fresh', () => {
    assert.equal(isGuestDataFresh({ fetchedAt: now - GUEST_DATA_STALE_MS + 1 }, now), true);
    assert.equal(isGuestDataFresh({ fetchedAt: now }, now), true);
  });

  it('treats missing and 60s-old entries as stale', () => {
    assert.equal(isGuestDataFresh(undefined, now), false);
    assert.equal(isGuestDataFresh(null, now), false);
    assert.equal(isGuestDataFresh({ fetchedAt: now - GUEST_DATA_STALE_MS }, now), false);
    assert.equal(isGuestDataFresh({ fetchedAt: now - GUEST_DATA_STALE_MS - 1 }, now), false);
  });
});

describe('restaurant filter fallback', () => {
  it('keeps rows for the venue and drops other venues', () => {
    const rows = [
      { id: '1', restaurantId: 'rest-1' },
      { id: '2', restaurantId: 'rest-2' },
      { id: '3' },
    ];
    assert.deepEqual(filterByRestaurantId(rows, 'rest-1'), [
      { id: '1', restaurantId: 'rest-1' },
      { id: '3' },
    ]);
  });
});

describe('guest data persistence', () => {
  it('round-trips a versioned envelope and drops corrupt entries', () => {
    const state = persisted('user-a', 'rest-1', 'rest-1');
    const raw = JSON.stringify({ state, version: GUEST_DATA_PERSIST_VERSION });
    const decoded = decodeGuestDataStorage(raw);

    assert.equal(decoded.ownerUserId, 'user-a');
    assert.deepEqual(decoded.ordersByKey['user-a::rest-1']?.data, state.ordersByKey['user-a::rest-1']?.data);
    assert.equal(decoded.bookingsByKey['user-a::rest-1']?.fetchedAt, 1_000);

    const dirty = decodeGuestDataStorage(
      JSON.stringify({
        state: {
          ownerUserId: 'user-a',
          ordersByKey: {
            good: { data: [{ id: 'ok' }], fetchedAt: 5 },
            bad: { data: 'nope', fetchedAt: 5 },
            incomplete: { data: [] },
          },
          bookingsByKey: null,
        },
        version: 1,
      }),
    );
    assert.deepEqual(Object.keys(dirty.ordersByKey), ['good']);
    assert.deepEqual(dirty.bookingsByKey, {});
  });

  it('ignores a newer storage version and unreadable payloads', () => {
    const newer = migrateGuestDataPersisted(
      { ownerUserId: 'user-a', ordersByKey: {}, bookingsByKey: {} },
      GUEST_DATA_PERSIST_VERSION + 1,
    );
    assert.deepEqual(newer, emptyGuestDataPersisted());
    assert.deepEqual(decodeGuestDataStorage('not-json'), emptyGuestDataPersisted());
    assert.deepEqual(decodeGuestDataStorage(null), emptyGuestDataPersisted());
  });

  it('reads an unversioned state object', () => {
    const decoded = decodeGuestDataStorage(
      JSON.stringify({
        ownerUserId: 'user-a',
        ordersByKey: { 'user-a::rest-1': { data: [], fetchedAt: 2 } },
        bookingsByKey: {},
      }),
    );
    assert.equal(decoded.ownerUserId, 'user-a');
    assert.equal(decoded.ordersByKey['user-a::rest-1']?.fetchedAt, 2);
  });
});

describe('guest data user switch', () => {
  const state = persisted('user-a', 'rest-1', 'rest-2');

  it('keeps the cache when the same user hydrates', () => {
    assert.equal(nextGuestDataAfterUserChange(state, 'user-a'), state);
  });

  it('adopts an owner without dropping an empty cache', () => {
    const empty = emptyGuestDataPersisted();
    const next = nextGuestDataAfterUserChange(empty, 'user-a');
    assert.equal(next.ownerUserId, 'user-a');
    assert.deepEqual(next.ordersByKey, {});
    assert.deepEqual(next.bookingsByKey, {});
  });

  it('clears orders and bookings when the user changes', () => {
    const next = nextGuestDataAfterUserChange(state, 'user-b');
    assert.equal(next.ownerUserId, 'user-b');
    assert.deepEqual(next.ordersByKey, {});
    assert.deepEqual(next.bookingsByKey, {});
    assert.notEqual(next.ordersByKey, state.ordersByKey);
  });

  it('clears the cache on logout', () => {
    const next = nextGuestDataAfterUserChange(state, null);
    assert.equal(next.ownerUserId, null);
    assert.deepEqual(next.ordersByKey, {});
    assert.deepEqual(next.bookingsByKey, {});
  });
});
