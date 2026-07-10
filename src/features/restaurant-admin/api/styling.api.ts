import { apiRequest } from '@/shared/api/api-client';
import type {
  RestaurantStyling,
  UpdateRestaurantStylingPayload,
} from '@/shared/types/restaurant-styling';

export function fetchRestaurantStyling(restaurantId: string): Promise<RestaurantStyling> {
  return apiRequest<RestaurantStyling>(`/restaurants/${restaurantId}/styling`);
}

export function updateRestaurantStyling(
  restaurantId: string,
  token: string,
  payload: UpdateRestaurantStylingPayload,
): Promise<RestaurantStyling> {
  return apiRequest<RestaurantStyling>(`/restaurants/${restaurantId}/styling`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });
}
