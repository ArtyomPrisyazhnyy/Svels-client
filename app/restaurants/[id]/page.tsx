import type { Metadata } from 'next';
import { buildVenuePageMetadata, getPlatformOrigin } from '@/features/restaurants/seo/venue-seo';
import type { PublicRestaurant } from '@/features/restaurants/types/restaurant';
import { serverFetch } from '@/shared/api/server-api';
import { devAwareStaticParams } from '@/shared/utils/dev-static-params.util';
import { RestaurantVenueDocument } from '@/server/restaurant-venue-document';
import { getRestaurantMenu, getRestaurantPublic } from '@/server/restaurant-public';

/** Fallback ISR (сек). Должен быть литералом — см. server/restaurant-public. */
export const revalidate = 3600;
export const dynamicParams = true;

interface RestaurantPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return devAwareStaticParams(async () => {
    const restaurants = await serverFetch<PublicRestaurant[]>('/restaurants');
    return restaurants.map((restaurant) => ({ id: restaurant.id }));
  });
}

export async function generateMetadata({ params }: RestaurantPageProps): Promise<Metadata> {
  const { id } = await params;
  const [restaurant, menu] = await Promise.all([getRestaurantPublic(id), getRestaurantMenu(id)]);

  if (!restaurant) {
    return { title: 'Заведение не найдено' };
  }

  return buildVenuePageMetadata({
    restaurant,
    menu,
    locations: [],
    schedules: [],
    platformOrigin: getPlatformOrigin(),
    page: 'venue',
  });
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { id } = await params;
  return <RestaurantVenueDocument id={id} page="venue" />;
}
