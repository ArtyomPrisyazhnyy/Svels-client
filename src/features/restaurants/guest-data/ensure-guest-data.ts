import { ApiError } from '@/shared/api/api-client';
import type { Booking } from '@/shared/types/booking';
import type { OrderDto } from '@/shared/types/pre-order';
import { useAuthStore } from '@/store/auth.store';
import {
  guestDataCacheKey,
  isGuestDataFresh,
  filterByRestaurantId,
} from '@/store/guest-data.logic';
import {
  registerGuestDataRequestAbort,
  useGuestDataStore,
} from '@/store/guest-data.store';
import { fetchMyBookings } from '../api/bookings.api';
import { fetchMyOrders } from '../api/pre-orders.api';
import { isAbortError, requestWithTimeoutRetry } from './request-with-retry';

export interface EnsureGuestDataArgs {
  userId: string;
  restaurantId: string;
  token: string;
  /** Bypass the 60s fresh window (poll, retry). */
  force?: boolean;
  /** Background poll: keep the current screen if the request fails. */
  silent?: boolean;
}

const orderGenerations = new Map<string, number>();
const bookingGenerations = new Map<string, number>();
const orderControllers = new Map<string, AbortController>();
const bookingControllers = new Map<string, AbortController>();
const orderInflight = new Map<string, Promise<void>>();
const bookingInflight = new Map<string, Promise<void>>();

registerGuestDataRequestAbort(() => {
  for (const controller of orderControllers.values()) {
    controller.abort();
  }
  for (const controller of bookingControllers.values()) {
    controller.abort();
  }
  orderControllers.clear();
  bookingControllers.clear();
  orderGenerations.clear();
  bookingGenerations.clear();
});

function guestDataErrorMessage(error: unknown, fallback: string): string {
  if (isAbortError(error)) {
    return 'Превышено время ожидания. Повторите попытку.';
  }
  if (error instanceof ApiError && error.message) {
    return error.message;
  }
  return fallback;
}

async function loadOrders(
  token: string,
  restaurantId: string,
  signal: AbortSignal,
): Promise<OrderDto[]> {
  const run = (restaurantQuery: string | undefined) =>
    requestWithTimeoutRetry({
      signal,
      run: (attemptSignal) =>
        fetchMyOrders(token, {
          restaurantId: restaurantQuery,
          signal: attemptSignal,
        }),
    });

  try {
    const rows = await run(restaurantId);
    return filterByRestaurantId(rows, restaurantId);
  } catch (error) {
    // Old backends reject the unknown query. Client-side filtering still scopes the list.
    if (!(error instanceof ApiError) || error.status !== 400) {
      throw error;
    }
    const rows = await run(undefined);
    return filterByRestaurantId(rows, restaurantId);
  }
}

async function loadBookings(
  token: string,
  restaurantId: string,
  signal: AbortSignal,
): Promise<Booking[]> {
  const rows = await requestWithTimeoutRetry({
    signal,
    run: (attemptSignal) => fetchMyBookings(token, { signal: attemptSignal }),
  });
  return filterByRestaurantId(rows, restaurantId);
}

function beginRequest(
  key: string,
  generations: Map<string, number>,
  controllers: Map<string, AbortController>,
): { generation: number; controller: AbortController } {
  const generation = (generations.get(key) ?? 0) + 1;
  generations.set(key, generation);
  controllers.get(key)?.abort();
  const controller = new AbortController();
  controllers.set(key, controller);
  return { generation, controller };
}

export function ensureGuestOrders(args: EnsureGuestDataArgs): Promise<void> {
  const key = guestDataCacheKey(args.userId, args.restaurantId);
  if (!args.force) {
    const existing = orderInflight.get(key);
    if (existing) {
      return existing;
    }
    const cached = useGuestDataStore.getState().ordersByKey[key];
    if (isGuestDataFresh(cached)) {
      return Promise.resolve();
    }
  }

  const promise = runOrders(args, key).finally(() => {
    if (orderInflight.get(key) === promise) {
      orderInflight.delete(key);
    }
  });
  orderInflight.set(key, promise);
  return promise;
}

