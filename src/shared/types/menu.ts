export type ModifierSelectionType = 'single' | 'multiple';

export interface MenuModifierOption {
  id?: string;
  name: string;
  priceDelta: number;
}

export interface MenuModifierGroup {
  id?: string;
  name: string;
  selectionType: ModifierSelectionType;
  required: boolean;
  options: MenuModifierOption[];
}

export interface MenuItemNutrition {
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  variantLabel: string | null;
  description: string | null;
  ingredients: string | null;
  nutrition: MenuItemNutrition | null;
  price: number;
  /** Перечёркнутая «старая» цена; null — без скидки. */
  oldPrice: number | null;
  isAvailable: boolean;
  imageUrl: string;
  imageWebpUrl?: string | null;
  galleryUrls: string[];
  galleryWebpUrls?: string[];
  modifierGroups: MenuModifierGroup[];
}

export interface MenuCategory {
  id: string;
  name: string;
  sortOrder: number;
  items: MenuItem[];
}

export interface MenuResponse {
  categories: MenuCategory[];
}

export interface CreateMenuItemPayload {
  categoryId: string;
  name: string;
  variantLabel?: string;
  description?: string;
  ingredients?: string;
  nutrition?: MenuItemNutrition;
  price: number;
  oldPrice?: number | null;
  imageUrl: string;
  imageWebpUrl?: string | null;
  galleryUrls?: string[];
  galleryWebpUrls?: string[];
  modifierGroups?: MenuModifierGroup[];
}

export interface UpdateMenuItemPayload {
  categoryId?: string;
  name?: string;
  variantLabel?: string | null;
  description?: string;
  ingredients?: string;
  nutrition?: MenuItemNutrition | null;
  price?: number;
  oldPrice?: number | null;
  imageUrl?: string;
  imageWebpUrl?: string | null;
  galleryUrls?: string[];
  galleryWebpUrls?: string[];
  modifierGroups?: MenuModifierGroup[];
}

export interface MenuImageSource {
  url: string;
  webpUrl?: string | null;
}

/** Максимум дополнительных фото галереи (обложка imageUrl не в счёт). */
export const MAX_MENU_ITEM_GALLERY_IMAGES = 9;

/** Все изображения позиции в порядке показа: обложка + галерея. */
export function getMenuItemImages(
  item: Pick<MenuItem, 'imageUrl' | 'imageWebpUrl' | 'galleryUrls' | 'galleryWebpUrls'>,
): MenuImageSource[] {
  const gallery = item.galleryUrls ?? [];
  const galleryWebp = item.galleryWebpUrls ?? [];
  const images: MenuImageSource[] = [
    { url: item.imageUrl, webpUrl: item.imageWebpUrl },
    ...gallery.map((url, index) => ({
      url,
      webpUrl: galleryWebp[index] || null,
    })),
  ];
  return images.filter((image) => image.url.length > 0);
}

export { formatPrice, formatPriceDelta } from '@/shared/utils/currency.util';

/**
 * Нормализует URL картинки.
 * /uploads/... остаётся same-origin (прокси Next → API).
 * Абсолютные URL (Yandex Object Storage и т.п.) отдаются как есть.
 */
export function resolveImageUrl(imageUrl: string): string {
  if (imageUrl.startsWith('data:')) {
    return imageUrl;
  }

  if (imageUrl.startsWith('http')) {
    try {
      const { pathname } = new URL(imageUrl);
      if (pathname.startsWith('/uploads/')) {
        return pathname;
      }
    } catch {
      // ignore invalid URL
    }
    return imageUrl;
  }

  return imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
}
