'use client';

import { Carousel } from '@/shared/components/Carousel';
import type { PromoBanner } from '@/shared/types/promo-banner';
import { PromoBannerStripSection, PromoBannerStripSlide } from './PromoBannerStripMarkup';

export function PromoBannerStripCarousel({ banners }: { banners: PromoBanner[] }) {
  const slides = banners.map((banner, index) => (
    <PromoBannerStripSlide key={banner.id} banner={banner} priority={index === 0} />
  ));

  return (
    <PromoBannerStripSection>
      <Carousel
        className="promo-banner-strip__carousel"
        slides={slides}
        autoplay
        autoplayDelay={5000}
        showArrows={false}
        showDots
      />
    </PromoBannerStripSection>
  );
}
