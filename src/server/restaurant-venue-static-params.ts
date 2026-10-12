import type { PublicRestaurant } from '@/features/restaurants/types/restaurant';
import { serverFetch } from '@/shared/api/server-api';
import { devAwareStaticParams } from '@/shared/utils/dev-static-params.util';

/** Shared `generateStaticParams` for all `/restaurants/[id]/*` venue routes. */
export async function restaurantVenueStaticParams() {
  return devAwareStaticParams(async () => {
    const restaurants = await serverFetch<PublicRestaurant[]>('/restaurants');
    return restaurants.map((restaurant) => ({ id: restaurant.id }));
  });
}
