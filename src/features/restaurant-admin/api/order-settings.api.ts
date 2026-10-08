import { apiRequest } from '../../../shared/api/api-client';
import type {
  RestaurantOrderSettings,
  SetOrdersPausedPayload,
  UpdateRestaurantOrderSettingsPayload,
} from '../../../shared/types/order-settings';

export function fetchOrderSettings(restaurantId: string): Promise<RestaurantOrderSettings> {
  return apiRequest<RestaurantOrderSettings>(`/restaurants/${restaurantId}/order-settings`);
}

export function updateOrderSettings(
  restaurantId: string,
  token: string,
  payload: UpdateRestaurantOrderSettingsPayload,
): Promise<RestaurantOrderSettings> {
  return apiRequest<RestaurantOrderSettings>(`/restaurants/${restaurantId}/order-settings`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });
}

export function setOrdersPaused(
  restaurantId: string,
  token: string,
  payload: SetOrdersPausedPayload,
): Promise<RestaurantOrderSettings> {
  return apiRequest<RestaurantOrderSettings>(
    `/restaurants/${restaurantId}/order-settings/pause`,
    {
      method: 'PATCH',
      token,
      body: JSON.stringify(payload),
    },
  );
}
