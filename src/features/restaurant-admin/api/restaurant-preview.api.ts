import { apiRequest } from '../../../shared/api/api-client';
import type { MenuResponse } from '../../../shared/types/menu';
import type { RestaurantOrderSettings } from '../../../shared/types/order-settings';
import type { RestaurantStyling } from '../../../shared/types/restaurant-styling';
import { createDefaultRestaurantStyling } from '../../../shared/types/restaurant-styling';
import {
  DEFAULT_LOYALTY_SETTINGS,
  type LoyaltySettings,
} from '../../../shared/types/loyalty-settings';
import type { PromoBanner } from '../../../shared/types/promo-banner';
import type { PublicRestaurant } from '../../restaurants/types/restaurant';
import { fetchLoyaltySettings } from './loyalty-settings.api';
import { fetchActivePromoBanners } from './promo-banners.api';
import { fetchSocialLinks } from './social-links.api';
import { fetchRestaurantStyling } from './styling.api';

export async function fetchRestaurantPreview(restaurantId: string) {
  const [restaurant, socialLinks, promoBanners, menu, orderSettings, styling, loyaltySettings] =
    await Promise.all([
      apiRequest<PublicRestaurant>(`/restaurants/${restaurantId}`),
      fetchSocialLinks(restaurantId),
      fetchActivePromoBanners(restaurantId).catch((): PromoBanner[] => []),
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
          deliveryForSomeoneElse: false,
          updatedAt: new Date().toISOString(),
        }),
      ),
      fetchRestaurantStyling(restaurantId).catch(() => createDefaultRestaurantStyling(restaurantId)),
      fetchLoyaltySettings(restaurantId).catch(
        (): LoyaltySettings => ({
          restaurantId,
          ...DEFAULT_LOYALTY_SETTINGS,
          updatedAt: new Date().toISOString(),
        }),
      ),
    ]);

  return {
    restaurant,
    socialLinks,
    promoBanners,
    menu,
    orderSettings,
    styling,
    loyaltySettings,
  };
}
