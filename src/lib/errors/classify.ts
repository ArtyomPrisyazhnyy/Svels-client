import { ApiError } from '@/shared/api/api-client';

export type ErrorKind = 'network' | 'server' | 'client' | 'crash';

export const API_REQUEST_TIMEOUT_MS = 15_000;

export const API_REQUEST_TIMEOUT_ERROR_NAME = 'ApiRequestTimeoutError';

const NETWORK_FETCH_MESSAGES = [
  'failed to fetch',
  'networkerror',
  'load failed',
  'network request failed',
] as const;

export interface ClassifyErrorContext {
  status?: number;
  /** When true, treat as offline regardless of `navigator`. */
  offline?: boolean;
}

export function isApiRequestTimeoutError(error: unknown): boolean {
  return error instanceof Error && error.name === API_REQUEST_TIMEOUT_ERROR_NAME;
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

function isOffline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine === false;
}

function isNetworkTypeError(error: Error): boolean {
  if (error.name !== 'TypeError') {
    return false;
  }
  const normalized = error.message.toLowerCase();
  return NETWORK_FETCH_MESSAGES.some((fragment) => normalized.includes(fragment));
}

export function classifyError(error: unknown, context: ClassifyErrorContext = {}): ErrorKind {
  const statusFromContext = context.status;
  const statusFromApi = error instanceof ApiError ? error.status : undefined;
  const status = statusFromContext ?? statusFromApi;

  if (context.offline === true || isOffline()) {
    return 'network';
  }

  if (status === 0) {
    return 'network';
  }

  if (status !== undefined && status >= 500) {
    return 'server';
  }

  if (status !== undefined && status >= 400 && status < 500) {
    return 'client';
  }

  if (isApiRequestTimeoutError(error)) {
    return 'network';
  }

  if (isAbortError(error)) {
    const marked = error as Error & { apiRequestTimeout?: boolean };
    if (marked.apiRequestTimeout) {
      return 'network';
    }
  }

  if (error instanceof Error && isNetworkTypeError(error)) {
    return 'network';
  }

  if (error instanceof ApiError && error.kind) {
    return error.kind;
  }

  return 'crash';
}
