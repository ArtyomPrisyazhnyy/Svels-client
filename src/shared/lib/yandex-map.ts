export type YandexMapPoint = {
  lat: number;
  lng: number;
  selected?: boolean;
};

const DEFAULT_CENTER = { lat: 53.9023, lng: 27.5619 };

export function yandexMapsScriptUrl(apiKey?: string): string {
  const params = new URLSearchParams({ lang: 'ru_RU' });
  if (apiKey) {
    params.set('apikey', apiKey);
  }
  return `https://api-maps.yandex.ru/2.1/?${params.toString()}`;
}

/** Официальный виджет — та же карта, что на FoodPicasso / bacongrodno.by. */
export function yandexMapWidgetUrl(points: YandexMapPoint[]): string {
  const params = new URLSearchParams({ lang: 'ru_RU' });
  const focus = points.find((point) => point.selected) ?? points[0];
  const center = focus ?? DEFAULT_CENTER;
  params.set('ll', `${center.lng},${center.lat}`);
  params.set('z', points.length > 1 ? '13' : '16');
  if (points.length > 0) {
    params.set(
      'pt',
      points
        .map((point) => `${point.lng},${point.lat},${point.selected ? 'pm2rdm' : 'pm2blm'}`)
        .join('~'),
    );
  }
  return `https://yandex.ru/map-widget/v1/?${params.toString()}`;
}

export function yandexStaticMapUrl(
  points: YandexMapPoint[],
  size: { width: number; height: number },
): string {
  const focus = points.find((point) => point.selected) ?? points[0] ?? DEFAULT_CENTER;
  const width = Math.min(650, Math.max(120, Math.round(size.width)));
  const height = Math.min(450, Math.max(120, Math.round(size.height)));
  const params = new URLSearchParams({
    l: 'map',
    size: `${width},${height}`,
    z: points.length > 1 ? '13' : '16',
    ll: `${focus.lng},${focus.lat}`,
  });
  if (points.length > 0) {
    params.set(
      'pt',
      points
        .map((point) => `${point.lng},${point.lat},${point.selected ? 'pm2rdm' : 'pm2blm'}`)
        .join('~'),
    );
  }
  return `https://static-maps.yandex.ru/1.x/?${params.toString()}`;
}
