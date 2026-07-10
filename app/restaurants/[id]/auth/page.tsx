import { notFound } from 'next/navigation';
import { RestaurantGuestAuthRoute } from '@/components/RestaurantGuestAuthRoute';
import type { PublicRestaurant } from '@/features/restaurants/types/restaurant';
import { serverFetch } from '@/shared/api/server-api';

interface RestaurantAuthPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}

async function fetchRestaurant(id: string): Promise<PublicRestaurant | null> {
  try {
    return await serverFetch<PublicRestaurant>(`/restaurants/${id}`);
  } catch {
    return null;
  }
}

export default async function RestaurantAuthPageRoute({
  params,
  searchParams,
}: RestaurantAuthPageProps) {
  const { id } = await params;
  const { from } = await searchParams;
  const restaurant = await fetchRestaurant(id);

  if (!restaurant) {
    notFound();
  }

  return (
    <RestaurantGuestAuthRoute
      restaurantId={restaurant.id}
      restaurantName={restaurant.name}
      redirectFrom={from}
    />
  );
}
