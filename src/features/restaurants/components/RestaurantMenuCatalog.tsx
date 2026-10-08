'use client';

import { useMemo, useState } from 'react';
import type { MenuItem, MenuResponse } from '@/shared/types/menu';
import { useHydrateFavorites } from '@/hooks/useHydrateFavorites';
import { useRestaurantStylingOptional } from '../context/RestaurantStylingContext';
import { useMenuCategoryNavOptional } from '../context/MenuCategoryNavContext';
import { getAvailableMenuCategories } from '../utils/menu-catalog.util';
import { RestaurantMenuInlineCategoryNav } from './RestaurantMenuInlineCategoryNav';
import { MenuCategoryNav } from './MenuCategoryNav';
import { MenuProductCard } from './MenuProductCard';
import { MenuProductDetailModal } from './MenuProductDetailModal';
import '../styles/restaurant-menu.scss';

interface RestaurantMenuCatalogProps {
  restaurantId: string;
  menu: MenuResponse;
}

export function RestaurantMenuCatalog({
  restaurantId,
  menu,
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
      {navContext && <RestaurantMenuInlineCategoryNav />}

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
            {category.items.map((item) => (
              <MenuProductCard
                key={item.id}
                restaurantId={restaurantId}
                item={item}
                onSelect={setSelectedItem}
              />
            ))}
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
