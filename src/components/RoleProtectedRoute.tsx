import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { UserRole } from '../shared/types/auth';
import { getPostAuthPath } from '../shared/routing/get-post-auth-path';
import { useAuthStore } from '../store/auth.store';

interface RoleProtectedRouteProps {
  roles: UserRole[];
  children: ReactNode;
}

export function RoleProtectedRoute({ roles, children }: RoleProtectedRouteProps) {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth/guest" replace state={{ from: location.pathname }} />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to={getPostAuthPath(user.role)} replace />;
  }

  return children;
}
