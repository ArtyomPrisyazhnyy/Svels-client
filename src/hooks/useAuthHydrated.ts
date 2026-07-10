'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';

export function useAuthHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

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

    return persist.onFinishHydration(() => {
      setHydrated(true);
    });
  }, []);

  return hydrated;
}
