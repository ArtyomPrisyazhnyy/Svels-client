export type PromoBannerType = 'modal' | 'strip';

export type PromoBannerDisplayFrequency = 'once' | 'every_visit';

/** Формат плашки: широкий баннер или ТВ 16:9. */
export type PromoBannerAspectRatio = '4_1' | '16_9';

export interface PromoBanner {
  id: string;
  restaurantId: string;
  type: PromoBannerType;
  title: string | null;
  imageUrl: string;
  imageWebpUrl: string | null;
  linkUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  displayFrequency: PromoBannerDisplayFrequency;
  aspectRatio: PromoBannerAspectRatio;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromoBannerPayload {
  type: PromoBannerType;
  title?: string;
  imageUrl: string;
  imageWebpUrl?: string | null;
  linkUrl?: string | null;
  isActive?: boolean;
  sortOrder?: number;
  displayFrequency?: PromoBannerDisplayFrequency;
  aspectRatio?: PromoBannerAspectRatio;
}

export interface UpdatePromoBannerPayload {
  type?: PromoBannerType;
  title?: string | null;
  imageUrl?: string;
  imageWebpUrl?: string | null;
  linkUrl?: string | null;
  isActive?: boolean;
  sortOrder?: number;
  displayFrequency?: PromoBannerDisplayFrequency;
  aspectRatio?: PromoBannerAspectRatio;
}

export const PROMO_BANNER_TYPE_LABELS: Record<PromoBannerType, string> = {
  modal: 'Модальное окно',
  strip: 'Плашка над меню',
};

export const PROMO_BANNER_FREQUENCY_LABELS: Record<PromoBannerDisplayFrequency, string> = {
  once: 'Один раз',
  every_visit: 'При каждом посещении',
};

export const PROMO_BANNER_ASPECT_RATIO_LABELS: Record<PromoBannerAspectRatio, string> = {
  '4_1': '4∶1 — широкий баннер',
  '16_9': '16∶9 — как на ТВ',
};

export function resolvePromoBannerAspectRatio(
  banner: Pick<PromoBanner, 'aspectRatio' | 'type'>,
): PromoBannerAspectRatio {
  if (banner.type !== 'strip') {
    return '4_1';
  }
  return banner.aspectRatio === '16_9' ? '16_9' : '4_1';
}
