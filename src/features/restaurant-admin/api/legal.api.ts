import { apiRequest } from '../../../shared/api/api-client';
import type { PublicRestaurant } from '@/features/restaurants/types/restaurant';
import type {
  RestaurantLegalFields,
  UpdateRestaurantLegalPayload,
} from '../../../shared/types/restaurant-legal';

export type RestaurantWithLegal = PublicRestaurant & RestaurantLegalFields;

export function fetchRestaurantLegal(restaurantId: string): Promise<RestaurantWithLegal> {
  return apiRequest<RestaurantWithLegal>(`/restaurants/${restaurantId}`);
}

export function updateRestaurantLegal(
  restaurantId: string,
  token: string,
  payload: UpdateRestaurantLegalPayload,
): Promise<RestaurantWithLegal> {
  return apiRequest<RestaurantWithLegal>(`/restaurants/${restaurantId}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });
}
