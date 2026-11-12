import type { ReactNode } from 'react';
import {
  resolvePromoBannerAspectRatio,
  type PromoBanner,
} from '@/shared/types/promo-banner';
import { resolveImageUrl } from '@/shared/types/menu';
import { PromoBannerAspectMedia } from './PromoBannerAspectMedia';
import '@/features/restaurants/styles/promo-banner-modal.scss';

export function activeStripBanners(banners: PromoBanner[]): PromoBanner[] {
  return banners.filter((banner) => banner.type === 'strip' && banner.isActive);
}

/** URL the browser will actually fetch for the strip (webp when present). */
export function promoBannerPreloadHref(banner: PromoBanner): string {
  const webp = banner.imageWebpUrl ? resolveImageUrl(banner.imageWebpUrl) : null;
  const fallback = resolveImageUrl(banner.imageUrl);
  if (webp && webp !== fallback) {
    return webp;
  }
  return fallback;
}

export function PromoBannerStripSection({ children }: { children: ReactNode }) {
  return (
    <section className="promo-banner-strip" aria-label="Акции" data-testid="promo-banner-strip">
      {children}
    </section>
  );
}

export function PromoBannerStripSlide({
  banner,
  priority = false,
}: {
  banner: PromoBanner;
  priority?: boolean;
}) {
  const ratio = resolvePromoBannerAspectRatio(banner);

  return (
    <div className="promo-banner-strip__slide">
      <PromoBannerAspectMedia
        banner={banner}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'low'}
        frameClassName="promo-banner-strip__frame"
        frameTestId={`promo-banner-strip-frame-${ratio}`}
        imageClassName="promo-banner-strip__image"
        linkClassName="promo-banner-strip__link"
      />
    </div>
  );
}
