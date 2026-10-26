'use client';

import { useCallback, useEffect, useState } from 'react';
import type { OrderDto } from '@/shared/types/pre-order';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import { useAuthStore } from '@/store/auth.store';
import { guestDataCacheKey } from '@/store/guest-data.logic';
import { useGuestDataStore } from '@/store/guest-data.store';
import { ensureGuestOrders } from '../guest-data/ensure-guest-data';

interface UseGuestOrdersResult {
  orders: OrderDto[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  retrying: boolean;
  retry: () => void;
}

export function useGuestOrders(restaurantId: string): UseGuestOrdersResult {
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const cacheKey = userId ? guestDataCacheKey(userId, restaurantId) : null;
  const cached = useGuestDataStore((state) => (cacheKey ? state.ordersByKey[cacheKey] : undefined));
  const refreshing = useGuestDataStore((state) =>
    cacheKey ? state.refreshingOrders[cacheKey] === true : false,
  );
  const error = useGuestDataStore((state) => (cacheKey ? state.ordersError[cacheKey] ?? null : null));
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (!hydrated || !accessToken || !userId) {
      return;
    }
    void ensureGuestOrders({ userId, restaurantId, token: accessToken });
  }, [hydrated, accessToken, userId, restaurantId]);

  const retry = useCallback(() => {
    if (!accessToken || !userId) {
      return;
    }
    setRetrying(true);
    void ensureGuestOrders({
      userId,
      restaurantId,
      token: accessToken,
      force: true,
    }).finally(() => {
      setRetrying(false);
    });
  }, [accessToken, restaurantId, userId]);

  const orders = cached?.data ?? [];
  const loading = Boolean(hydrated && accessToken && userId && !cached && !error);

  return { orders, loading, error, refreshing, retrying, retry };
}
