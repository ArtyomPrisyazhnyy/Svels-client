import { classifyError, API_REQUEST_TIMEOUT_MS, API_REQUEST_TIMEOUT_ERROR_NAME } from '@/lib/errors/classify';
import { NETWORK_ERROR_COPY } from '@/lib/errors/messages';
import type { ErrorKind } from '@/lib/errors/classify';
import { resolveApiUrl } from '@/shared/config/env';
import { reportApiErrorTelemetry } from '@/shared/monitoring/api-error-telemetry';
import { useAuthStore } from '@/store/auth.store';

export const SESSION_EXPIRED_MESSAGE = 'Сессия истекла. Войдите снова.';

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly errorId?: string;
  readonly kind: ErrorKind;

  constructor(
    status: number,
    message: string,
    options?: { code?: string; errorId?: string; kind?: ErrorKind },
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = options?.code;
    this.errorId = options?.errorId;
    this.kind = options?.kind ?? classifyError(this, { status });
  }
}

async function parseErrorBody(
  response: Response,
): Promise<{ message: string; code?: string; errorId?: string }> {
  try {
    const body = (await response.json()) as {
      message?: string | string[];
      code?: string;
      errorId?: string;
    };
    let message: string | undefined;
    if (Array.isArray(body.message)) {
      message = body.message.join(', ');
    } else if (typeof body.message === 'string') {
      message = body.message;
    }
    const code = typeof body.code === 'string' ? body.code : undefined;
    const errorId = typeof body.errorId === 'string' ? body.errorId : undefined;
    return {
      message: message ?? response.statusText ?? 'Ошибка запроса',
      code,
      errorId,
    };
  } catch {
    // ignore JSON parse errors
  }
  return { message: response.statusText || 'Ошибка запроса' };
}

export function clearAuthSessionOnUnauthorized(): void {
  const { accessToken, logout } = useAuthStore.getState();
  if (accessToken) {
    logout();
  }
}

export async function assertApiResponseOk(
  response: Response,
  options: { authenticatedRequest?: boolean } = {},
): Promise<void> {
  if (response.ok) {
    return;
  }

  const authenticatedRequest = options.authenticatedRequest ?? false;

  if (response.status === 401 && authenticatedRequest) {
    clearAuthSessionOnUnauthorized();
    throw new ApiError(401, SESSION_EXPIRED_MESSAGE, { kind: 'client' });
  }

  const { message, code, errorId } = await parseErrorBody(response);
  const kind = classifyError(null, { status: response.status });
  throw new ApiError(response.status, message, { code, errorId, kind });
}

function createTimeoutSignal(
  parentSignal: AbortSignal | null | undefined,
): { signal: AbortSignal; cleanup: () => void } {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    const timeoutError = new DOMException('API request timed out', 'AbortError');
    (timeoutError as DOMException & { apiRequestTimeout?: boolean }).apiRequestTimeout = true;
    controller.abort(timeoutError);
  }, API_REQUEST_TIMEOUT_MS);

  const onParentAbort = () => {
    controller.abort(parentSignal?.reason);
  };

  if (parentSignal) {
    if (parentSignal.aborted) {
      onParentAbort();
    } else {
      parentSignal.addEventListener('abort', onParentAbort, { once: true });
    }
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timeoutId);
      if (parentSignal) {
        parentSignal.removeEventListener('abort', onParentAbort);
      }
    },
  };
}

function toNetworkApiError(cause: unknown): ApiError {
  const kind = classifyError(cause, { status: 0 });
  return new ApiError(0, NETWORK_ERROR_COPY.title, { kind });
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, headers, body, signal: userSignal, ...rest } = options;
  const url = `${resolveApiUrl()}${path}`;
  const method = (rest.method ?? 'GET').toUpperCase();

  const { signal, cleanup } = createTimeoutSignal(userSignal ?? undefined);

  let response: Response;
  try {
    response = await fetch(url, {
      ...rest,
      signal,
      body,
      headers: {
        ...(body != null ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  } catch (error) {
    cleanup();
    const apiError = toNetworkApiError(error);
    reportApiErrorTelemetry(apiError, { path, method, status: 0 });
    throw apiError;
  } finally {
    cleanup();
  }

  if (!response.ok) {
    try {
      await assertApiResponseOk(response, { authenticatedRequest: Boolean(token) });
    } catch (error) {
      if (error instanceof ApiError) {
        reportApiErrorTelemetry(error, {
          path,
          method,
          status: error.status,
          errorId: error.errorId,
        });
      }
      throw error;
    }
  }

  if (response.status === 204 || response.status === 205) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

export { API_REQUEST_TIMEOUT_ERROR_NAME };
