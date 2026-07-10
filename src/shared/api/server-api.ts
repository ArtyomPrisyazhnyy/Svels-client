import { API_URL } from '../config/env';

export interface ServerFetchOptions {
  /** `false` — без кэша; число — ISR в секундах */
  revalidate?: number | false;
  /** Теги для on-demand revalidation через revalidateTag */
  tags?: string[];
}

export async function serverFetch<T>(
  path: string,
  init?: RequestInit,
  options?: ServerFetchOptions,
): Promise<T> {
  const revalidate = options?.revalidate ?? 3600;
  const cacheConfig =
    revalidate === false
      ? { cache: 'no-store' as const }
      : {
          next: {
            revalidate,
            ...(options?.tags?.length ? { tags: options.tags } : {}),
          },
        };

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...cacheConfig,
  });

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${path}`);
  }

  return response.json() as Promise<T>;
}
