const DEFAULT_API_PORT = process.env.NEXT_PUBLIC_API_PORT ?? '3000';

/**
 * URL API для браузера: совпадает с хостом страницы (работает по LAN IP).
 * Для SSR остаётся localhost — Next.js и backend на одной машине.
 */
export function resolveApiUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:${DEFAULT_API_PORT}`;
  }

  return `http://localhost:${DEFAULT_API_PORT}`;
}

/** Базовый URL для server-side fetch в Next.js */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? `http://localhost:${DEFAULT_API_PORT}`;

export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';
