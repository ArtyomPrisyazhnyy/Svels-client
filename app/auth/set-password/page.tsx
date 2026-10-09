import { Suspense } from 'react';
import { SetPasswordPage } from '@/features/auth/pages/SetPasswordPage';

function PageLoader() {
  return (
    <div style={{ minHeight: '40vh', display: 'grid', placeItems: 'center', color: '#64748b' }}>
      Загрузка…
    </div>
  );
}

export default function SetPasswordRoute() {
  return (
    <Suspense fallback={<PageLoader />}>
      <SetPasswordPage />
    </Suspense>
  );
}
