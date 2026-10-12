'use client';

import dynamic from 'next/dynamic';

export const MenuProductDetailModal = dynamic(
  () =>
    import('./MenuProductDetailModal').then((module) => ({
      default: module.MenuProductDetailModal,
    })),
  { ssr: false, loading: () => null },
);

export function preloadMenuProductDetailModal(): void {
  void import('./MenuProductDetailModal');
}
