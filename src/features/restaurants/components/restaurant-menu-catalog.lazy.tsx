'use client';

import dynamic from 'next/dynamic';

export const RestaurantMenuCatalog = dynamic(
  () =>
    import('./RestaurantMenuCatalog').then((module) => ({
      default: module.RestaurantMenuCatalog,
    })),
  { ssr: true, loading: () => null },
);
