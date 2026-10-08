import { apiRequest, assertApiResponseOk } from '@/shared/api/api-client';
import { resolveApiUrl } from '@/shared/config/env';
import type { PublicRestaurant } from '@/features/restaurants/types/restaurant';

export function fetchRestaurant(restaurantId: string): Promise<PublicRestaurant> {
  return apiRequest<PublicRestaurant>(`/restaurants/${restaurantId}`);
}

export function updateRestaurant(
  restaurantId: string,
  token: string,
  payload: { logoUrl?: string | null; logoWebpUrl?: string | null },
): Promise<PublicRestaurant> {
  return apiRequest<PublicRestaurant>(`/restaurants/${restaurantId}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });
}

export async function uploadRestaurantLogo(
  restaurantId: string,
  token: string,
  file: File,
): Promise<{ logoUrl: string; logoWebpUrl: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    `${resolveApiUrl()}/restaurants/${restaurantId}/upload-logo`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    },
  );

  if (!response.ok) {
    await assertApiResponseOk(response, { authenticatedRequest: true });
  }

  return response.json() as Promise<{ logoUrl: string; logoWebpUrl: string }>;
}
