import { apiRequest } from '../../../shared/api/api-client';

export interface RestaurantLocationPayload {
  label?: string;
  address: string;
}

export interface RegisterRestaurantPayload {
  name: string;
  unp: string;
  description?: string;
  isChain: boolean;
  locations: RestaurantLocationPayload[];
}

export function registerRestaurant(
  token: string,
  payload: RegisterRestaurantPayload,
): Promise<{ id: string; status: string }> {
  return apiRequest('/restaurants/register', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}
