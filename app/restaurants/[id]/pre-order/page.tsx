import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { RestaurantGuestProtectedRoute } from '@/components/RestaurantGuestProtectedRoute';
import { RestaurantGuestPreOrderPage } from '@/views/RestaurantGuestPreOrderPage';
import type { PublicRestaurant } from '@/features/restaurants/types/restaurant';
import { serverFetch } from '@/shared/api/server-api';

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

async function fetchRestaurant(id: string): Promise<PublicRestaurant | null> {
  try {
    return await serverFetch<PublicRestaurant>(`/restaurants/${id}`);
  } catch {
    return null;
  }
}

export default async function RestaurantPreOrderPageRoute({ params }: RestaurantPreOrderPageProps) {
  const { id } = await params;
  const restaurant = await fetchRestaurant(id);

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
