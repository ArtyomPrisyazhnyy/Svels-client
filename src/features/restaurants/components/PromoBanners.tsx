'use client';

import { useMemo, useState } from 'react';
import { Carousel } from '@/shared/components/Carousel';
import { ResponsiveImage } from '@/shared/components/ResponsiveImage';
import { Modal } from '@/shared/ui/Modal/Modal';
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
  const title = banner.title?.trim() || 'Акция';

  return (
    <Modal
      open
      onClose={onClose}
      title={title}
      rootTestId="promo-banner-modal"
      testId="promo-banner-modal-panel"
      closeTestId="promo-banner-modal-close"
      panelClassName="promo-banner-modal__panel"
      size="sm"
      wrap={(node) => <RestaurantStylingPortalRoot>{node}</RestaurantStylingPortalRoot>}
    >
      <BannerMedia
        banner={banner}
        imageClassName="promo-banner-modal__image"
        linkClassName="promo-banner-modal__link"
      />
    </Modal>
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

  const candidateKey = modalCandidates.map((banner) => banner.id).join('|');
  const [bannerState, setBannerState] = useState<{ key: string; banner: PromoBanner | null }>({
    key: candidateKey,
    banner: pickModalBanner(modalCandidates),
  });
  if (bannerState.key !== candidateKey) {
    setBannerState({ key: candidateKey, banner: pickModalBanner(modalCandidates) });
  }
  const modalBanner = bannerState.key === candidateKey
    ? bannerState.banner
    : pickModalBanner(modalCandidates);

  function handleModalClose() {
    if (modalBanner && persistSeen && modalBanner.displayFrequency === 'once') {
      markPromoBannerSeen(modalBanner.id);
    }
    setBannerState({ key: candidateKey, banner: null });
  }

  return (
    <>
      <PromoBannerStrip banners={stripBanners} />
      {modalBanner && <PromoBannerModal banner={modalBanner} onClose={handleModalClose} />}
    </>
  );
}
