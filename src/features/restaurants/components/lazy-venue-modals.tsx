'use client';

import dynamic from 'next/dynamic';

export const RestaurantCartModal = dynamic(
  () => import('./RestaurantCartModal').then((module) => ({ default: module.RestaurantCartModal })),
  { ssr: false, loading: () => null },
);

export const RestaurantGuestAuthModal = dynamic(
  () =>
    import('./RestaurantGuestAuthModal').then((module) => ({
      default: module.RestaurantGuestAuthModal,
    })),
  { ssr: false, loading: () => null },
);

export function preloadRestaurantCartModal(): void {
  void import('./RestaurantCartModal');
}
