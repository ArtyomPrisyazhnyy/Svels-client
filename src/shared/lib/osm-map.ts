/** Центр Минска, если у точки ещё нет координат. */
export const DEFAULT_MAP_CENTER = { lat: 53.9023, lng: 27.5619 };

/**
 * Тайлы OpenStreetMap. Без ключа и без cookies: браузер запрашивает только PNG.
 * Политика использования: https://operations.osmfoundation.org/policies/tiles/
 */
export const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

export const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" rel="noreferrer noopener">OpenStreetMap</a>';

export function openInOsmUrl(lat: number, lng: number, zoom = 17): string {
  const latitude = lat.toFixed(6);
  const longitude = lng.toFixed(6);
  return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=${zoom}/${latitude}/${longitude}`;
}
