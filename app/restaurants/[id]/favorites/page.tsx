import { notFound } from 'next/navigation';
import { RestaurantGuestFavoritesPage } from '@/views/RestaurantGuestFavoritesPage';
import {
  getRestaurantMenu,
  getRestaurantPublic,
  getRestaurantStyling,
} from '@/server/restaurant-public';
import { restaurantVenueStaticParams } from '@/server/restaurant-venue-static-params';

/** Fallback ISR (сек). */
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return restaurantVenueStaticParams();
}

interface RestaurantFavoritesPageProps {
  params: Promise<{ id: string }>;
}

export default async function RestaurantFavoritesPageRoute({ params }: RestaurantFavoritesPageProps) {
  const { id } = await params;
  const [restaurant, menu, styling] = await Promise.all([
    getRestaurantPublic(id),
    getRestaurantMenu(id),
    getRestaurantStyling(id),
  ]);

  if (!restaurant) {
    notFound();
  }

  if (styling.favoritesEnabled === false) {
    notFound();
  }

  return (
    <RestaurantGuestFavoritesPage
      restaurantId={restaurant.id}
      restaurantName={restaurant.name}
      menu={menu}
    />
  );
}
