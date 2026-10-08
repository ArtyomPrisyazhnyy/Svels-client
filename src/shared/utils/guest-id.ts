const GUEST_ID_KEY = 'svels_guest_id';

function createGuestUuid(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch {
    // http://192.168.x.x не является secure context — randomUUID может бросить.
  }

  const bytes = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/** Сбросить гостевую личность (после logout), чтобы не тянуть старые лайки с API. */
export function resetGuestId(): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.removeItem(GUEST_ID_KEY);
}

/** Стабильный guest UUID в localStorage (для избранного без логина). */
export function getOrCreateGuestId(): string {
  if (typeof window === 'undefined') {
    return '';
  }
  const existing = window.localStorage.getItem(GUEST_ID_KEY);
  if (existing) {
    return existing;
  }
  const next = createGuestUuid();
  window.localStorage.setItem(GUEST_ID_KEY, next);
  return next;
}
