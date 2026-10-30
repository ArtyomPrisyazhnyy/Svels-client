'use client';

import { useMemo } from 'react';
import { Carousel } from '@/shared/components/Carousel';
import type { PromoBanner } from '@/shared/types/promo-banner';
import {
  activeStripBanners,
  PromoBannerStripSection,
  PromoBannerStripSlide,
} from './PromoBannerStripMarkup';
import { PromoBannerModalHost } from './PromoBannerModalHost';

interface PromoBannersHostProps {
  banners: PromoBanner[];
  /** В превью админки не пишем «уже видел» в localStorage. */
  persistSeen?: boolean;
}

function PromoBannerStrip({ banners }: { banners: PromoBanner[] }) {
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

  const slides = active.map((banner, index) => (
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

/**
 * Клиентский хост для превью, где баннеры приходят после гидрации.
 * Публичная страница рендерит плашку с сервера и подключает только модалку.
 */
export function PromoBannersHost({ banners, persistSeen = true }: PromoBannersHostProps) {
  const stripBanners = useMemo(() => activeStripBanners(banners), [banners]);

  return (
    <>
      <PromoBannerStrip banners={stripBanners} />
      <PromoBannerModalHost banners={banners} persistSeen={persistSeen} />
    </>
  );
}
