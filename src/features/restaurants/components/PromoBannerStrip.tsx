import type { PromoBanner } from '@/shared/types/promo-banner';
import {
  activeStripBanners,
  PromoBannerStripSection,
  PromoBannerStripSlide,
} from './PromoBannerStripMarkup';

/**
 * Strip rendered from the server page so the first image is in the initial HTML.
 * A single banner needs no carousel JS. Several banners hydrate the carousel.
 */
export async function PromoBannerStrip({ banners }: { banners: PromoBanner[] }) {
  const active = activeStripBanners(banners);
  if (active.length === 0) {
    return null;
  }

  if (active.length === 1) {
    return (
      <PromoBannerStripSection>
        <PromoBannerStripSlide banner={active[0]} priority />
      </PromoBannerStripSection>
    );
  }

  const { PromoBannerStripCarousel } = await import('./PromoBannerStripCarousel');
  return <PromoBannerStripCarousel banners={active} />;
}
