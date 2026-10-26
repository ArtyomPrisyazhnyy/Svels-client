import { notFound } from 'next/navigation';
import { RestaurantPublicPage } from '@/features/restaurants/components/RestaurantPublicPage';
import { VenueJsonLd } from '@/features/restaurants/seo/VenueJsonLd';
import { buildVenueJsonLd, getPlatformOrigin, type VenueSeoPage } from '@/features/restaurants/seo/venue-seo';
import {
  getRestaurantBookingSettings,
  getRestaurantLocations,
  getRestaurantLoyaltySettings,
  getRestaurantMenu,
  getRestaurantOrderSettings,
  getRestaurantPromoBanners,
  getRestaurantPublic,
  getRestaurantSchedules,
  getRestaurantSocialLinks,
  getRestaurantStyling,
} from '@/server/restaurant-public';

export async function RestaurantVenueDocument({
  id,
  page,
}: {
  id: string;
  page: VenueSeoPage;
}) {
  const [
    restaurant,
    socialLinks,
    promoBanners,
    menu,
    orderSettings,
    styling,
    bookingSettings,
    loyaltySettings,
    locations,
    schedules,
  ] = await Promise.all([
    getRestaurantPublic(id),
    getRestaurantSocialLinks(id),
    getRestaurantPromoBanners(id),
    getRestaurantMenu(id),
    getRestaurantOrderSettings(id),
    getRestaurantStyling(id),
    getRestaurantBookingSettings(id),
    getRestaurantLoyaltySettings(id),
    getRestaurantLocations(id),
    getRestaurantSchedules(id),
  ]);

  if (!restaurant) {
    notFound();
  }

  const jsonLd = buildVenueJsonLd({
    restaurant,
    menu,
    locations,
    schedules,
    platformOrigin: getPlatformOrigin(),
  });

  return (
    <>
      <VenueJsonLd data={jsonLd} />
      <RestaurantPublicPage
        restaurant={restaurant}
        menu={menu}
        orderSettings={orderSettings}
        styling={styling}
        bookingSettings={bookingSettings}
        socialLinks={socialLinks}
        promoBanners={promoBanners}
        loyaltySettings={loyaltySettings}
        pageTitle={page === 'menu' ? `Меню — ${restaurant.name}` : undefined}
      />
    </>
  );
}
