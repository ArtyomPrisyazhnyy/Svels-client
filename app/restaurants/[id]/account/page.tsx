import { RestaurantGuestProtectedRoute } from '@/components/RestaurantGuestProtectedRoute';
import { GuestAccountPageSkeleton } from '@/features/restaurants/components/guest-page-skeletons/GuestPageSkeletons';
import { RestaurantGuestAccountPage } from '@/views/RestaurantGuestAccountPage';
import { getRestaurantPublic } from '@/server/restaurant-public';
import { restaurantVenueStaticParams } from '@/server/restaurant-venue-static-params';
import { notFound } from 'next/navigation';

/** Fallback ISR (сек). */
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return restaurantVenueStaticParams();
}

interface RestaurantAccountPageProps {
  params: Promise<{ id: string }>;
}

export default async function RestaurantAccountPageRoute({ params }: RestaurantAccountPageProps) {
  const { id } = await params;
  const restaurant = await getRestaurantPublic(id);

  if (!restaurant) {
    notFound();
  }

  return (
    <RestaurantGuestProtectedRoute
      restaurantId={restaurant.id}
      fallback={<GuestAccountPageSkeleton />}
    >
      <RestaurantGuestAccountPage
        restaurantId={restaurant.id}
        restaurantName={restaurant.name}
      />
    </RestaurantGuestProtectedRoute>
  );
}
