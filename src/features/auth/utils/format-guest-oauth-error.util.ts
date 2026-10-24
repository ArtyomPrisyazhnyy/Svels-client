const FALLBACK = 'Не удалось выполнить вход. Попробуйте другой способ или позже.';

export function formatGuestOAuthError(error: unknown): string {
  void error;
  return FALLBACK;
}
