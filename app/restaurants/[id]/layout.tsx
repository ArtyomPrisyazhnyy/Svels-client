import { notFound } from 'next/navigation';
import { RestaurantStylingShell } from '@/features/restaurants/context/RestaurantStylingContext';
import { VenueOverlayProvider } from '@/features/restaurants/context/VenueOverlayContext';
import { VenueHeader } from '@/shared/ui/VenueHeader/VenueHeader';
import {
  getRestaurantBookingSettings,
  getRestaurantLoyaltySettings,
  getRestaurantOrderSettings,
  getRestaurantPublic,
  getRestaurantStyling,
} from '@/server/restaurant-public';
import '@/features/restaurants/styles/venue-layout.scss';

/** Fallback ISR (сек). Должен совпадать с дочерними страницами. */
export const revalidate = 3600;
export const dynamicParams = true;

interface RestaurantVenueLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function RestaurantVenueLayout({
  children,
  params,
}: RestaurantVenueLayoutProps) {
  const { id } = await params;
  const [restaurant, styling, loyaltySettings, orderSettings, bookingSettings] =
    await Promise.all([
      getRestaurantPublic(id),
      getRestaurantStyling(id),
      getRestaurantLoyaltySettings(id),
      getRestaurantOrderSettings(id),
      getRestaurantBookingSettings(id),
    ]);

  if (!restaurant) {
    notFound();
  }

  const favoritesEnabled = styling.favoritesEnabled !== false;
  const bookingEnabled = bookingSettings.bookingEnabled ?? false;

  return (
    <RestaurantStylingShell styling={styling}>
      <VenueOverlayProvider
        restaurantId={restaurant.id}
        restaurantName={restaurant.name}
        orderSettings={orderSettings}
        bookingEnabled={bookingEnabled}
        loyaltySettings={loyaltySettings}
      >
        <div className="venue-layout" data-testid="venue-layout">
          <VenueHeader
            restaurantId={restaurant.id}
            restaurantName={restaurant.name}
            logoUrl={restaurant.logoUrl}
            logoWebpUrl={restaurant.logoWebpUrl}
            flameDisplayEnabled={loyaltySettings.flameDisplayEnabled ?? false}
            favoritesEnabled={favoritesEnabled}
          />
          <div className="venue-layout__content">{children}</div>
        </div>
      </VenueOverlayProvider>
    </RestaurantStylingShell>
  );
}
