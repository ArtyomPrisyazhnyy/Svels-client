const FALLBACK = 'Не удалось выполнить вход. Попробуйте другой способ или позже.';

export function formatGuestOAuthError(_error: unknown): string {
  return FALLBACK;
}
