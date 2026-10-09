import { ApiError } from '@/shared/api/api-client';

/** Коды ошибок `POST /auth/set-password` (W2-B-ONB, см. docs/onboarding.md на бэкенде). */
const SET_PASSWORD_CODE_MESSAGES: Record<string, string> = {
  INVALID_SET_PASSWORD_TOKEN: 'Ссылка недействительна',
  SET_PASSWORD_TOKEN_EXPIRED: 'Срок действия ссылки истёк',
  SET_PASSWORD_TOKEN_USED: 'Ссылка уже была использована',
};

export function formatSetPasswordError(
  err: unknown,
  fallback = 'Не удалось установить пароль',
): string {
  if (err instanceof ApiError) {
    if (err.code && SET_PASSWORD_CODE_MESSAGES[err.code]) {
      return SET_PASSWORD_CODE_MESSAGES[err.code];
    }
    return err.message || fallback;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return fallback;
}
