import { ApiError, apiRequest } from '@/shared/api/api-client';
import { getOrCreateGuestId } from '@/shared/utils/guest-id';
import { useAuthStore } from '@/store/auth.store';

export type FavoritesListResponse = {
  menuItemIds: string[];
};

/**
 * На публичной странице в избранное ходит гость заведения.
 * Токен админа/сотрудника не отправляем: иначе GET/POST идут в «чужой» аккаунт
 * и затирают гостевые лайки.
 */
function guestAccessToken(): string | undefined {
  const { accessToken, user } = useAuthStore.getState();
  if (!accessToken || user?.role !== 'user') {
    return undefined;
  }
  return accessToken;
}

function guestHeaders(): HeadersInit {
  const guestId = getOrCreateGuestId();
  return guestId ? { 'X-Guest-Id': guestId } : {};
}

async function favoritesRequest(
  path: string,
  options: { method?: 'GET' | 'POST' | 'DELETE'; token?: string } = {},
): Promise<FavoritesListResponse> {
  const headers = guestHeaders();
  const token = options.token;

  try {
    return await apiRequest<FavoritesListResponse>(path, {
      method: options.method,
      token,
      headers,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401 && token) {
      return apiRequest<FavoritesListResponse>(path, {
        method: options.method,
        headers,
      });
    }
    throw error;
  }
}

export function fetchFavorites(restaurantId: string): Promise<FavoritesListResponse> {
  return favoritesRequest(`/restaurants/${restaurantId}/favorites`, {
    token: guestAccessToken(),
  });
}

export function addFavorite(
  restaurantId: string,
  menuItemId: string,
): Promise<FavoritesListResponse> {
  return favoritesRequest(`/restaurants/${restaurantId}/favorites/${menuItemId}`, {
    method: 'POST',
    token: guestAccessToken(),
  });
}

export function removeFavorite(
  restaurantId: string,
  menuItemId: string,
): Promise<FavoritesListResponse> {
  return favoritesRequest(`/restaurants/${restaurantId}/favorites/${menuItemId}`, {
    method: 'DELETE',
    token: guestAccessToken(),
  });
}

export function mergeFavorites(restaurantId: string): Promise<FavoritesListResponse> {
  const token = guestAccessToken();
  if (!token) {
    throw new Error('Требуется авторизация гостя');
  }
  const guestId = getOrCreateGuestId();
  return apiRequest<FavoritesListResponse>(`/restaurants/${restaurantId}/favorites/merge`, {
    method: 'POST',
    token,
    headers: { 'X-Guest-Id': guestId },
    body: JSON.stringify({ guestId }),
  });
}
