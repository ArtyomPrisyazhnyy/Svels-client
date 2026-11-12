'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/shared/api/api-client';
import type { LoyaltyBalance } from '@/shared/types/loyalty-balance';
import { useAuthStore } from '@/store/auth.store';
import { fetchGuestLoyaltyBalance } from '../api/loyalty-balance.api';
import { canFetchGuestLoyaltyBalance } from '../api/loyalty-balance.request';

interface UseGuestLoyaltyBalanceOptions {
  enabled: boolean;
}

export function useGuestLoyaltyBalance(
  restaurantId: string,
  { enabled }: UseGuestLoyaltyBalanceOptions,
) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [entry, setEntry] = useState<{ token: string; balance: LoyaltyBalance | null } | null>(
    null,
  );
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const canFetch = canFetchGuestLoyaltyBalance(enabled, accessToken);

  const refresh = useCallback(() => {
    setReloadToken((value) => value + 1);
  }, []);

  useEffect(() => {
    if (!canFetch || !accessToken) {
      return;
    }

    const token = accessToken;
    let cancelled = false;

    void (async () => {
      setFetching(true);
      setError(null);
      try {
        const next = await fetchGuestLoyaltyBalance(restaurantId, token);
        if (!cancelled) {
          setEntry({ token, balance: next });
        }
      } catch (err) {
        if (!cancelled) {
          setEntry({ token, balance: null });
          if (err instanceof ApiError && err.status === 401) {
            setError(null);
          } else {
            setError(err instanceof Error ? err.message : 'Не удалось загрузить статус огонька');
          }
        }
      } finally {
        if (!cancelled) {
          setFetching(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [accessToken, canFetch, restaurantId, reloadToken]);

  const balance =
    canFetch && accessToken && entry?.token === accessToken ? entry.balance : null;
  const loading = canFetch && fetching && balance === null && error === null;

  return { balance, loading, error: canFetch ? error : null, refresh };
}
