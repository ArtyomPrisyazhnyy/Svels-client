import { ApiError } from '@/shared/api/api-client';
import { classifyError } from './classify';
import { GENERIC_ERROR_COPY, NETWORK_ERROR_COPY } from './messages';

const CLIENT_FALLBACK = 'Не удалось выполнить действие. Проверьте данные и попробуйте ещё раз.';

export function getUserFacingErrorMessage(error: unknown, fallback = GENERIC_ERROR_COPY.title): string {
  const kind = classifyError(error);

  if (kind === 'network') {
    return NETWORK_ERROR_COPY.title;
  }

  if (kind === 'server' || kind === 'crash') {
    return GENERIC_ERROR_COPY.title;
  }

  if (error instanceof ApiError) {
    if (error.status === 401) {
      return error.message;
    }
    return CLIENT_FALLBACK;
  }

  return fallback;
}
