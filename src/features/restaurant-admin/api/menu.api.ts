import { apiRequest, assertApiResponseOk } from '../../../shared/api/api-client';
import type {
  CreateMenuItemPayload,
  MenuCategory,
  MenuResponse,
  UpdateMenuItemPayload,
} from '../../../shared/types/menu';

import { resolveApiUrl } from '@/shared/config/env';

export function fetchMenu(restaurantId: string): Promise<MenuResponse> {
  return apiRequest<MenuResponse>(`/restaurants/${restaurantId}/menu`);
}

export function createCategory(
  restaurantId: string,
  token: string,
  name: string,
): Promise<MenuCategory> {
  return apiRequest<MenuCategory>(`/restaurants/${restaurantId}/menu/categories`, {
    method: 'POST',
    token,
    body: JSON.stringify({ name }),
  });
}

export function createMenuItem(
  restaurantId: string,
  token: string,
  payload: CreateMenuItemPayload,
): Promise<unknown> {
  return apiRequest(`/restaurants/${restaurantId}/menu/items`, {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export async function uploadMenuImage(
  restaurantId: string,
  token: string,
  file: File,
): Promise<{ imageUrl: string; imageWebpUrl: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${resolveApiUrl()}/restaurants/${restaurantId}/menu/upload-image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    await assertApiResponseOk(response, { authenticatedRequest: true });
  }

  return response.json() as Promise<{ imageUrl: string; imageWebpUrl: string }>;
}

export function updateMenuItem(
  restaurantId: string,
  token: string,
  itemId: string,
  payload: UpdateMenuItemPayload,
): Promise<unknown> {
  return apiRequest(`/restaurants/${restaurantId}/menu/items/${itemId}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });
}

export function deleteMenuItem(
  restaurantId: string,
  token: string,
  itemId: string,
): Promise<void> {
  return apiRequest(`/restaurants/${restaurantId}/menu/items/${itemId}`, {
    method: 'DELETE',
    token,
  });
}
