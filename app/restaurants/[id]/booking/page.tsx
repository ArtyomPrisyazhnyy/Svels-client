import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { RestaurantGuestProtectedRoute } from '@/components/RestaurantGuestProtectedRoute';
import { RestaurantGuestBookingPage } from '@/views/RestaurantGuestBookingPage';
import type { PublicRestaurant } from '@/features/restaurants/types/restaurant';
import type { RestaurantStyling } from '@/shared/types/restaurant-styling';
import type { BookingSettings } from '@/shared/types/booking-settings';
import { createDefaultRestaurantStyling } from '@/shared/types/restaurant-styling';
import { DEFAULT_BOOKING_SETTINGS } from '@/shared/types/booking-settings';
import { serverFetch, type ServerFetchOptions } from '@/shared/api/server-api';
import {
  RESTAURANT_PUBLIC_REVALIDATE_SECONDS,
  restaurantPublicPageTag,
} from '@/shared/cache/restaurant-public-cache';

/** Fallback ISR (сек). Должен быть литералом — см. publicPageFetchOptions ниже. */
export const revalidate = 3600;
export const dynamicParams = true;

interface RestaurantBookingPageProps {
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

async function fetchBookingSettings(restaurantId: string): Promise<BookingSettings> {
  try {
    return await serverFetch<BookingSettings>(
      `/restaurants/${restaurantId}/booking-settings`,
      undefined,
      publicPageFetchOptions(restaurantId),
    );
  } catch {
    return { restaurantId, ...DEFAULT_BOOKING_SETTINGS, updatedAt: new Date().toISOString() };
  }
}

export default async function RestaurantBookingPageRoute({ params }: RestaurantBookingPageProps) {
  const { id } = await params;
  const [restaurant, styling, bookingSettings] = await Promise.all([
    fetchRestaurant(id),
    fetchStyling(id),
    fetchBookingSettings(id),
  ]);

  if (!restaurant) {
    notFound();
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <RestaurantGuestProtectedRoute restaurantId={restaurant.id}>
        <RestaurantGuestBookingPage
          restaurantId={restaurant.id}
          restaurantName={restaurant.name}
          styling={styling}
          bookingSettings={bookingSettings}
        />
      </RestaurantGuestProtectedRoute>
    </Suspense>
  );
}
