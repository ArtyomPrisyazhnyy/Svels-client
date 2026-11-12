import { notFound } from 'next/navigation';
import { VenueGuestSubpageShell } from '@/features/restaurants/components/VenueGuestSubpageShell';
import { RestaurantGuestFavoritesPage } from '@/views/RestaurantGuestFavoritesPage';
import {
  getRestaurantBookingSettings,
  getRestaurantMenu,
  getRestaurantPublic,
  getRestaurantSocialLinks,
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
  const [restaurant, menu, styling, socialLinks, bookingSettings] = await Promise.all([
    getRestaurantPublic(id),
    getRestaurantMenu(id),
    getRestaurantStyling(id),
    getRestaurantSocialLinks(id),
    getRestaurantBookingSettings(id),
  ]);

  if (!restaurant) {
    notFound();
  }

  if (styling.favoritesEnabled === false) {
    notFound();
  }

  const bookingEnabled = bookingSettings.bookingEnabled ?? false;

  return (
    <VenueGuestSubpageShell
      restaurant={restaurant}
      socialLinks={socialLinks}
      bookingEnabled={bookingEnabled}
      favoritesEnabled={true}
      pageClassName="restaurant-favorites-page"
    >
      <RestaurantGuestFavoritesPage
        restaurantId={restaurant.id}
        restaurantName={restaurant.name}
        menu={menu}
      />
    </VenueGuestSubpageShell>
  );
}
