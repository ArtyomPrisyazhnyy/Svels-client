'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';

export function useAuthHydrated(): boolean {
  const [hydrated, setHydrated] = useState<boolean>(false);

  useEffect(() => {
    const { persist } = useAuthStore;

    if (!persist?.hasHydrated) {
      setHydrated(true);
      return;
    }

    if (persist.hasHydrated()) {
      setHydrated(true);
      return;
    }

    const unsubscribe = persist.onFinishHydration(() => {
      setHydrated(true);
    });
    void persist.rehydrate();
    return unsubscribe;
  }, []);

  return hydrated;
}
