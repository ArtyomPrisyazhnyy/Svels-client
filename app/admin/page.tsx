import { Suspense } from 'react';
import { RoleProtectedRoute } from '@/components/RoleProtectedRoute';
import SuperAdminPage from '@/features/admin/pages/SuperAdminPage';
import '@/features/admin/styles/admin.scss';

function PageLoader() {
  return (
    <div style={{ minHeight: '40vh', display: 'grid', placeItems: 'center', color: '#64748b' }}>
      Загрузка…
    </div>
  );
}

export default function AdminPageRoute() {
  return (
    <RoleProtectedRoute roles={['super_admin']}>
      <Suspense fallback={<PageLoader />}>
        <SuperAdminPage />
      </Suspense>
    </RoleProtectedRoute>
  );
}
