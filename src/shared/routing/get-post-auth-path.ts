import type { UserRole } from '../types/auth';
import { getRestaurantAdminHomePath, isRestaurantStaffRole } from '../auth/restaurant-staff';
import { buildRestaurantGuestPath } from './restaurant-guest-path';

export function getPostAuthPath(
  role: UserRole,
  redirectFrom?: string,
  restaurantId?: string,
  tenantMode = false,
): string {
  switch (role) {
    case 'super_admin':
      return '/admin';
    default:
      if (isRestaurantStaffRole(role)) {
        return getRestaurantAdminHomePath(role);
      }
      if (redirectFrom) {
        return redirectFrom;
      }
      if (restaurantId) {
        return buildRestaurantGuestPath(restaurantId, 'home', { tenantMode });
      }
      return '/';
  }
}

export function restaurantAuthPath(
  restaurantId: string,
  from?: string,
  tenantMode = false,
): string {
  return buildRestaurantGuestPath(restaurantId, 'auth', { tenantMode, from });
}
