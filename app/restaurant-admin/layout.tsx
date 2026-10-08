import type { Metadata } from 'next';
import { Suspense } from 'react';
import { RoleProtectedRoute } from '@/components/RoleProtectedRoute';
import RestaurantAdminLayout from '@/features/restaurant-admin/pages/RestaurantAdminLayout';
import { RESTAURANT_STAFF_ROLES } from '@/shared/auth/restaurant-staff';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

function PageLoader() {
  return (
    <div style={{ minHeight: '40vh', display: 'grid', placeItems: 'center', color: '#64748b' }}>
      Загрузка…
    </div>
  );
}

export default function RestaurantAdminLayoutRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleProtectedRoute roles={[...RESTAURANT_STAFF_ROLES]}>
      <Suspense fallback={<PageLoader />}>
        <RestaurantAdminLayout>{children}</RestaurantAdminLayout>
      </Suspense>
    </RoleProtectedRoute>
  );
}
