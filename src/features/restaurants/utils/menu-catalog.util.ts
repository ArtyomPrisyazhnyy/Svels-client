import type { MenuCategory } from '@/shared/types/menu';

export function getAvailableMenuCategories(categories: MenuCategory[]): MenuCategory[] {
  return categories
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => item.isAvailable),
    }))
    .filter((category) => category.items.length > 0);
}

export function toMenuCategoryNavItems(
  categories: MenuCategory[],
): { id: string; name: string }[] {
  return categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));
}
