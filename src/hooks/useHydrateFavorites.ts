'use client';

import { useEffect, useState } from 'react';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import { useAuthStore } from '@/store/auth.store';
import { useFavoritesStore } from '@/store/favorites.store';

function useFavoritesPersistReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { persist } = useFavoritesStore;
    if (!persist?.hasHydrated) {
      setReady(true);
      return;
    }
    if (persist.hasHydrated()) {
      setReady(true);
      return;
    }
    const unsubscribe = persist.onFinishHydration(() => setReady(true));
    void persist.rehydrate();
    return unsubscribe;
  }, []);

  return ready;
}

/** Ждём auth и persist избранного, затем синхронизируем с API. */
export function useHydrateFavorites(restaurantId: string, enabled: boolean): void {
  const authHydrated = useAuthHydrated();
  const persistReady = useFavoritesPersistReady();
  const accessToken = useAuthStore((s) => s.accessToken);
  const hydrate = useFavoritesStore((s) => s.hydrate);

  useEffect(() => {
    if (!enabled || !authHydrated || !persistReady) {
      return;
    }
    void hydrate(restaurantId);
  }, [accessToken, authHydrated, enabled, hydrate, persistReady, restaurantId]);
}
