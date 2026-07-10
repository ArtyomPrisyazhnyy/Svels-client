import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { RestaurantGuestProtectedRoute } from '@/components/RestaurantGuestProtectedRoute';
import { RestaurantGuestAccountPage } from '@/views/RestaurantGuestAccountPage';
import type { PublicRestaurant } from '@/features/restaurants/types/restaurant';
import { serverFetch } from '@/shared/api/server-api';

interface RestaurantAccountPageProps {
  params: Promise<{ id: string }>;
}

function PageLoader() {
  return (
    <div style={{ minHeight: '40vh', display: 'grid', placeItems: 'center', color: '#64748b' }}>
      Загрузка…
    </div>
  );
}

async function fetchRestaurant(id: string): Promise<PublicRestaurant | null> {
  try {
    return await serverFetch<PublicRestaurant>(`/restaurants/${id}`);
  } catch {
    return null;
  }
}

export default async function RestaurantAccountPageRoute({ params }: RestaurantAccountPageProps) {
  const { id } = await params;
  const restaurant = await fetchRestaurant(id);

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
