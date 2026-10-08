'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Carousel } from '@/shared/components/Carousel';
import { ResponsiveImage } from '@/shared/components/ResponsiveImage';
import { useModalPresence } from '@/hooks/useModalPresence';
import {
  resolvePromoBannerAspectRatio,
  type PromoBanner,
} from '@/shared/types/promo-banner';
import { RestaurantStylingPortalRoot } from '../context/RestaurantStylingContext';
import {
  hasSeenPromoBanner,
  markPromoBannerSeen,
} from '../utils/promo-banner-seen.util';
import '../styles/promo-banner-modal.scss';

const MODAL_ANIMATION_MS = 200;

interface PromoBannersHostProps {
  banners: PromoBanner[];
  /** В превью админки не пишем «уже видел» в localStorage. */
  persistSeen?: boolean;
}

function BannerMedia({
  banner,
  imageClassName,
  linkClassName,
}: {
  banner: PromoBanner;
  imageClassName: string;
  linkClassName: string;
}) {
  const image = (
    <ResponsiveImage
      className={imageClassName}
      src={banner.imageUrl}
      webpSrc={banner.imageWebpUrl}
      alt={banner.title?.trim() || 'Акция'}
    />
  );

  if (!banner.linkUrl) {
    return image;
  }

  return (
    <a
      href={banner.linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClassName}
    >
      {image}
    </a>
  );
}

function PromoBannerModal({
  banner,
  onClose,
}: {
  banner: PromoBanner;
  onClose: () => void;
}) {
  const { mounted, isActive, handleClose } = useModalPresence(onClose, MODAL_ANIMATION_MS);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleClose]);

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <RestaurantStylingPortalRoot>
      <button
        type="button"
        className={`promo-banner-modal__backdrop${isActive ? ' promo-banner-modal--active' : ''}`}
        aria-label="Закрыть"
        onClick={handleClose}
      />
      <div className="promo-banner-modal" role="presentation">
        <div
          className={`promo-banner-modal__panel${isActive ? ' promo-banner-modal--active' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label={banner.title?.trim() || 'Акция'}
        >
          <button
            type="button"
            className="promo-banner-modal__close"
            aria-label="Закрыть"
            onClick={handleClose}
          >
            ×
          </button>
          <BannerMedia
            banner={banner}
            imageClassName="promo-banner-modal__image"
            linkClassName="promo-banner-modal__link"
          />
          {banner.title && <p className="promo-banner-modal__title">{banner.title}</p>}
        </div>
      </div>
    </RestaurantStylingPortalRoot>,
    document.body,
  );
}

function PromoBannerStrip({ banners }: { banners: PromoBanner[] }) {
  if (banners.length === 0) {
    return null;
  }

  const slides = banners.map((banner) => {
    const ratio = resolvePromoBannerAspectRatio(banner);
    const ratioClass =
      ratio === '16_9'
        ? 'promo-banner-strip__image--16-9'
        : 'promo-banner-strip__image--4-1';

    return (
      <div key={banner.id} className="promo-banner-strip__slide">
        <BannerMedia
          banner={banner}
          imageClassName={`promo-banner-strip__image ${ratioClass}`}
          linkClassName="promo-banner-strip__link"
        />
      </div>
    );
  });

  return (
    <section className="promo-banner-strip" aria-label="Акции">
      {banners.length === 1 ? (
        slides[0]
      ) : (
        <Carousel
          className="promo-banner-strip__carousel"
          slides={slides}
          autoplay
          autoplayDelay={5000}
          showArrows={false}
          showDots
        />
      )}
    </section>
  );
}

function pickModalBanner(modals: PromoBanner[]): PromoBanner | null {
  for (const banner of modals) {
    if (banner.displayFrequency === 'once' && hasSeenPromoBanner(banner.id)) {
      continue;
    }
    return banner;
  }
  return null;
}

/**
 * Плашка между описанием и меню + модалка акции.
 * Оба вида могут быть активны одновременно.
 */
export function PromoBannersHost({ banners, persistSeen = true }: PromoBannersHostProps) {
  const stripBanners = useMemo(
    () => banners.filter((banner) => banner.type === 'strip' && banner.isActive),
    [banners],
  );

  const modalCandidates = useMemo(
    () => banners.filter((banner) => banner.type === 'modal' && banner.isActive),
    [banners],
  );

  const [modalBanner, setModalBanner] = useState<PromoBanner | null>(null);

  useEffect(() => {
    setModalBanner(pickModalBanner(modalCandidates));
  }, [modalCandidates]);

  function handleModalClose() {
    if (modalBanner && persistSeen && modalBanner.displayFrequency === 'once') {
      markPromoBannerSeen(modalBanner.id);
    }
    setModalBanner(null);
  }

  return (
    <>
      <PromoBannerStrip banners={stripBanners} />
      {modalBanner && <PromoBannerModal banner={modalBanner} onClose={handleModalClose} />}
    </>
  );
}
