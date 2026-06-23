import { apiRequest } from '../../../shared/api/api-client';
import type {
  CreateMenuItemPayload,
  MenuCategory,
  MenuResponse,
} from '../../../shared/types/menu';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

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
): Promise<{ imageUrl: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/restaurants/${restaurantId}/menu/upload-image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? 'Не удалось загрузить фото');
  }

  return response.json() as Promise<{ imageUrl: string }>;
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
