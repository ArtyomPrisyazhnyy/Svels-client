import { apiRequest } from '@/shared/api/api-client';
import type {
  RestaurantPaymentSettings,
  UpdateRestaurantPaymentSettingsPayload,
} from '@/shared/types/payment-settings';

export function fetchPaymentSettings(
  restaurantId: string,
  token: string,
): Promise<RestaurantPaymentSettings> {
  return apiRequest<RestaurantPaymentSettings>(
    `/restaurants/${restaurantId}/payment-settings`,
    { method: 'GET', token },
  );
}

export function updatePaymentSettings(
  restaurantId: string,
  token: string,
  payload: UpdateRestaurantPaymentSettingsPayload,
): Promise<RestaurantPaymentSettings> {
  return apiRequest<RestaurantPaymentSettings>(
    `/restaurants/${restaurantId}/payment-settings`,
    {
      method: 'PATCH',
      token,
      body: JSON.stringify(payload),
    },
  );
}
