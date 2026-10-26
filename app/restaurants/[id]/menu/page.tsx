import type { Metadata } from 'next';
import { buildVenuePageMetadata, getPlatformOrigin } from '@/features/restaurants/seo/venue-seo';
import { RestaurantVenueDocument } from '@/server/restaurant-venue-document';
import { getRestaurantMenu, getRestaurantPublic } from '@/server/restaurant-public';
import { restaurantVenueStaticParams } from '@/server/restaurant-venue-static-params';

/** Fallback ISR (сек). Должен быть литералом — см. server/restaurant-public. */
export const revalidate = 3600;
export const dynamicParams = true;

interface RestaurantMenuPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return restaurantVenueStaticParams();
}

export async function generateMetadata({ params }: RestaurantMenuPageProps): Promise<Metadata> {
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
    page: 'menu',
  });
}

export default async function RestaurantMenuPage({ params }: RestaurantMenuPageProps) {
  const { id } = await params;
  return <RestaurantVenueDocument id={id} page="menu" />;
}
