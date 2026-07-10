import { apiRequest } from '../../../shared/api/api-client';
import type { MenuResponse } from '../../../shared/types/menu';
import type { RestaurantOrderSettings } from '../../../shared/types/order-settings';
import type { RestaurantStyling } from '../../../shared/types/restaurant-styling';
import { createDefaultRestaurantStyling } from '../../../shared/types/restaurant-styling';
import type { PublicRestaurant } from '../../restaurants/types/restaurant';
import { fetchSocialLinks } from './social-links.api';
import { fetchRestaurantStyling } from './styling.api';

export async function fetchRestaurantPreview(restaurantId: string) {
  const [restaurant, socialLinks, menu, orderSettings, styling] = await Promise.all([
    apiRequest<PublicRestaurant>(`/restaurants/${restaurantId}`),
    fetchSocialLinks(restaurantId),
    apiRequest<MenuResponse>(`/restaurants/${restaurantId}/menu`).catch(() => ({
      categories: [],
    })),
    apiRequest<RestaurantOrderSettings>(`/restaurants/${restaurantId}/order-settings`).catch(
      () => ({
        restaurantId,
        fulfillmentDelivery: false,
        fulfillmentTakeaway: true,
        fulfillmentDineIn: true,
        paymentCash: true,
        paymentCardOnSite: true,
        paymentOnline: true,
        updatedAt: new Date().toISOString(),
      }),
    ),
    fetchRestaurantStyling(restaurantId).catch(() => createDefaultRestaurantStyling(restaurantId)),
  ]);

  return { restaurant, socialLinks, menu, orderSettings, styling };
}
