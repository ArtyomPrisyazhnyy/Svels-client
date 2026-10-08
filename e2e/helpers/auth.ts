import type { Page } from '@playwright/test';
import type { AuthResponse } from './api';

/** Формат zustand persist (`svels-auth`). */
export function toAuthStoragePayload(auth: AuthResponse): string {
  return JSON.stringify({
    state: {
      accessToken: auth.accessToken,
      user: auth.user,
    },
    version: 0,
  });
}

/**
 * Ставит сессию в localStorage один раз (без addInitScript),
 * чтобы logout в UI реально очищал доступ.
 */
export async function injectAuth(page: Page, auth: AuthResponse): Promise<void> {
  await page.goto('/');
  await page.evaluate((payload: string) => {
    window.localStorage.setItem('svels-auth', payload);
  }, toAuthStoragePayload(auth));
}

export async function clearAuthStorage(page: Page): Promise<void> {
  await page.evaluate(() => {
    window.localStorage.removeItem('svels-auth');
  });
}
