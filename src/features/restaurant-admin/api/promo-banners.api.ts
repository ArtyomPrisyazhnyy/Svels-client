import { apiRequest, assertApiResponseOk } from '@/shared/api/api-client';
import { resolveApiUrl } from '@/shared/config/env';
import type {
  CreatePromoBannerPayload,
  PromoBanner,
  UpdatePromoBannerPayload,
} from '@/shared/types/promo-banner';

export function fetchPromoBanners(restaurantId: string): Promise<PromoBanner[]> {
  return apiRequest<PromoBanner[]>(`/restaurants/${restaurantId}/promo-banners`);
}

export function fetchActivePromoBanners(restaurantId: string): Promise<PromoBanner[]> {
  return apiRequest<PromoBanner[]>(`/restaurants/${restaurantId}/promo-banners/active`);
}

export function createPromoBanner(
  restaurantId: string,
  token: string,
  payload: CreatePromoBannerPayload,
): Promise<PromoBanner> {
  return apiRequest<PromoBanner>(`/restaurants/${restaurantId}/promo-banners`, {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export function updatePromoBanner(
  restaurantId: string,
  token: string,
  bannerId: string,
  payload: UpdatePromoBannerPayload,
): Promise<PromoBanner> {
  return apiRequest<PromoBanner>(`/restaurants/${restaurantId}/promo-banners/${bannerId}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });
}

export function deletePromoBanner(
  restaurantId: string,
  token: string,
  bannerId: string,
): Promise<void> {
  return apiRequest(`/restaurants/${restaurantId}/promo-banners/${bannerId}`, {
    method: 'DELETE',
    token,
  });
}

export async function uploadPromoBannerImage(
  restaurantId: string,
  token: string,
  file: File,
): Promise<{ imageUrl: string; imageWebpUrl: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    `${resolveApiUrl()}/restaurants/${restaurantId}/promo-banners/upload-image`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    },
  );

  if (!response.ok) {
    await assertApiResponseOk(response, { authenticatedRequest: true });
  }

  return response.json() as Promise<{ imageUrl: string; imageWebpUrl: string }>;
}
