'use client';

import { Suspense, useEffect } from 'react';
import { useAuthProfileSync } from '@/hooks/useAuthProfileSync';
import { ScrollToTopButton } from '@/shared/components/ScrollToTopButton';
import { useAuthStore } from '@/store/auth.store';

function AuthProfileSync({ children }: { children: React.ReactNode }) {
  useAuthProfileSync();
  return children;
}

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void useAuthStore.persist.rehydrate();
    void import('@/store/cart.store').then(({ useCartStore }) => {
      void useCartStore.persist.rehydrate();
    });
    void import('@/store/favorites.store').then(({ useFavoritesStore }) => {
      void useFavoritesStore.persist.rehydrate();
    });
    void import('@/features/restaurants/session/clear-local-commerce-session').then(
      ({ subscribeAuthLogoutCleanup }) => {
        subscribeAuthLogoutCleanup();
      },
    );
  }, []);

  return (
    <AuthProfileSync>
      {children}
      <Suspense fallback={null}>
        <ScrollToTopButton />
      </Suspense>
    </AuthProfileSync>
  );
}