async function runOrders(args: EnsureGuestDataArgs, key: string): Promise<void> {
  const { generation, controller } = beginRequest(key, orderGenerations, orderControllers);
  const hadCache = Boolean(useGuestDataStore.getState().ordersByKey[key]);
  useGuestDataStore.setState((state) => ({
    refreshingOrders: {
      ...state.refreshingOrders,
      [key]: hadCache && !args.silent,
    },
  }));

  try {
    const orders = await loadOrders(args.token, args.restaurantId, controller.signal);
    if (orderGenerations.get(key) !== generation) {
      return;
    }
    if (useAuthStore.getState().user?.id !== args.userId) {
      return;
    }
    useGuestDataStore.getState().setOrders(args.userId, args.restaurantId, orders);
  } catch (error) {
    if (orderGenerations.get(key) !== generation) {
      return;
    }
    if (useAuthStore.getState().user?.id !== args.userId) {
      return;
    }
    if (args.silent && hadCache) {
      return;
    }
    const message = guestDataErrorMessage(error, 'Не удалось загрузить заказы');
    useGuestDataStore.setState((state) => ({
      ordersError: { ...state.ordersError, [key]: message },
    }));
  } finally {
    if (orderControllers.get(key) === controller) {
      orderControllers.delete(key);
    }
    if (orderGenerations.get(key) === generation) {
      useGuestDataStore.setState((state) => ({
        refreshingOrders: { ...state.refreshingOrders, [key]: false },
      }));
    }
  }
}

export function ensureGuestBookings(args: EnsureGuestDataArgs): Promise<void> {
  const key = guestDataCacheKey(args.userId, args.restaurantId);
  if (!args.force) {
    const existing = bookingInflight.get(key);
    if (existing) {
      return existing;
    }
    const cached = useGuestDataStore.getState().bookingsByKey[key];
    if (isGuestDataFresh(cached)) {
      return Promise.resolve();
    }
  }

  const promise = runBookings(args, key).finally(() => {
    if (bookingInflight.get(key) === promise) {
      bookingInflight.delete(key);
    }
  });
  bookingInflight.set(key, promise);
  return promise;
}

async function runBookings(args: EnsureGuestDataArgs, key: string): Promise<void> {
  const { generation, controller } = beginRequest(key, bookingGenerations, bookingControllers);
  const hadCache = Boolean(useGuestDataStore.getState().bookingsByKey[key]);
  useGuestDataStore.setState((state) => ({
    refreshingBookings: {
      ...state.refreshingBookings,
      [key]: hadCache && !args.silent,
    },
  }));

  try {
    const bookings = await loadBookings(args.token, args.restaurantId, controller.signal);
    if (bookingGenerations.get(key) !== generation) {
      return;
    }
    if (useAuthStore.getState().user?.id !== args.userId) {
      return;
    }
    useGuestDataStore.getState().setBookings(args.userId, args.restaurantId, bookings);
  } catch (error) {
    if (bookingGenerations.get(key) !== generation) {
      return;
    }
    if (useAuthStore.getState().user?.id !== args.userId) {
      return;
    }
    if (args.silent && hadCache) {
      return;
    }
    const message = guestDataErrorMessage(error, 'Не удалось загрузить брони');
    useGuestDataStore.setState((state) => ({
      bookingsError: { ...state.bookingsError, [key]: message },
    }));
  } finally {
    if (bookingControllers.get(key) === controller) {
      bookingControllers.delete(key);
    }
    if (bookingGenerations.get(key) === generation) {
      useGuestDataStore.setState((state) => ({
        refreshingBookings: { ...state.refreshingBookings, [key]: false },
      }));
    }
  }
}

export type GuestDataPrefetchTarget = 'orders' | 'bookings' | 'both';

export function prefetchGuestData(
  restaurantId: string,
  target: GuestDataPrefetchTarget = 'both',
): void {
  const { accessToken, user } = useAuthStore.getState();
  if (!accessToken || !user || user.role !== 'user' || user.restaurantId !== restaurantId) {
    return;
  }
  const args = { userId: user.id, restaurantId, token: accessToken };
  if (target !== 'bookings') {
    void ensureGuestOrders(args);
  }
  if (target !== 'orders') {
    void ensureGuestBookings(args);
  }
}

export function guestDataPrefetchHandlers(
  restaurantId: string,
  target: GuestDataPrefetchTarget = 'both',
): { onMouseEnter: () => void; onTouchStart: () => void } {
  const run = () => prefetchGuestData(restaurantId, target);
  return { onMouseEnter: run, onTouchStart: run };
}
