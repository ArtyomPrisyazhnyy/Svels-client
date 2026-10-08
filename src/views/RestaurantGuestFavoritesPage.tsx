'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useHydrateFavorites } from '@/hooks/useHydrateFavorites';
import { RestaurantStylingShell } from '@/features/restaurants/context/RestaurantStylingContext';
import { MenuProductCard } from '@/features/restaurants/components/MenuProductCard';
import { MenuProductDetailModal } from '@/features/restaurants/components/MenuProductDetailModal';
import { getAvailableMenuCategories } from '@/features/restaurants/utils/menu-catalog.util';
import { useRestaurantGuestPaths } from '@/shared/routing/restaurant-guest-path';
import type { MenuItem, MenuResponse } from '@/shared/types/menu';
import type { RestaurantStyling } from '@/shared/types/restaurant-styling';
import { useFavoritesStore } from '@/store/favorites.store';
import '@/features/restaurants/styles/restaurant-menu.scss';
import '@/features/restaurants/styles/restaurant-favorites-page.scss';

interface RestaurantGuestFavoritesPageProps {
  restaurantId: string;
  restaurantName: string;
  menu: MenuResponse;
  styling: RestaurantStyling;
}

export function RestaurantGuestFavoritesPage({
  restaurantId,
  restaurantName,
  menu,
  styling,
}: RestaurantGuestFavoritesPageProps) {
  const paths = useRestaurantGuestPaths(restaurantId);
  const favoriteIds = useFavoritesStore((s) => s.menuItemIds);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  useHydrateFavorites(restaurantId, styling.favoritesEnabled !== false);

  const favoriteItems = useMemo(() => {
    const byId = new Map<string, MenuItem>();
    for (const category of getAvailableMenuCategories(menu.categories)) {
      for (const item of category.items) {
        byId.set(item.id, item);
      }
    }
    return favoriteIds
      .map((id) => byId.get(id))
      .filter((item): item is MenuItem => Boolean(item));
  }, [favoriteIds, menu.categories]);

  return (
    <RestaurantStylingShell styling={styling}>
      <div className="restaurant-favorites-page" data-testid="guest-favorites-page">
        <header className="glass-header glass-header--tenant restaurant-favorites-page__header">
          <Link
            href={paths.home}
            className="glass-header__link glass-header__link--accent"
          >
            ← {restaurantName}
          </Link>
          <h1 className="glass-header__title">Избранное</h1>
          <span className="restaurant-favorites-page__header-spacer" aria-hidden />
        </header>

        <main className="restaurant-favorites-page__main">
          {favoriteItems.length === 0 ? (
            <div
              className="restaurant-favorites-page__empty"
              data-testid="guest-favorites-empty"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <h2>Пока пусто</h2>
              <p>Нажмите сердечко на карточке, чтобы сохранить позицию в избранное.</p>
              <Link href={paths.home} className="glass-header__link glass-header__link--accent">
                К каталогу
              </Link>
            </div>
          ) : (
            <div className="restaurant-menu__grid">
              {favoriteItems.map((item) => (
                <MenuProductCard
                  key={item.id}
                  restaurantId={restaurantId}
                  item={item}
                  onSelect={setSelectedItem}
                />
              ))}
            </div>
          )}
        </main>

        {selectedItem ? (
          <MenuProductDetailModal
            item={selectedItem}
            restaurantId={restaurantId}
            onClose={() => setSelectedItem(null)}
          />
        ) : null}
      </div>
    </RestaurantStylingShell>
  );
}
