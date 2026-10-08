const STORAGE_PREFIX = 'svels:promo-banner-seen:';

export function hasSeenPromoBanner(bannerId: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return window.localStorage.getItem(`${STORAGE_PREFIX}${bannerId}`) === '1';
  } catch {
    return false;
  }
}

export function markPromoBannerSeen(bannerId: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${bannerId}`, '1');
  } catch {
    // private mode / quota — молча игнорируем
  }
}
