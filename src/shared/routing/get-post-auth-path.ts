import type { UserRole } from '../types/auth';

export function getPostAuthPath(role: UserRole, redirectFrom?: string): string {
  switch (role) {
    case 'super_admin':
      return '/admin';
    case 'restaurant_admin':
      return '/restaurant-admin/menu';
    default:
      return redirectFrom ?? '/account';
  }
}
