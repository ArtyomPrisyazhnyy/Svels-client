/** Путь гостевого баланса огонька. Токен передаётся отдельно в apiRequest. */
export function guestLoyaltyMePath(restaurantId: string): string {
  return `/restaurants/${restaurantId}/loyalty/me`;
}

/** Запрос баланса только для вошедшего гостя: без токена эндпоинт отвечает 401. */
export function canFetchGuestLoyaltyBalance(
  enabled: boolean,
  accessToken: string | null | undefined,
): boolean {
  return enabled && Boolean(accessToken);
}
