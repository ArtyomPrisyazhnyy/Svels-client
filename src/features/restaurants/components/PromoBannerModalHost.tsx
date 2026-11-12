'use client';

import { useMemo, useState } from 'react';
import { Modal } from '@/shared/ui/Modal/Modal';
import type { PromoBanner } from '@/shared/types/promo-banner';
import { RestaurantStylingPortalRoot } from '../context/RestaurantStylingContext';
import {
  hasSeenPromoBanner,
  markPromoBannerSeen,
} from '../utils/promo-banner-seen.util';
import { PromoBannerAspectMedia } from './PromoBannerAspectMedia';
import '../styles/promo-banner-modal.scss';

interface PromoBannerModalHostProps {
  banners: PromoBanner[];
  /** В превью админки не пишем «уже видел» в localStorage. */
  persistSeen?: boolean;
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
      <PromoBannerAspectMedia
        banner={banner}
        frameClassName="promo-banner-modal__frame"
        frameTestId="promo-banner-modal-aspect-frame"
        imageClassName="promo-banner-modal__image"
        linkClassName="promo-banner-modal__link"
      />
    </Modal>
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

/** Модалка акции. Не рендерится на сервере — выбор зависит от localStorage. */
export function PromoBannerModalHost({
  banners,
  persistSeen = true,
}: PromoBannerModalHostProps) {
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

  if (!modalBanner) {
    return null;
  }

  return <PromoBannerModal banner={modalBanner} onClose={handleModalClose} />;
}
