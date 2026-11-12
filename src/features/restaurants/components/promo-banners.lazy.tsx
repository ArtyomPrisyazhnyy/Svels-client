'use client';

import dynamic from 'next/dynamic';
import type { PromoBanner } from '@/shared/types/promo-banner';

const PromoBannersHostLazy = dynamic(
  () => import('./PromoBanners').then((module) => ({ default: module.PromoBannersHost })),
  { ssr: false, loading: () => null },
);

const PromoBannerModalLazy = dynamic(
  () => import('./PromoBannerModalHost').then((module) => ({ default: module.PromoBannerModalHost })),
  { ssr: false, loading: () => null },
);

interface PromoBannersHostProps {
  banners: PromoBanner[];
  persistSeen?: boolean;
}

/** Превью админки: и плашка, и модалка только на клиенте. */
export function PromoBannersHost({ banners, persistSeen = true }: PromoBannersHostProps) {
  if (banners.length === 0) {
    return null;
  }

  return <PromoBannersHostLazy banners={banners} persistSeen={persistSeen} />;
}

/** Публичная страница: плашка уже в HTML, модалка не должна конкурировать с LCP. */
export function PromoBannerModalGate({ banners, persistSeen = true }: PromoBannersHostProps) {
  if (!banners.some((banner) => banner.type === 'modal' && banner.isActive)) {
    return null;
  }

  return <PromoBannerModalLazy banners={banners} persistSeen={persistSeen} />;
}
