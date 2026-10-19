import { ApiError } from '@/shared/api/api-client';

const FALLBACK = 'Не удалось выполнить вход. Попробуйте другой способ или позже.';

function isInternalServerMessage(message: string): boolean {
  const normalized = message.trim().toLowerCase();
  return (
    normalized.includes('internal server error') ||
    normalized === 'internal server error' ||
    normalized.includes('ошибка сервера')
  );
}

export function formatGuestOAuthError(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return FALLBACK;
  }

  if (error.status === 400 || error.status === 403) {
    const message = error.message?.trim();
    if (!message || isInternalServerMessage(message)) {
      return FALLBACK;
    }
    return message;
  }

  return FALLBACK;
}
