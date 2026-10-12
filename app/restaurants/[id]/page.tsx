import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RestaurantPublicPage } from '@/features/restaurants/components/RestaurantPublicPage';
import type { PublicRestaurant } from '@/features/restaurants/types/restaurant';
import { serverFetch } from '@/shared/api/server-api';
import { devAwareStaticParams } from '@/shared/utils/dev-static-params.util';
import {
  getRestaurantBookingSettings,
  getRestaurantLoyaltySettings,
  getRestaurantMenu,
  getRestaurantOrderSettings,
  getRestaurantPromoBanners,
  getRestaurantPublic,
  getRestaurantSocialLinks,
  getRestaurantStyling,
} from '@/server/restaurant-public';

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
  const restaurant = await getRestaurantPublic(id);

  if (!restaurant) {
    return { title: 'Заведение не найдено' };
  }

  const description =
    restaurant.description ??
    `Забронируйте стол или оформите предзаказ в ${restaurant.name}. ${restaurant.address}`;

  return {
    title: restaurant.name,
    description,
    openGraph: {
      title: `${restaurant.name} | Svels`,
      description,
      type: 'website',
    },
  };
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { id } = await params;
  const [
    restaurant,
    socialLinks,
    promoBanners,
    menu,
    orderSettings,
    styling,
    bookingSettings,
    loyaltySettings,
  ] = await Promise.all([
    getRestaurantPublic(id),
    getRestaurantSocialLinks(id),
    getRestaurantPromoBanners(id),
    getRestaurantMenu(id),
    getRestaurantOrderSettings(id),
    getRestaurantStyling(id),
    getRestaurantBookingSettings(id),
    getRestaurantLoyaltySettings(id),
  ]);

  if (!restaurant) {
    notFound();
  }

  return (
    <RestaurantPublicPage
      restaurant={restaurant}
      menu={menu}
      orderSettings={orderSettings}
      styling={styling}
      bookingSettings={bookingSettings}
      socialLinks={socialLinks}
      promoBanners={promoBanners}
      loyaltySettings={loyaltySettings}
    />
  );
}
