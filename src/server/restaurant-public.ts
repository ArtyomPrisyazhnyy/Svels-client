import { cache } from 'react';
import type { PublicRestaurant } from '@/features/restaurants/types/restaurant';
import type { MenuResponse } from '@/shared/types/menu';
import type { RestaurantOrderSettings } from '@/shared/types/order-settings';
import type { RestaurantStyling } from '@/shared/types/restaurant-styling';
import type { BookingAvailability } from '@/shared/types/booking';
import type { BookingSettings } from '@/shared/types/booking-settings';
import { DEFAULT_BOOKING_SETTINGS } from '@/shared/types/booking-settings';
import type { SocialLink } from '@/shared/types/social-link';
import type { PromoBanner } from '@/shared/types/promo-banner';
import {
  DEFAULT_LOYALTY_SETTINGS,
  type LoyaltySettings,
} from '@/shared/types/loyalty-settings';
import { createDefaultRestaurantStyling } from '@/shared/types/restaurant-styling';
import { serverFetch, type ServerFetchOptions } from '@/shared/api/server-api';
import {
  RESTAURANT_PUBLIC_REVALIDATE_SECONDS,
  restaurantPublicPageTag,
} from '@/shared/cache/restaurant-public-cache';

const EMPTY_MENU: MenuResponse = { categories: [] };

export function publicPageFetchOptions(restaurantId: string): ServerFetchOptions {
  return {
    revalidate: RESTAURANT_PUBLIC_REVALIDATE_SECONDS,
    tags: [restaurantPublicPageTag(restaurantId)],
  };
}

const DEFAULT_ORDER_SETTINGS = (restaurantId: string): RestaurantOrderSettings => ({
  restaurantId,
  fulfillmentDelivery: false,
  fulfillmentTakeaway: true,
  fulfillmentDineIn: true,
  paymentCash: true,
  paymentCardOnSite: true,
  paymentOnline: true,
  deliveryForSomeoneElse: false,
  updatedAt: new Date().toISOString(),
});

export const getRestaurantPublic = cache(async (id: string): Promise<PublicRestaurant | null> => {
  try {
    return await serverFetch<PublicRestaurant>(
      `/restaurants/${id}`,
      undefined,
      publicPageFetchOptions(id),
    );
  } catch {
    return null;
  }
});

export const getRestaurantStyling = cache(async (restaurantId: string): Promise<RestaurantStyling> => {
  try {
    return await serverFetch<RestaurantStyling>(
      `/restaurants/${restaurantId}/styling`,
      undefined,
      publicPageFetchOptions(restaurantId),
    );
  } catch {
    return createDefaultRestaurantStyling(restaurantId);
  }
});

export const getRestaurantMenu = cache(async (restaurantId: string): Promise<MenuResponse> => {
  try {
    return await serverFetch<MenuResponse>(
      `/restaurants/${restaurantId}/menu`,
      undefined,
      publicPageFetchOptions(restaurantId),
    );
  } catch {
    return EMPTY_MENU;
  }
});

export const getRestaurantOrderSettings = cache(
  async (restaurantId: string): Promise<RestaurantOrderSettings> => {
    try {
      return await serverFetch<RestaurantOrderSettings>(
        `/restaurants/${restaurantId}/order-settings`,
        undefined,
        publicPageFetchOptions(restaurantId),
      );
    } catch {
      return DEFAULT_ORDER_SETTINGS(restaurantId);
    }
  },
);

export const getRestaurantBookingAvailability = cache(
  async (restaurantId: string, date: string): Promise<BookingAvailability | null> => {
    try {
      return await serverFetch<BookingAvailability>(
        `/restaurants/${restaurantId}/bookings/availability?date=${encodeURIComponent(date)}`,
        undefined,
        publicPageFetchOptions(restaurantId),
      );
    } catch {
      return null;
    }
  },
);

export const getRestaurantBookingSettings = cache(
  async (restaurantId: string): Promise<BookingSettings> => {
    try {
      return await serverFetch<BookingSettings>(
        `/restaurants/${restaurantId}/booking-settings`,
        undefined,
        publicPageFetchOptions(restaurantId),
      );
    } catch {
      return {
        restaurantId,
        ...DEFAULT_BOOKING_SETTINGS,
        updatedAt: new Date().toISOString(),
      };
    }
  },
);

export const getRestaurantLoyaltySettings = cache(
  async (restaurantId: string): Promise<LoyaltySettings> => {
    try {
      return await serverFetch<LoyaltySettings>(
        `/restaurants/${restaurantId}/loyalty-settings`,
        undefined,
        publicPageFetchOptions(restaurantId),
      );
    } catch {
      return {
        restaurantId,
        ...DEFAULT_LOYALTY_SETTINGS,
        updatedAt: new Date().toISOString(),
      };
    }
  },
);

export const getRestaurantSocialLinks = cache(async (restaurantId: string): Promise<SocialLink[]> => {
  try {
    return await serverFetch<SocialLink[]>(
      `/restaurants/${restaurantId}/social-links`,
      undefined,
      publicPageFetchOptions(restaurantId),
    );
  } catch {
    return [];
  }
});

export const getRestaurantPromoBanners = cache(async (restaurantId: string): Promise<PromoBanner[]> => {
  try {
    return await serverFetch<PromoBanner[]>(
      `/restaurants/${restaurantId}/promo-banners/active`,
      undefined,
      publicPageFetchOptions(restaurantId),
    );
  } catch {
    return [];
  }
});
