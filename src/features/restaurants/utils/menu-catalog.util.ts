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

/** TEMP: убрать после проверки UI навигации — сколько копий каждой категории показать в списке. */
export const TEMP_CATEGORY_NAV_FLATMAP_COPIES = 8;

/** TEMP: размножает категории для превью длинной полоски навигации. */
export function tempExpandMenuCategoryNavItems(
  items: { id: string; name: string }[],
): { id: string; name: string }[] {
  if (TEMP_CATEGORY_NAV_FLATMAP_COPIES <= 1) {
    return items;
  }

  return items.flatMap((item) =>
    Array.from({ length: TEMP_CATEGORY_NAV_FLATMAP_COPIES }, (_, index) => ({
      id: index === 0 ? item.id : `${item.id}-temp-${index}`,
      name: index === 0 ? item.name : `${item.name} ${index + 1}`,
    })),
  );
}
