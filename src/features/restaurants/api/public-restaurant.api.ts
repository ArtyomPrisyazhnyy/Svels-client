import { apiRequest } from '@/shared/api/api-client';
import type { MenuResponse } from '@/shared/types/menu';
import type { RestaurantOrderSettings } from '@/shared/types/order-settings';

export function fetchPublicMenu(restaurantId: string): Promise<MenuResponse> {
  return apiRequest<MenuResponse>(`/restaurants/${restaurantId}/menu`);
}

export function fetchPublicOrderSettings(
  restaurantId: string,
): Promise<RestaurantOrderSettings> {
  return apiRequest<RestaurantOrderSettings>(`/restaurants/${restaurantId}/order-settings`);
}
