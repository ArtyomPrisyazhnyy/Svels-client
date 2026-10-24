'use client';

import { useEffect, useState } from 'react';
import { getUserFacingErrorMessage } from '@/lib/errors/user-facing';
import type { OrderDto } from '@/shared/types/pre-order';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import { useAuthStore } from '@/store/auth.store';
import { useGuestDataStore } from '@/store/guest-data.store';
import { fetchMyOrders } from '../api/pre-orders.api';

interface UseGuestOrdersResult {
  orders: OrderDto[];
  loading: boolean;
  error: string | null;
}

export function useGuestOrders(restaurantId: string): UseGuestOrdersResult {
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((s) => s.accessToken);
  const cached = useGuestDataStore((s) => s.ordersByRestaurant[restaurantId]);
  const [error, setError] = useState<string | null>(null);

  const orders = cached?.data ?? [];
  const loading = hydrated && Boolean(accessToken) && !cached && !error;

  useEffect(() => {
    if (!hydrated || !accessToken) {
      return;
    }

    const store = useGuestDataStore.getState();
    const existing = store.ordersByRestaurant[restaurantId];
    const shouldFetch = !existing || !store.isFresh(existing);
    if (!shouldFetch) {
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const rows = await fetchMyOrders(accessToken);
        const forRestaurant = rows.filter((order) => order.restaurantId === restaurantId);
        if (!cancelled) {
          store.setOrders(restaurantId, forRestaurant);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(getUserFacingErrorMessage(err, 'Не удалось загрузить заказы'));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrated, accessToken, restaurantId]);

  return { orders, loading, error };
}
