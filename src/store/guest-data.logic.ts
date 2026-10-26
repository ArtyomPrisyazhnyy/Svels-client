export const GUEST_DATA_STORAGE_KEY = 'svels-guest-data';
export const GUEST_DATA_PERSIST_VERSION = 1;
export const GUEST_DATA_STALE_MS = 60_000;

export interface GuestDataCacheEntry<T> {
  data: T;
  fetchedAt: number;
}

export interface GuestDataPersistedV1 {
  ownerUserId: string | null;
  ordersByKey: Record<string, GuestDataCacheEntry<unknown[]>>;
  bookingsByKey: Record<string, GuestDataCacheEntry<unknown[]>>;
}

export function emptyGuestDataPersisted(): GuestDataPersistedV1 {
  return {
    ownerUserId: null,
    ordersByKey: {},
    bookingsByKey: {},
  };
}

export function guestDataCacheKey(userId: string, restaurantId: string): string {
  return `${userId}::${restaurantId}`;
}

export function isGuestDataFresh(
  entry: { fetchedAt: number } | null | undefined,
  now = Date.now(),
): boolean {
  return Boolean(entry && now - entry.fetchedAt < GUEST_DATA_STALE_MS);
}

export function filterByRestaurantId<T extends { restaurantId?: string }>(
  rows: T[],
  restaurantId: string,
): T[] {
  return rows.filter((row) => !row.restaurantId || row.restaurantId === restaurantId);
}

function sanitizeCacheMap(
  value: unknown,
): Record<string, GuestDataCacheEntry<unknown[]>> {
  if (!value || typeof value !== 'object') {
    return {};
  }

  const entries: Record<string, GuestDataCacheEntry<unknown[]>> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (!entry || typeof entry !== 'object') {
      continue;
    }
    const record = entry as { data?: unknown; fetchedAt?: unknown };
    if (!Array.isArray(record.data) || typeof record.fetchedAt !== 'number') {
      continue;
    }
    entries[key] = { data: record.data, fetchedAt: record.fetchedAt };
  }
  return entries;
}

export function migrateGuestDataPersisted(
  persisted: unknown,
  version: number,
): GuestDataPersistedV1 {
  if (version > GUEST_DATA_PERSIST_VERSION) {
    return emptyGuestDataPersisted();
  }
  if (!persisted || typeof persisted !== 'object') {
    return emptyGuestDataPersisted();
  }

  const record = persisted as Partial<GuestDataPersistedV1>;
  return {
    ownerUserId: typeof record.ownerUserId === 'string' ? record.ownerUserId : null,
    ordersByKey: sanitizeCacheMap(record.ordersByKey),
    bookingsByKey: sanitizeCacheMap(record.bookingsByKey),
  };
}

/** Zustand persist envelope `{ state, version }`, plus a bare state object. */
export function decodeGuestDataStorage(raw: string | null): GuestDataPersistedV1 {
  if (!raw) {
    return emptyGuestDataPersisted();
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') {
      return emptyGuestDataPersisted();
    }
    const record = parsed as { state?: unknown; version?: number };
    if ('state' in record) {
      return migrateGuestDataPersisted(record.state, record.version ?? 0);
    }
    return migrateGuestDataPersisted(parsed, 0);
  } catch {
    return emptyGuestDataPersisted();
  }
}

/**
 * Keep the cache only for the same user. Logout and a different user drop it.
 * Same-user hydration (null session → restored user, owner already set) is a no-op
 * when the ids match — callers compare before invoking this with a mismatched id.
 */
export function nextGuestDataAfterUserChange(
  state: GuestDataPersistedV1,
  nextUserId: string | null,
): GuestDataPersistedV1 {
  if (state.ownerUserId === nextUserId) {
    return state;
  }
  if (state.ownerUserId && state.ownerUserId !== nextUserId) {
    return {
      ownerUserId: nextUserId,
      ordersByKey: {},
      bookingsByKey: {},
    };
  }
  return {
    ...state,
    ownerUserId: nextUserId,
  };
}
