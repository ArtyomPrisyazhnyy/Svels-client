'use client';

import { Suspense, useEffect } from 'react';
import { useAuthProfileSync } from '@/hooks/useAuthProfileSync';
import { OfflineBanner } from '@/shared/components/OfflineBanner';
import { ScrollToTopButton } from '@/shared/components/ScrollToTopButton';
import { subscribeAuthLogoutCleanup } from '@/features/restaurants/session/clear-local-commerce-session';
import { useAuthStore } from '@/store/auth.store';

subscribeAuthLogoutCleanup();

function AuthProfileSync({ children }: { children: React.ReactNode }) {
  useAuthProfileSync();
  return children;
}

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void useAuthStore.persist.rehydrate();
  }, []);

  return (
    <AuthProfileSync>
      <OfflineBanner />
      {children}
      <Suspense fallback={null}>
        <ScrollToTopButton />
      </Suspense>
    </AuthProfileSync>
  );
}
