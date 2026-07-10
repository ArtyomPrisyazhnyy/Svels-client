'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cart.store';

export function useCartHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const { persist } = useCartStore;

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
