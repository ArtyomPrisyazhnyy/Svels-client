import { notFound } from 'next/navigation';
import { RestaurantGuestProtectedRoute } from '@/components/RestaurantGuestProtectedRoute';
import { GuestBookingPageSkeleton } from '@/features/restaurants/components/guest-page-skeletons/GuestPageSkeletons';
import { RestaurantGuestBookingPage } from '@/views/RestaurantGuestBookingPage';
import {
  getRestaurantBookingAvailability,
  getRestaurantBookingSettings,
  getRestaurantPublic,
} from '@/server/restaurant-public';
import { restaurantVenueStaticParams } from '@/server/restaurant-venue-static-params';

/** Fallback ISR (сек). */
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return restaurantVenueStaticParams();
}

interface RestaurantBookingPageProps {
  params: Promise<{ id: string }>;
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export default async function RestaurantBookingPageRoute({ params }: RestaurantBookingPageProps) {
  const { id } = await params;
  const initialDate = todayString();
  const [restaurant, bookingSettings] = await Promise.all([
    getRestaurantPublic(id),
    getRestaurantBookingSettings(id),
  ]);

  if (!restaurant) {
    notFound();
  }

  const initialAvailability =
    bookingSettings.bookingEnabled
      ? await getRestaurantBookingAvailability(restaurant.id, initialDate)
      : null;

  return (
    <RestaurantGuestProtectedRoute
      restaurantId={restaurant.id}
      fallback={<GuestBookingPageSkeleton />}
    >
      <RestaurantGuestBookingPage
        restaurantId={restaurant.id}
        restaurantName={restaurant.name}
        bookingSettings={bookingSettings}
        initialAvailability={initialAvailability}
        initialDate={initialDate}
      />
    </RestaurantGuestProtectedRoute>
  );
}
