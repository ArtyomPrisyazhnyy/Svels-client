import { Suspense } from 'react';
import { RestaurantGuestProtectedRoute } from '@/components/RestaurantGuestProtectedRoute';
import { RestaurantGuestAccountPage } from '@/views/RestaurantGuestAccountPage';
import { getRestaurantPublic } from '@/server/restaurant-public';
import { notFound } from 'next/navigation';

/** Fallback ISR (сек). */
export const revalidate = 3600;
export const dynamicParams = true;

interface RestaurantAccountPageProps {
  params: Promise<{ id: string }>;
}

function PageLoader() {
  return (
    <div
      className="venue-subpage__main"
      data-testid="guest-account-loading"
      style={{ minHeight: '40vh' }}
    />
  );
}

export default async function RestaurantAccountPageRoute({ params }: RestaurantAccountPageProps) {
  const { id } = await params;
  const restaurant = await getRestaurantPublic(id);

  if (!restaurant) {
    notFound();
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <RestaurantGuestProtectedRoute restaurantId={restaurant.id}>
        <RestaurantGuestAccountPage
          restaurantId={restaurant.id}
          restaurantName={restaurant.name}
        />
      </RestaurantGuestProtectedRoute>
    </Suspense>
  );
}
