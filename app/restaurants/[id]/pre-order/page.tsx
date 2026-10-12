import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { RestaurantGuestProtectedRoute } from '@/components/RestaurantGuestProtectedRoute';
import { RestaurantGuestPreOrderPage } from '@/views/RestaurantGuestPreOrderPage';
import { getRestaurantPublic } from '@/server/restaurant-public';

/** Fallback ISR (сек). */
export const revalidate = 3600;
export const dynamicParams = true;

interface RestaurantPreOrderPageProps {
  params: Promise<{ id: string }>;
}

function PageLoader() {
  return (
    <div className="venue-subpage__main">
      <div className="ui-skeleton" style={{ minHeight: '40vh' }} />
    </div>
  );
}

export default async function RestaurantPreOrderPageRoute({ params }: RestaurantPreOrderPageProps) {
  const { id } = await params;
  const restaurant = await getRestaurantPublic(id);

  if (!restaurant) {
    notFound();
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <RestaurantGuestProtectedRoute restaurantId={restaurant.id}>
        <RestaurantGuestPreOrderPage
          restaurantId={restaurant.id}
          restaurantName={restaurant.name}
        />
      </RestaurantGuestProtectedRoute>
    </Suspense>
  );
}
