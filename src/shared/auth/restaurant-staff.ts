import type { UserRole } from '../types/auth';

/**
 * Дублирует карту прав бэкенда (`Svels-backend/src/common/auth/restaurant-role-permissions.ts`).
 * При изменении ролей обновлять оба файла.
 */
export const RESTAURANT_STAFF_ROLES = [
  'restaurant_admin',
  'restaurant_manager',
  'restaurant_hall',
  'restaurant_production',
] as const;

export type RestaurantStaffRole = (typeof RESTAURANT_STAFF_ROLES)[number];

export type RestaurantPermission =
  | 'manage_branding'
  | 'manage_payments'
  | 'manage_restaurant'
  | 'manage_staff'
  | 'manage_menu'
  | 'manage_marketing'
  | 'manage_floor'
  | 'manage_schedule'
  | 'manage_order_settings'
  | 'manage_booking_settings'
  | 'view_bookings'
  | 'view_orders';

const ALL_PERMISSIONS: RestaurantPermission[] = [
  'manage_branding',
  'manage_payments',
  'manage_restaurant',
  'manage_staff',
  'manage_menu',
  'manage_marketing',
  'manage_floor',
  'manage_schedule',
  'manage_order_settings',
  'manage_booking_settings',
  'view_bookings',
  'view_orders',
];

const OWNER_ONLY: ReadonlySet<RestaurantPermission> = new Set([
  'manage_branding',
  'manage_payments',
  'manage_restaurant',
  'manage_staff',
]);

const ROLE_PERMISSIONS: Record<RestaurantStaffRole, readonly RestaurantPermission[]> = {
  restaurant_admin: ALL_PERMISSIONS,
  restaurant_manager: ALL_PERMISSIONS.filter((permission) => !OWNER_ONLY.has(permission)),
  restaurant_hall: ['view_bookings', 'view_orders'],
  restaurant_production: ['view_orders'],
};

export const RESTAURANT_STAFF_LABELS: Record<RestaurantStaffRole, string> = {
  restaurant_admin: 'Владелец',
  restaurant_manager: 'Управляющий',
  restaurant_hall: 'Зал',
  restaurant_production: 'Производство',
};

export const RESTAURANT_ADMIN_NAV: Array<{
  to: string;
  label: string;
  permission: RestaurantPermission | null;
}> = [
  { to: '/restaurant-admin/preview', label: 'Страница заведения', permission: 'manage_menu' },
  { to: '/restaurant-admin/branding', label: 'Брендинг', permission: 'manage_branding' },
  { to: '/restaurant-admin/banners', label: 'Баннеры', permission: 'manage_marketing' },
  { to: '/restaurant-admin/styling', label: 'Стилизация', permission: 'manage_branding' },
  { to: '/restaurant-admin/menu', label: 'Меню', permission: 'manage_menu' },
  { to: '/restaurant-admin/locations', label: 'Точки и адреса', permission: 'manage_restaurant' },
  { to: '/restaurant-admin/order-settings', label: 'Условия заказа', permission: 'manage_order_settings' },
  { to: '/restaurant-admin/payment-settings', label: 'Оплата / bePaid', permission: 'manage_payments' },
  { to: '/restaurant-admin/booking-settings', label: 'Бронирование', permission: 'manage_booking_settings' },
  { to: '/restaurant-admin/loyalty', label: 'Программа лояльности', permission: 'manage_marketing' },
  { to: '/restaurant-admin/floor-plan', label: 'Планировка', permission: 'manage_floor' },
  { to: '/restaurant-admin/bookings', label: 'Брони', permission: 'view_bookings' },
  { to: '/restaurant-admin/orders', label: 'Заказы', permission: 'view_orders' },
  { to: '/restaurant-admin/social-links', label: 'Соцсети', permission: 'manage_marketing' },
  { to: '/restaurant-admin/account', label: 'Аккаунт', permission: null },
];

export function isRestaurantStaffRole(role: string): role is RestaurantStaffRole {
  return (RESTAURANT_STAFF_ROLES as readonly string[]).includes(role);
}

export function staffHasPermission(
  role: string | undefined,
  permission: RestaurantPermission,
): boolean {
  if (!role || !isRestaurantStaffRole(role)) {
    return false;
  }

  return ROLE_PERMISSIONS[role].includes(permission);
}

export function getRestaurantAdminHomePath(role: UserRole | undefined): string {
  switch (role) {
    case 'restaurant_hall':
      return '/restaurant-admin/bookings';
    case 'restaurant_production':
      return '/restaurant-admin/orders';
    default:
      return '/restaurant-admin/menu';
  }
}

export function navPermissionForPath(pathname: string): RestaurantPermission | null | undefined {
  const match = [...RESTAURANT_ADMIN_NAV]
    .filter((item) => pathname === item.to || pathname.startsWith(`${item.to}/`))
    .sort((a, b) => b.to.length - a.to.length)[0];

  return match?.permission;
}

export function canAccessRestaurantAdminPath(
  role: string | undefined,
  pathname: string,
): boolean {
  if (!isRestaurantStaffRole(role ?? '')) {
    return false;
  }

  const permission = navPermissionForPath(pathname);
  if (permission === undefined || permission === null) {
    return true;
  }

  return staffHasPermission(role, permission);
}
