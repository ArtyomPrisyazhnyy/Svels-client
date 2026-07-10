import type { UserRole } from '../types/auth';
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
    case 'restaurant_admin':
      return '/restaurant-admin/menu';
    default:
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
