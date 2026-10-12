import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { RestaurantGuestProtectedRoute } from '@/components/RestaurantGuestProtectedRoute';
import { RestaurantGuestBookingPage } from '@/views/RestaurantGuestBookingPage';
import {
  getRestaurantBookingSettings,
  getRestaurantPublic,
} from '@/server/restaurant-public';

/** Fallback ISR (сек). */
export const revalidate = 3600;
export const dynamicParams = true;

interface RestaurantBookingPageProps {
  params: Promise<{ id: string }>;
}

function PageLoader() {
  return (
    <div className="venue-subpage__main">
      <div className="ui-skeleton" style={{ minHeight: '40vh' }} />
    </div>
  );
}

export default async function RestaurantBookingPageRoute({ params }: RestaurantBookingPageProps) {
  const { id } = await params;
  const [restaurant, bookingSettings] = await Promise.all([
    getRestaurantPublic(id),
    getRestaurantBookingSettings(id),
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
          bookingSettings={bookingSettings}
        />
      </RestaurantGuestProtectedRoute>
    </Suspense>
  );
}
