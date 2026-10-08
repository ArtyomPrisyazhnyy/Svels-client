import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { RestaurantGuestFavoritesPage } from '@/views/RestaurantGuestFavoritesPage';
import type { PublicRestaurant } from '@/features/restaurants/types/restaurant';
import type { MenuResponse } from '@/shared/types/menu';
import type { RestaurantStyling } from '@/shared/types/restaurant-styling';
import { createDefaultRestaurantStyling } from '@/shared/types/restaurant-styling';
import { serverFetch, type ServerFetchOptions } from '@/shared/api/server-api';
import {
  RESTAURANT_PUBLIC_REVALIDATE_SECONDS,
  restaurantPublicPageTag,
} from '@/shared/cache/restaurant-public-cache';

/** Fallback ISR (сек). Должен быть литералом — см. publicPageFetchOptions ниже. */
export const revalidate = 3600;
export const dynamicParams = true;

interface RestaurantFavoritesPageProps {
  params: Promise<{ id: string }>;
}

const EMPTY_MENU: MenuResponse = { categories: [] };

function PageLoader() {
  return (
    <div style={{ minHeight: '40vh', display: 'grid', placeItems: 'center', color: '#64748b' }}>
      Загрузка…
    </div>
  );
}

function publicPageFetchOptions(restaurantId: string): ServerFetchOptions {
  return {
    revalidate: RESTAURANT_PUBLIC_REVALIDATE_SECONDS,
    tags: [restaurantPublicPageTag(restaurantId)],
  };
}

async function fetchRestaurant(id: string): Promise<PublicRestaurant | null> {
  try {
    return await serverFetch<PublicRestaurant>(
      `/restaurants/${id}`,
      undefined,
      publicPageFetchOptions(id),
    );
  } catch {
    return null;
  }
}

async function fetchMenu(restaurantId: string): Promise<MenuResponse> {
  try {
    return await serverFetch<MenuResponse>(
      `/restaurants/${restaurantId}/menu`,
      undefined,
      publicPageFetchOptions(restaurantId),
    );
  } catch {
    return EMPTY_MENU;
  }
}

async function fetchStyling(restaurantId: string): Promise<RestaurantStyling> {
  try {
    return await serverFetch<RestaurantStyling>(
      `/restaurants/${restaurantId}/styling`,
      undefined,
      publicPageFetchOptions(restaurantId),
    );
  } catch {
    return createDefaultRestaurantStyling(restaurantId);
  }
}

export default async function RestaurantFavoritesPageRoute({ params }: RestaurantFavoritesPageProps) {
  const { id } = await params;
  const [restaurant, menu, styling] = await Promise.all([
    fetchRestaurant(id),
    fetchMenu(id),
    fetchStyling(id),
  ]);

  if (!restaurant) {
    notFound();
  }

  if (styling.favoritesEnabled === false) {
    notFound();
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <RestaurantGuestFavoritesPage
        restaurantId={restaurant.id}
        restaurantName={restaurant.name}
        menu={menu}
        styling={styling}
      />
    </Suspense>
  );
}
