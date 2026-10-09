import { notFound } from 'next/navigation';
import type { PublicRestaurant } from '@/features/restaurants/types/restaurant';
import { RestaurantLegalPage } from '@/views/RestaurantLegalPage';
import type { RestaurantLegalFields } from '@/shared/types/restaurant-legal';
import { serverFetch } from '@/shared/api/server-api';
import '@/views/privacy-policy.scss';

type RestaurantLegalResponse = PublicRestaurant & RestaurantLegalFields;

interface RestaurantLegalRouteProps {
  params: Promise<{ id: string }>;
}

async function fetchRestaurantLegal(id: string): Promise<RestaurantLegalResponse | null> {
  try {
    return await serverFetch<RestaurantLegalResponse>(`/restaurants/${id}`);
  } catch {
    return null;
  }
}

export default async function RestaurantLegalRoute({ params }: RestaurantLegalRouteProps) {
  const { id } = await params;
  const restaurant = await fetchRestaurantLegal(id);

  if (!restaurant) {
    notFound();
  }

  return (
    <RestaurantLegalPage
      restaurantName={restaurant.name}
      legal={{
        legalName: restaurant.legalName ?? null,
        legalAddress: restaurant.legalAddress ?? null,
        contactPhone: restaurant.contactPhone ?? null,
        contactEmail: restaurant.contactEmail ?? null,
        unp: restaurant.unp ?? null,
      }}
      homePath={`/restaurants/${restaurant.id}`}
    />
  );
}
