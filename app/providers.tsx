'use client';

import { Suspense, useEffect } from 'react';
import { useAuthProfileSync } from '@/hooks/useAuthProfileSync';
import { ScrollToTopButton } from '@/shared/components/ScrollToTopButton';
import { subscribeAuthLogoutCleanup } from '@/features/restaurants/session/clear-local-commerce-session';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { useFavoritesStore } from '@/store/favorites.store';

subscribeAuthLogoutCleanup();

function AuthProfileSync({ children }: { children: React.ReactNode }) {
  useAuthProfileSync();
  return children;
}

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void useAuthStore.persist.rehydrate();
    void useCartStore.persist.rehydrate();
    void useFavoritesStore.persist.rehydrate();
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
