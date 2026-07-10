import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RestaurantPublicPage } from '@/features/restaurants/components/RestaurantPublicPage';
import type { PublicRestaurant } from '@/features/restaurants/types/restaurant';
import type { MenuResponse } from '@/shared/types/menu';
import type { RestaurantOrderSettings } from '@/shared/types/order-settings';
import type { RestaurantStyling } from '@/shared/types/restaurant-styling';
import type { BookingSettings } from '@/shared/types/booking-settings';
import { DEFAULT_BOOKING_SETTINGS } from '@/shared/types/booking-settings';
import type { SocialLink } from '@/shared/types/social-link';
import { createDefaultRestaurantStyling } from '@/shared/types/restaurant-styling';
import { serverFetch, type ServerFetchOptions } from '@/shared/api/server-api';
import {
  RESTAURANT_PUBLIC_REVALIDATE_SECONDS,
  restaurantPublicPageTag,
} from '@/shared/cache/restaurant-public-cache';
import { devAwareStaticParams } from '@/shared/utils/dev-static-params.util';

/** Fallback ISR (сек). Должен быть литералом — см. publicPageFetchOptions ниже. */
export const revalidate = 3600;
export const dynamicParams = true;

interface RestaurantPageProps {
  params: Promise<{ id: string }>;
}

const DEFAULT_ORDER_SETTINGS = (restaurantId: string): RestaurantOrderSettings => ({
  restaurantId,
  fulfillmentDelivery: false,
  fulfillmentTakeaway: true,
  fulfillmentDineIn: true,
  paymentCash: true,
  paymentCardOnSite: true,
  paymentOnline: true,
  updatedAt: new Date().toISOString(),
});

const EMPTY_MENU: MenuResponse = { categories: [] };

function publicPageFetchOptions(restaurantId: string): ServerFetchOptions {
  return {
    revalidate: RESTAURANT_PUBLIC_REVALIDATE_SECONDS,
    tags: [restaurantPublicPageTag(restaurantId)],
  };
}

async function fetchRestaurant(id: string): Promise<PublicRestaurant | null> {
  try {
    return await serverFetch<PublicRestaurant>(
      `/restaurants/${id}`,
      undefined,
      publicPageFetchOptions(id),
    );
  } catch {
    return null;
  }
}

async function fetchMenu(restaurantId: string): Promise<MenuResponse> {
  try {
    return await serverFetch<MenuResponse>(
      `/restaurants/${restaurantId}/menu`,
      undefined,
      publicPageFetchOptions(restaurantId),
    );
  } catch {
    return EMPTY_MENU;
  }
}

async function fetchOrderSettings(restaurantId: string): Promise<RestaurantOrderSettings> {
  try {
    return await serverFetch<RestaurantOrderSettings>(
      `/restaurants/${restaurantId}/order-settings`,
      undefined,
      publicPageFetchOptions(restaurantId),
    );
  } catch {
    return DEFAULT_ORDER_SETTINGS(restaurantId);
  }
}

export async function generateStaticParams() {
  return devAwareStaticParams(async () => {
    const restaurants = await serverFetch<PublicRestaurant[]>('/restaurants');
    return restaurants.map((restaurant) => ({ id: restaurant.id }));
  });
}

export async function generateMetadata({ params }: RestaurantPageProps): Promise<Metadata> {
  const { id } = await params;
  const restaurant = await fetchRestaurant(id);

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

async function fetchStyling(restaurantId: string): Promise<RestaurantStyling> {
  try {
    return await serverFetch<RestaurantStyling>(
      `/restaurants/${restaurantId}/styling`,
      undefined,
      publicPageFetchOptions(restaurantId),
    );
  } catch {
    return createDefaultRestaurantStyling(restaurantId);
  }
}

async function fetchSocialLinks(restaurantId: string): Promise<SocialLink[]> {
  try {
    return await serverFetch<SocialLink[]>(
      `/restaurants/${restaurantId}/social-links`,
      undefined,
      publicPageFetchOptions(restaurantId),
    );
  } catch {
    return [];
  }
}

async function fetchBookingSettings(restaurantId: string): Promise<BookingSettings> {
  try {
    return await serverFetch<BookingSettings>(
      `/restaurants/${restaurantId}/booking-settings`,
      undefined,
      publicPageFetchOptions(restaurantId),
    );
  } catch {
    return { restaurantId, ...DEFAULT_BOOKING_SETTINGS, updatedAt: new Date().toISOString() };
  }
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { id } = await params;
  const [restaurant, socialLinks, menu, orderSettings, styling, bookingSettings] = await Promise.all([
    fetchRestaurant(id),
    fetchSocialLinks(id),
    fetchMenu(id),
    fetchOrderSettings(id),
    fetchStyling(id),
    fetchBookingSettings(id),
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
    />
  );
}
