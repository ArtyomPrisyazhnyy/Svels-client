'use client';

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import { useFavoritesPersistReady, useHydrateFavorites } from '@/hooks/useHydrateFavorites';
import { MenuProductCard } from '@/features/restaurants/components/MenuProductCard';
import { GuestFavoritesPageSkeleton } from '@/features/restaurants/components/guest-page-skeletons/GuestPageSkeletons';
import { getAvailableMenuCategories } from '@/features/restaurants/utils/menu-catalog.util';
import { useRestaurantGuestPaths } from '@/shared/routing/restaurant-guest-path';
import { useRestaurantStylingOptional } from '@/features/restaurants/context/RestaurantStylingContext';
import { resolveImageUrl, type MenuItem, type MenuResponse } from '@/shared/types/menu';
import { useAuthStore } from '@/store/auth.store';
import { useFavoritesStore } from '@/store/favorites.store';
import { PageTitle } from '@/shared/ui/PageTitle/PageTitle';
import { Stack } from '@/shared/ui/Stack/Stack';
import '@/features/restaurants/styles/restaurant-menu.scss';
import '@/features/restaurants/styles/restaurant-favorites-page.scss';

import { MenuProductDetailModal } from '@/features/restaurants/components/MenuProductDetailModal';

const decodedImageUrls = new Set<string>();
const imageListeners = new Set<() => void>();

function subscribeDecodedImages(listener: () => void): () => void {
  imageListeners.add(listener);
  return () => {
    imageListeners.delete(listener);
  };
}

function markImageDecoded(url: string): void {
  if (decodedImageUrls.has(url)) {
    return;
  }
  decodedImageUrls.add(url);
  imageListeners.forEach((listener) => listener());
}

function useImagesDecoded(urls: string[] | null): boolean {
  return useSyncExternalStore(
    subscribeDecodedImages,
    () => urls !== null && urls.every((url) => decodedImageUrls.has(url)),
    () => false,
  );
}

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
  const favoritesHydrated = useFavoritesStore((s) => s.hydrated);
  const hydratedAccessToken = useFavoritesStore((s) => s.hydratedAccessToken);
  const accessToken = useAuthStore((s) => s.accessToken);
  const authHydrated = useAuthHydrated();
  const persistReady = useFavoritesPersistReady();
  const listReady =
    authHydrated &&
    favoritesHydrated &&
    hydratedAccessToken === (accessToken ?? null);
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

  const imageUrls = useMemo(() => {
    if (!persistReady || !listReady) {
      return null;
    }
    return favoriteItems.flatMap((item) => {
      const fallback = item.imageUrl ? resolveImageUrl(item.imageUrl) : null;
      const webp = item.imageWebpUrl ? resolveImageUrl(item.imageWebpUrl) : null;
      const painted = webp && webp !== fallback ? webp : fallback;
      return painted ? [painted] : [];
    });
  }, [favoriteItems, listReady, persistReady]);
  const imagesReady = useImagesDecoded(imageUrls);

  useEffect(() => {
    if (!imageUrls) {
      return;
    }
    let cancelled = false;
    const timers: number[] = [];

    const load = (url: string, attempt: number) => {
      if (cancelled || decodedImageUrls.has(url)) {
        return;
      }
      const image = new Image();
      image.onload = () => {
        const decoded = typeof image.decode === 'function' ? image.decode() : Promise.resolve();
        decoded
          .then(() => {
            if (!cancelled) {
              markImageDecoded(url);
            }
          })
          .catch(() => {
            if (!cancelled && image.naturalWidth > 0) {
              markImageDecoded(url);
            }
          });
      };
      image.onerror = () => {
        if (cancelled || attempt >= 4) {
          return;
        }
        timers.push(window.setTimeout(() => load(url, attempt + 1), 200 * (attempt + 1)));
      };
      image.src = url;
    };

    for (const url of imageUrls) {
      load(url, 0);
    }

    return () => {
      cancelled = true;
      for (const timer of timers) {
        window.clearTimeout(timer);
      }
    };
  }, [imageUrls]);

  if (!persistReady || !listReady || !imagesReady) {
    return <GuestFavoritesPageSkeleton />;
  }

  return (
    <>
      <main
        className="venue-subpage__main restaurant-favorites-page__main"
        data-testid="guest-favorites-page"
      >
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
                  imageLoading="eager"
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
    </>
  );
}
