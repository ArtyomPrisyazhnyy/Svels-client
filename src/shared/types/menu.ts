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
  isAvailable: boolean;
  imageUrl: string;
  galleryUrls: string[];
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
  imageUrl: string;
  galleryUrls?: string[];
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
  imageUrl?: string;
  galleryUrls?: string[];
  modifierGroups?: MenuModifierGroup[];
}

/** Максимум дополнительных фото галереи (обложка imageUrl не в счёт). */
export const MAX_MENU_ITEM_GALLERY_IMAGES = 9;

/** Все изображения позиции в порядке показа: обложка + галерея. */
export function getMenuItemImages(item: Pick<MenuItem, 'imageUrl' | 'galleryUrls'>): string[] {
  return [item.imageUrl, ...(item.galleryUrls ?? [])].filter((url) => url.length > 0);
}

export { formatPrice, formatPriceDelta } from '@/shared/utils/currency.util';

/** Относительный URL — одинаков на SSR и клиенте; Next.js проксирует /uploads на backend. */
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
