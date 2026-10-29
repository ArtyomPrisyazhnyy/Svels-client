'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/shared/api/api-client';
import type { LoyaltyBalance } from '@/shared/types/loyalty-balance';
import { fetchGuestLoyaltyBalance } from '../api/loyalty-balance.api';

interface UseGuestLoyaltyBalanceOptions {
  enabled: boolean;
}

export function useGuestLoyaltyBalance(
  restaurantId: string,
  { enabled }: UseGuestLoyaltyBalanceOptions,
) {
  const [storedBalance, setStoredBalance] = useState<LoyaltyBalance | null>(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const refresh = useCallback(() => {
    setReloadToken((value) => value + 1);
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;

    void (async () => {
      setFetching(true);
      setError(null);
      try {
        const next = await fetchGuestLoyaltyBalance(restaurantId);
        if (!cancelled) {
          setStoredBalance(next);
        }
      } catch (err) {
        if (!cancelled) {
          setStoredBalance(null);
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
  }, [enabled, restaurantId, reloadToken]);

  const balance = enabled ? storedBalance : null;
  const loading = enabled && fetching && balance === null && error === null;

  return { balance, loading, error: enabled ? error : null, refresh };
}
