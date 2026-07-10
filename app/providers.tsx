'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect } from 'react';
import { useAuthProfileSync } from '@/hooks/useAuthProfileSync';
import { GOOGLE_CLIENT_ID } from '@/shared/config/env';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';

function AuthProfileSync({ children }: { children: React.ReactNode }) {
  useAuthProfileSync();
  return children;
}

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void useAuthStore.persist.rehydrate();
    void useCartStore.persist.rehydrate();
  }, []);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProfileSync>{children}</AuthProfileSync>
    </GoogleOAuthProvider>
  );
}
