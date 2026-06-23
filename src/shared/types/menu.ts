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
  description: string | null;
  ingredients: string | null;
  nutrition: MenuItemNutrition | null;
  price: number;
  isAvailable: boolean;
  imageUrl: string;
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
  description?: string;
  ingredients?: string;
  nutrition?: MenuItemNutrition;
  price: number;
  imageUrl: string;
  modifierGroups?: MenuModifierGroup[];
}

export function formatPriceDelta(delta: number): string {
  if (!delta) {
    return '';
  }

  const sign = delta > 0 ? '+' : '−';
  return ` (${sign}${Math.abs(delta).toFixed(0)} ₽)`;
}

export function resolveImageUrl(imageUrl: string): string {
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
  return `${apiUrl}${imageUrl}`;
}
