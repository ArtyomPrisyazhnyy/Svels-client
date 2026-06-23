import { lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleProtectedRoute } from './components/RoleProtectedRoute';
import { GuestAuthPage } from './features/auth/pages/GuestAuthPage';
import { RestaurantAuthPage } from './features/auth/pages/RestaurantAuthPage';
import { useAuthProfileSync } from './hooks/useAuthProfileSync';
import { AccountPage } from './pages/AccountPage';
import { BookingPage } from './pages/BookingPage';
import { LandingPage } from './pages/LandingPage';
import { PreOrderPage } from './pages/PreOrderPage';
import { getPostAuthPath } from './shared/routing/get-post-auth-path';
import { useAuthStore } from './store/auth.store';

const SuperAdminPage = lazy(() => import('./features/admin/pages/SuperAdminPage'));
const RestaurantAdminLayout = lazy(
  () => import('./features/restaurant-admin/pages/RestaurantAdminLayout'),
);
const MenuAdminPage = lazy(() => import('./features/restaurant-admin/pages/MenuAdminPage'));

function PageLoader() {
  return (
    <div style={{ minHeight: '40vh', display: 'grid', placeItems: 'center', color: '#64748b' }}>
      Загрузка…
    </div>
  );
}

function GuestAuthRoute() {
  const user = useAuthStore((s) => s.user);
  if (user) {
    return <Navigate to={getPostAuthPath(user.role)} replace />;
  }
  return <GuestAuthPage />;
}

function RestaurantAuthRoute() {
  const user = useAuthStore((s) => s.user);
  if (user) {
    return <Navigate to={getPostAuthPath(user.role)} replace />;
  }
  return <RestaurantAuthPage />;
}

function AuthProfileSync({ children }: { children: ReactNode }) {
  useAuthProfileSync();
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProfileSync>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/guest" element={<GuestAuthRoute />} />
        <Route path="/auth/restaurant" element={<RestaurantAuthRoute />} />
        <Route path="/auth" element={<Navigate to="/auth/guest" replace />} />
        <Route path="/account" element={<AccountPage />} />
        <Route
          path="/admin"
          element={
            <RoleProtectedRoute roles={['super_admin']}>
              <Suspense fallback={<PageLoader />}>
                <SuperAdminPage />
              </Suspense>
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/restaurant-admin"
          element={
            <RoleProtectedRoute roles={['restaurant_admin']}>
              <Suspense fallback={<PageLoader />}>
                <RestaurantAdminLayout />
              </Suspense>
            </RoleProtectedRoute>
          }
        >
          <Route index element={<Navigate to="menu" replace />} />
          <Route
            path="menu"
            element={
              <Suspense fallback={<PageLoader />}>
                <MenuAdminPage />
              </Suspense>
            }
          />
        </Route>
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pre-order"
          element={
            <ProtectedRoute>
              <PreOrderPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </AuthProfileSync>
    </BrowserRouter>
  );
}
