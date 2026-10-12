'use client';

import dynamic from 'next/dynamic';
import type { PromoBanner } from '@/shared/types/promo-banner';

const PromoBannersHostLazy = dynamic(
  () => import('./PromoBanners').then((module) => ({ default: module.PromoBannersHost })),
  { ssr: false, loading: () => null },
);

interface PromoBannersHostProps {
  banners: PromoBanner[];
  persistSeen?: boolean;
}

export function PromoBannersHost({ banners, persistSeen = true }: PromoBannersHostProps) {
  if (banners.length === 0) {
    return null;
  }

  return <PromoBannersHostLazy banners={banners} persistSeen={persistSeen} />;
}
