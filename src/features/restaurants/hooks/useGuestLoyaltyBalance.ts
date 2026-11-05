'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/shared/api/api-client';
import type { LoyaltyBalance } from '@/shared/types/loyalty-balance';
import { fetchGuestLoyaltyBalance } from '../api/loyalty-balance.api';
import { subscribeGuestLoyaltyBalanceRefresh } from '../utils/guest-loyalty-balance-refresh';

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
    return subscribeGuestLoyaltyBalanceRefresh(refresh);
  }, [enabled, refresh]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const onFocus = () => {
      refresh();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refresh();
      }
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [enabled, refresh]);

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
