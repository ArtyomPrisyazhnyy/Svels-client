import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { RestaurantGuestProtectedRoute } from '@/components/RestaurantGuestProtectedRoute';
import { RestaurantGuestPreOrderPage } from '@/views/RestaurantGuestPreOrderPage';
import type { PublicRestaurant } from '@/features/restaurants/types/restaurant';
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

interface RestaurantPreOrderPageProps {
  params: Promise<{ id: string }>;
}

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

export default async function RestaurantPreOrderPageRoute({ params }: RestaurantPreOrderPageProps) {
  const { id } = await params;
  const [restaurant, styling] = await Promise.all([fetchRestaurant(id), fetchStyling(id)]);

  if (!restaurant) {
    notFound();
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <RestaurantGuestProtectedRoute restaurantId={restaurant.id}>
        <RestaurantGuestPreOrderPage
          restaurantId={restaurant.id}
          restaurantName={restaurant.name}
          styling={styling}
        />
      </RestaurantGuestProtectedRoute>
    </Suspense>
  );
}
