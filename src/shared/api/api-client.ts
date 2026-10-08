import { resolveApiUrl } from '@/shared/config/env';
import { useAuthStore } from '@/store/auth.store';

export const SESSION_EXPIRED_MESSAGE = 'Сессия истекла. Войдите снова.';

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string | string[] };
    if (Array.isArray(body.message)) {
      return body.message.join(', ');
    }
    if (typeof body.message === 'string') {
      return body.message;
    }
  } catch {
    // ignore JSON parse errors
  }
  return response.statusText || 'Ошибка запроса';
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
    throw new ApiError(401, SESSION_EXPIRED_MESSAGE);
  }

  throw new ApiError(response.status, await parseErrorMessage(response));
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, headers, body, ...rest } = options;
  const url = `${resolveApiUrl()}${path}`;

  let response: Response;
  try {
    response = await fetch(url, {
      ...rest,
      body,
      headers: {
        // Fastify отклоняет запросы без тела, если указан application/json,
        // поэтому заголовок ставим только при наличии body.
        ...(body != null ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'network error';
    throw new ApiError(
      0,
      `Не удалось связаться с API (${url}). Проверьте, что backend запущен на порту 3000. ${detail}`,
    );
  }

  if (!response.ok) {
    await assertApiResponseOk(response, { authenticatedRequest: Boolean(token) });
  }

  // Nest/Fastify на void часто отдают 200 с пустым телом (не только 204).
  if (response.status === 204 || response.status === 205) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}
