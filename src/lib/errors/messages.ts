import type { ErrorKind } from './classify';

export interface FriendlyErrorCopy {
  title: string;
  description: string;
  retryLabel: string;
}

const RETRY_LABEL = 'Повторить';

export const NETWORK_ERROR_COPY: FriendlyErrorCopy = {
  title: 'Нет подключения к интернету',
  description: 'Проверьте соединение и попробуйте ещё раз',
  retryLabel: RETRY_LABEL,
};

export const GENERIC_ERROR_COPY: FriendlyErrorCopy = {
  title: 'Что-то пошло не так',
  description: 'Мы уже знаем о проблеме и исправляем её',
  retryLabel: RETRY_LABEL,
};

export function getFriendlyErrorCopy(kind: ErrorKind): FriendlyErrorCopy {
  if (kind === 'network') {
    return NETWORK_ERROR_COPY;
  }

  return GENERIC_ERROR_COPY;
}
