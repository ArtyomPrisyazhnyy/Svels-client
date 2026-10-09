import type { MenuCategory } from '@/shared/types/menu';

type MenuCategoryWithCreatedAt = MenuCategory & { createdAt?: string };

/** Стабильная сортировка: sortOrder, затем createdAt (если есть в ответе API), затем id. */
export function sortMenuCategories(categories: MenuCategory[]): MenuCategory[] {
  return [...categories].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder;
    }

    const aCreated = (a as MenuCategoryWithCreatedAt).createdAt;
    const bCreated = (b as MenuCategoryWithCreatedAt).createdAt;
    if (aCreated && bCreated && aCreated !== bCreated) {
      return aCreated.localeCompare(bCreated);
    }

    return a.id.localeCompare(b.id);
  });
}
