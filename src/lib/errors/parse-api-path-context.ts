export interface ApiPathContext {
  route: string;
  restaurantId?: string;
  restaurantSlug?: string;
}

const RESTAURANT_ID_PATTERN =
  /^\/restaurants\/([^/]+)(?:\/|$)/;

export function parseApiPathContext(path: string): ApiPathContext {
  const route = path.split('?')[0] ?? path;
  const match = RESTAURANT_ID_PATTERN.exec(route);

  if (!match) {
    return { route };
  }

  const segment = decodeURIComponent(match[1]);
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      segment,
    );

  if (isUuid) {
    return { route, restaurantId: segment };
  }

  return { route, restaurantSlug: segment };
}
