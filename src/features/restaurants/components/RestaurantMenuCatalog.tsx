'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import {
  eagerMenuImageCount,
  menuImageFetchPriority,
  menuImageLoading,
} from '@/shared/images/menu-image-loading';
import type { MenuItem, MenuResponse } from '@/shared/types/menu';
import { useHydrateFavorites } from '@/hooks/useHydrateFavorites';
import { useRestaurantStylingOptional } from '../context/RestaurantStylingContext';
import { useMenuCategoryNavOptional } from '../context/MenuCategoryNavContext';
import { getAvailableMenuCategories } from '../utils/menu-catalog.util';
import { MenuCategoryNav } from './MenuCategoryNav';
import { MenuProductCard } from './MenuProductCard';
import '../styles/restaurant-menu.scss';

const MenuProductDetailModal = dynamic(
  () => import('./MenuProductDetailModal').then((module) => module.MenuProductDetailModal),
  { ssr: false, loading: () => null },
);

function preloadMenuProductDetailModal() {
  void import('./MenuProductDetailModal');
}

interface RestaurantMenuCatalogProps {
  restaurantId: string;
  menu: MenuResponse;
  /** Promo strip is the LCP image — keep card photos off the high-priority queue. */
  deferImages?: boolean;
}

export function RestaurantMenuCatalog({
  restaurantId,
  menu,
  deferImages = false,
}: RestaurantMenuCatalogProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const { styling } = useRestaurantStylingOptional();
  const favoritesEnabled = styling.favoritesEnabled !== false;
  const navContext = useMenuCategoryNavOptional();
  useHydrateFavorites(restaurantId, favoritesEnabled);

  const categories = useMemo(
    () => getAvailableMenuCategories(menu.categories),
    [menu.categories],
  );

  const showStandaloneNav =
    styling.menuCategoryNavEnabled && categories.length > 1 && navContext === null;
  const eagerCount = eagerMenuImageCount(styling.cardStyle);
  const imageIndexByItemId = useMemo(() => {
    const indexes = new Map<string, number>();
    let index = 0;
    for (const category of categories) {
      for (const item of category.items) {
        indexes.set(item.id, index);
        index += 1;
      }
    }
    return indexes;
  }, [categories]);

  if (categories.length === 0) {
    return (
      <section className="restaurant-menu" data-testid="restaurant-menu">
        <p className="restaurant-menu__empty" data-testid="menu-empty">
          Меню пока пусто
        </p>
      </section>
    );
  }

  return (
    <section className="restaurant-menu" aria-label="Меню" data-testid="restaurant-menu">
      {showStandaloneNav && (
        <MenuCategoryNav
          categories={categories.map((category) => ({
            id: category.id,
            name: category.name,
          }))}
        />
      )}

      {categories.map((category) => (
        <div
          key={category.id}
          id={`menu-category-${category.id}`}
          className="restaurant-menu__category"
        >
          <h2 className="restaurant-menu__category-title">{category.name}</h2>
          <div className="restaurant-menu__grid">
            {category.items.map((item) => {
              const imageIndex = imageIndexByItemId.get(item.id) ?? 0;
              return (
                <MenuProductCard
                  key={item.id}
                  restaurantId={restaurantId}
                  item={item}
                  onSelect={setSelectedItem}
                  onPreload={preloadMenuProductDetailModal}
                  imageLoading={menuImageLoading(imageIndex, eagerCount)}
                  imageFetchPriority={menuImageFetchPriority(imageIndex, deferImages)}
                />
              );
            })}
          </div>
        </div>
      ))}

      {selectedItem && (
        <MenuProductDetailModal
          item={selectedItem}
          restaurantId={restaurantId}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </section>
  );
}
