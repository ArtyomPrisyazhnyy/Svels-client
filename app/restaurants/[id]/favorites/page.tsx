import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { RestaurantGuestFavoritesPage } from '@/views/RestaurantGuestFavoritesPage';
import {
  getRestaurantMenu,
  getRestaurantPublic,
  getRestaurantStyling,
} from '@/server/restaurant-public';

/** Fallback ISR (сек). */
export const revalidate = 3600;
export const dynamicParams = true;

interface RestaurantFavoritesPageProps {
  params: Promise<{ id: string }>;
}

function PageLoader() {
  return (
    <div className="venue-subpage__main">
      <div className="ui-skeleton" style={{ minHeight: '40vh' }} />
    </div>
  );
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
    <Suspense fallback={<PageLoader />}>
      <RestaurantGuestFavoritesPage
        restaurantId={restaurant.id}
        restaurantName={restaurant.name}
        menu={menu}
      />
    </Suspense>
  );
}
