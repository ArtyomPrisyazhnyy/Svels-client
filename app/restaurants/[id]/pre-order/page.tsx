import { notFound } from 'next/navigation';
import { RestaurantGuestProtectedRoute } from '@/components/RestaurantGuestProtectedRoute';
import { GuestPreOrderPageSkeleton } from '@/features/restaurants/components/guest-page-skeletons/GuestPageSkeletons';
import { RestaurantGuestPreOrderPage } from '@/views/RestaurantGuestPreOrderPage';
import { getRestaurantPublic } from '@/server/restaurant-public';
import { restaurantVenueStaticParams } from '@/server/restaurant-venue-static-params';

/** Fallback ISR (сек). */
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return restaurantVenueStaticParams();
}

interface RestaurantPreOrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function RestaurantPreOrderPageRoute({ params }: RestaurantPreOrderPageProps) {
  const { id } = await params;
  const restaurant = await getRestaurantPublic(id);

  if (!restaurant) {
    notFound();
  }

  return (
    <RestaurantGuestProtectedRoute
      restaurantId={restaurant.id}
      fallback={<GuestPreOrderPageSkeleton />}
    >
      <RestaurantGuestPreOrderPage
        restaurantId={restaurant.id}
        restaurantName={restaurant.name}
      />
    </RestaurantGuestProtectedRoute>
  );
}
