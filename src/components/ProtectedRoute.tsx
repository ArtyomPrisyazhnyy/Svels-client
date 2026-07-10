'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { ClientOnly } from '@/components/ClientOnly';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import { useAuthStore } from '@/store/auth.store';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

function AuthCheckingFallback() {
  return (
    <div
      suppressHydrationWarning
      style={{ minHeight: '40vh', display: 'grid', placeItems: 'center', color: '#64748b' }}
    >
      Проверка доступа…
    </div>
  );
}

function ProtectedRouteInner({ children, redirectTo = '/auth/restaurant' }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!hydrated || user) {
      return;
    }

    const query = searchParams.toString();
    const from = `${pathname}${query ? `?${query}` : ''}`;
    router.replace(`${redirectTo}?from=${encodeURIComponent(from)}`);
  }, [hydrated, user, router, pathname, searchParams, redirectTo]);

  if (!hydrated || !user) {
    return <AuthCheckingFallback />;
  }

  return children;
}

export function ProtectedRoute({ children, redirectTo }: ProtectedRouteProps) {
  return (
    <ClientOnly fallback={<AuthCheckingFallback />}>
      <ProtectedRouteInner redirectTo={redirectTo}>{children}</ProtectedRouteInner>
    </ClientOnly>
  );
}
