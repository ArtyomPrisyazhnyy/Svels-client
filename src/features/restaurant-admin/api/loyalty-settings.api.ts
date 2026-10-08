import { apiRequest } from '../../../shared/api/api-client';
import type {
  LoyaltySettings,
  UpdateLoyaltySettingsPayload,
} from '../../../shared/types/loyalty-settings';

export function fetchLoyaltySettings(restaurantId: string): Promise<LoyaltySettings> {
  return apiRequest<LoyaltySettings>(`/restaurants/${restaurantId}/loyalty-settings`);
}

export function updateLoyaltySettings(
  restaurantId: string,
  token: string,
  payload: UpdateLoyaltySettingsPayload,
): Promise<LoyaltySettings> {
  return apiRequest<LoyaltySettings>(`/restaurants/${restaurantId}/loyalty-settings`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });
}
