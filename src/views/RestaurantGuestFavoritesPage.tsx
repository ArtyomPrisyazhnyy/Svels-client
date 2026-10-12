'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useFavoritesPersistReady, useHydrateFavorites } from '@/hooks/useHydrateFavorites';
import { MenuProductCard } from '@/features/restaurants/components/MenuProductCard';
import { GuestFavoritesPageSkeleton } from '@/features/restaurants/components/guest-page-skeletons/GuestPageSkeletons';
import { getAvailableMenuCategories } from '@/features/restaurants/utils/menu-catalog.util';
import { useRestaurantGuestPaths } from '@/shared/routing/restaurant-guest-path';
import { useRestaurantStylingOptional } from '@/features/restaurants/context/RestaurantStylingContext';
import type { MenuItem, MenuResponse } from '@/shared/types/menu';
import { useFavoritesStore } from '@/store/favorites.store';
import { PageTitle } from '@/shared/ui/PageTitle/PageTitle';
import { Stack } from '@/shared/ui/Stack/Stack';
import '@/features/restaurants/styles/restaurant-menu.scss';
import '@/features/restaurants/styles/restaurant-favorites-page.scss';

import { MenuProductDetailModal } from '@/features/restaurants/components/MenuProductDetailModal';

interface RestaurantGuestFavoritesPageProps {
  restaurantId: string;
  restaurantName: string;
  menu: MenuResponse;
}

export function RestaurantGuestFavoritesPage({
  restaurantId,
  menu,
}: RestaurantGuestFavoritesPageProps) {
  const paths = useRestaurantGuestPaths(restaurantId);
  const favoriteIds = useFavoritesStore((s) => s.menuItemIds);
  const persistReady = useFavoritesPersistReady();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const { styling } = useRestaurantStylingOptional();
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

  if (!persistReady) {
    return <GuestFavoritesPageSkeleton />;
  }

  return (
    <div className="venue-subpage restaurant-favorites-page" data-testid="guest-favorites-page">
      <main className="venue-subpage__main restaurant-favorites-page__main">
        <Stack gap={4} className="venue-subpage__stack">
          <PageTitle
            title="Избранное"
            testId="guest-favorites-page-title"
            className="ui-page-title--venue"
          />

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
              <Link href={paths.home} className="restaurant-favorites-page__catalog-link">
                К каталогу
              </Link>
            </div>
          ) : (
            <div className="restaurant-menu__grid" data-testid="guest-page-first-block">
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
        </Stack>
      </main>

      {selectedItem ? (
        <MenuProductDetailModal
          item={selectedItem}
          restaurantId={restaurantId}
          onClose={() => setSelectedItem(null)}
        />
      ) : null}
    </div>
  );
}
