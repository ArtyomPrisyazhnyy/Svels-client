import {
  promoBannerAspectRatioToCss,
  type PromoBannerAspectRatio,
} from '@/shared/types/promo-banner';

export function promoBannerAspectRatioToNumber(ratio: PromoBannerAspectRatio): number {
  return ratio === '16_9' ? 16 / 9 : 4;
}

export { promoBannerAspectRatioToCss };

/** Default crop viewport for modal banners (no strip format). */
export const PROMO_BANNER_MODAL_CROP_ASPECT = 4 / 5;
