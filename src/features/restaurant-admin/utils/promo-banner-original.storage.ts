const DB_NAME = 'svels-promo-banner-originals';
const DB_VERSION = 1;
const STORE_NAME = 'originals';

export const DRAFT_ORIGINAL_KEY = '__draft__';

interface StoredOriginalPayload {
  buffer: ArrayBuffer;
  type: string;
}

const memoryOriginals = new Map<string, Blob>();

function storageKey(restaurantId: string, bannerId: string): string {
  return `${restaurantId}:${bannerId}`;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB недоступен'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB open failed'));
  });
}

export async function savePromoBannerOriginal(
  restaurantId: string,
  bannerId: string,
  file: Blob,
): Promise<void> {
  const key = storageKey(restaurantId, bannerId);
  memoryOriginals.set(key, file);

  try {
    const buffer = await file.arrayBuffer();
    const payload: StoredOriginalPayload = {
      buffer,
      type: file.type || 'image/jpeg',
    };
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(payload, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error('IndexedDB write failed'));
    });
    db.close();
  } catch {
    // Best-effort: in-memory fallback remains for this tab session.
  }
}

function payloadToBlob(payload: StoredOriginalPayload): Blob {
  return new Blob([payload.buffer], { type: payload.type || 'image/jpeg' });
}

export async function loadPromoBannerOriginal(
  restaurantId: string,
  bannerId: string,
): Promise<Blob | null> {
  const key = storageKey(restaurantId, bannerId);
  const cached = memoryOriginals.get(key);
  if (cached) {
    return cached;
  }

  try {
    const db = await openDb();
    const payload = await new Promise<StoredOriginalPayload | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const request = tx.objectStore(STORE_NAME).get(key);
      request.onsuccess = () => {
        resolve((request.result as StoredOriginalPayload | undefined) ?? null);
      };
      request.onerror = () => reject(request.error ?? new Error('IndexedDB read failed'));
    });
    db.close();
    if (!payload?.buffer) {
      return null;
    }
    const blob = payloadToBlob(payload);
    memoryOriginals.set(key, blob);
    return blob;
  } catch {
    return null;
  }
}

export async function deletePromoBannerOriginal(
  restaurantId: string,
  bannerId: string,
): Promise<void> {
  const key = storageKey(restaurantId, bannerId);
  memoryOriginals.delete(key);
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error('IndexedDB delete failed'));
    });
    db.close();
  } catch {
    // ignore
  }
}
