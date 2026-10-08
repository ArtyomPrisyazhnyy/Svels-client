import { apiRequest } from '../../../shared/api/api-client';
import type {
  CreateRestaurantLocationPayload,
  RestaurantLocation,
  UpdateRestaurantLocationPayload,
} from '../../../shared/types/restaurant-location';

export function fetchRestaurantLocations(
  restaurantId: string,
): Promise<RestaurantLocation[]> {
  return apiRequest<RestaurantLocation[]>(`/restaurants/${restaurantId}/locations`);
}

export function geocodeRestaurantLocation(
  restaurantId: string,
  token: string,
  query: string,
): Promise<{ lat: number; lng: number }> {
  const params = new URLSearchParams({ q: query });
  return apiRequest<{ lat: number; lng: number }>(
    `/restaurants/${restaurantId}/locations/geocode?${params.toString()}`,
    { token },
  );
}

export function createRestaurantLocation(
  restaurantId: string,
  token: string,
  payload: CreateRestaurantLocationPayload,
): Promise<RestaurantLocation> {
  return apiRequest<RestaurantLocation>(`/restaurants/${restaurantId}/locations`, {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export function updateRestaurantLocation(
  restaurantId: string,
  token: string,
  locationId: string,
  payload: UpdateRestaurantLocationPayload,
): Promise<RestaurantLocation> {
  return apiRequest<RestaurantLocation>(
    `/restaurants/${restaurantId}/locations/${locationId}`,
    {
      method: 'PATCH',
      token,
      body: JSON.stringify(payload),
    },
  );
}

export function deleteRestaurantLocation(
  restaurantId: string,
  token: string,
  locationId: string,
): Promise<void> {
  return apiRequest(`/restaurants/${restaurantId}/locations/${locationId}`, {
    method: 'DELETE',
    token,
  });
}
