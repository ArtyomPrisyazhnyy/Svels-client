import { RestaurantGuestProtectedRoute } from '@/components/RestaurantGuestProtectedRoute';
import { GuestAccountPageSkeleton } from '@/features/restaurants/components/guest-page-skeletons/GuestPageSkeletons';
import { VenueGuestSubpageShell } from '@/features/restaurants/components/VenueGuestSubpageShell';
import { RestaurantGuestAccountPage } from '@/views/RestaurantGuestAccountPage';
import {
  getRestaurantBookingSettings,
  getRestaurantPublic,
  getRestaurantSocialLinks,
  getRestaurantStyling,
} from '@/server/restaurant-public';
import { restaurantVenueStaticParams } from '@/server/restaurant-venue-static-params';
import { notFound } from 'next/navigation';

/** Fallback ISR (сек). */
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return restaurantVenueStaticParams();
}

interface RestaurantAccountPageProps {
  params: Promise<{ id: string }>;
}

export default async function RestaurantAccountPageRoute({ params }: RestaurantAccountPageProps) {
  const { id } = await params;
  const [restaurant, socialLinks, bookingSettings, styling] = await Promise.all([
    getRestaurantPublic(id),
    getRestaurantSocialLinks(id),
    getRestaurantBookingSettings(id),
    getRestaurantStyling(id),
  ]);

  if (!restaurant) {
    notFound();
  }

  const favoritesEnabled = styling.favoritesEnabled !== false;
  const bookingEnabled = bookingSettings.bookingEnabled ?? false;

  return (
    <VenueGuestSubpageShell
      restaurant={restaurant}
      socialLinks={socialLinks}
      bookingEnabled={bookingEnabled}
      favoritesEnabled={favoritesEnabled}
      pageClassName="restaurant-guest-account"
    >
      <RestaurantGuestProtectedRoute
        restaurantId={restaurant.id}
        fallback={<GuestAccountPageSkeleton />}
      >
        <RestaurantGuestAccountPage
          restaurantId={restaurant.id}
          restaurantName={restaurant.name}
        />
      </RestaurantGuestProtectedRoute>
    </VenueGuestSubpageShell>
  );
}
