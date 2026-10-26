import type { Metadata } from 'next';
import type { MetadataRoute } from 'next';
import type { MenuResponse } from '@/shared/types/menu';
import type { RestaurantLocation } from '@/shared/types/restaurant-location';
import type { WorkSchedule } from '@/shared/types/schedule';

export type VenueSeoPage = 'venue' | 'menu';

export interface VenueSeoRestaurant {
  id: string;
  name: string;
  description: string | null;
  address: string;
  customDomain?: string | null;
  logoUrl?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  legalAddress?: string | null;
}

export interface VenueSeoInput {
  restaurant: VenueSeoRestaurant;
  menu: MenuResponse;
  locations: RestaurantLocation[];
  schedules: WorkSchedule[];
  platformOrigin: string;
}

const SCHEMA_DAYS = [
  'https://schema.org/Sunday',
  'https://schema.org/Monday',
  'https://schema.org/Tuesday',
  'https://schema.org/Wednesday',
  'https://schema.org/Thursday',
  'https://schema.org/Friday',
  'https://schema.org/Saturday',
] as const;

export function getPlatformOrigin(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001').replace(/\/$/, '');
}

export function canonicalOriginForRestaurant(
  customDomain: string | null | undefined,
  platformOrigin: string,
): { origin: string; custom: boolean } {
  const platform = platformOrigin.replace(/\/$/, '');
  const raw = customDomain?.trim() ?? '';
  if (!raw) {
    return { origin: platform, custom: false };
  }

  if (/^https?:\/\//i.test(raw)) {
    return { origin: new URL(raw).origin, custom: true };
  }

  const host = raw.split('/')[0]?.trim() ?? '';
  const bare = (host.split(':')[0] ?? '').toLowerCase();
  const local = bare === 'localhost' || bare === '127.0.0.1';
  return { origin: `${local ? 'http' : 'https'}://${host}`, custom: true };
}

export function venuePublicPath(page: VenueSeoPage, restaurantId: string, custom: boolean): string {
  if (custom) {
    return page === 'venue' ? '/' : '/menu';
  }
  return page === 'venue' ? `/restaurants/${restaurantId}` : `/restaurants/${restaurantId}/menu`;
}

export function joinOrigin(origin: string, path: string): string {
  const base = origin.replace(/\/$/, '');
  if (path === '/') {
    return `${base}/`;
  }
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function venueCanonicalUrl(input: {
  restaurantId: string;
  customDomain?: string | null;
  platformOrigin: string;
  page: VenueSeoPage;
}): string {
  const { origin, custom } = canonicalOriginForRestaurant(input.customDomain, input.platformOrigin);
  return joinOrigin(origin, venuePublicPath(input.page, input.restaurantId, custom));
}

export function toAbsoluteAssetUrl(url: string | null | undefined, origin: string): string | null {
  const value = url?.trim();
  if (!value) {
    return null;
  }
  if (/^https?:\/\//i.test(value)) {
    return value;
  }
  if (value.startsWith('//')) {
    return `https:${value}`;
  }
  const base = origin.replace(/\/$/, '');
  return value.startsWith('/') ? `${base}${value}` : `${base}/${value}`;
}

function truncate(text: string, max = 180): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) {
    return clean;
  }
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

function firstMenuImage(menu: MenuResponse): string | null {
  for (const category of menu.categories) {
    for (const item of category.items) {
      if (item.imageUrl?.trim()) {
        return item.imageUrl;
      }
    }
  }
  return null;
}

export function buildVenueDescription(restaurant: VenueSeoRestaurant): string {
  const custom = restaurant.description?.trim();
  if (custom) {
    return truncate(custom);
  }
  return truncate(
    `Забронируйте стол или оформите предзаказ в ${restaurant.name}. ${restaurant.address}`.trim(),
  );
}

export function buildMenuDescription(restaurant: VenueSeoRestaurant, menu: MenuResponse): string {
  const categories = menu.categories
    .map((category) => category.name.trim())
    .filter(Boolean)
    .slice(0, 6);
  const listed = categories.length > 0 ? ` ${categories.join(', ')}.` : '';
  return truncate(`Меню ${restaurant.name}.${listed} ${restaurant.address}`.replace(/\s+/g, ' '));
}

function pageImage(input: VenueSeoInput, page: VenueSeoPage, origin: string): string | null {
  const logo = input.restaurant.logoUrl;
  const dish = firstMenuImage(input.menu);
  const preferred = page === 'menu' ? dish || logo : logo || dish;
  return toAbsoluteAssetUrl(preferred, origin);
}

export function buildVenuePageMetadata(input: VenueSeoInput & { page: VenueSeoPage }): Metadata {
  const page = input.page;
  const canonical = venueCanonicalUrl({
    restaurantId: input.restaurant.id,
    customDomain: input.restaurant.customDomain,
    platformOrigin: input.platformOrigin,
    page,
  });
  const { origin } = canonicalOriginForRestaurant(input.restaurant.customDomain, input.platformOrigin);
  const description =
    page === 'menu' ? buildMenuDescription(input.restaurant, input.menu) : buildVenueDescription(input.restaurant);
  const title = page === 'menu' ? `Меню — ${input.restaurant.name}` : input.restaurant.name;
  const image = pageImage(input, page, origin);
  const socialTitle = `${title} | Svels`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: socialTitle,
      description,
      url: canonical,
      type: 'website',
      locale: 'ru_BY',
      siteName: input.restaurant.name,
      ...(image ? { images: [{ url: image, alt: input.restaurant.name }] } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: socialTitle,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

function clock(value: string): string | null {
  const match = /^(\d{2}):(\d{2})/.exec(value.trim());
  if (!match) {
    return null;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) {
    return null;
  }
  return `${match[1]}:${match[2]}`;
}

function offerPrice(value: number): string | null {
  if (!Number.isFinite(value) || value < 0) {
    return null;
  }
  return (Math.round(value * 100) / 100).toFixed(2);
}

export function buildVenueJsonLd(input: VenueSeoInput): Record<string, unknown> {
  const venueUrl = venueCanonicalUrl({
    restaurantId: input.restaurant.id,
    customDomain: input.restaurant.customDomain,
    platformOrigin: input.platformOrigin,
    page: 'venue',
  });
  const menuUrl = venueCanonicalUrl({
    restaurantId: input.restaurant.id,
    customDomain: input.restaurant.customDomain,
    platformOrigin: input.platformOrigin,
    page: 'menu',
  });
  const { origin } = canonicalOriginForRestaurant(input.restaurant.customDomain, input.platformOrigin);
  const image = pageImage(input, 'venue', origin);

  const locations = [...input.locations].sort((a, b) => a.sortOrder - b.sortOrder);
  const geoLocations = locations.filter(
    (location) => Number.isFinite(location.lat) && Number.isFinite(location.lng),
  );
  const primary = geoLocations[0];
  const street = input.restaurant.legalAddress?.trim() || input.restaurant.address.trim() || primary?.address || 'Беларусь';

  const sections = input.menu.categories
    .map((category) => {
      const items = category.items.flatMap((item) => {
        const price = offerPrice(item.price);
        if (!price) {
          return [];
        }
        const itemImage = toAbsoluteAssetUrl(item.imageUrl, origin);
        const name = item.variantLabel?.trim() ? `${item.name} (${item.variantLabel.trim()})` : item.name;
        return [
          {
            '@type': 'MenuItem',
            name,
            ...(item.description?.trim() ? { description: item.description.trim() } : {}),
            ...(itemImage ? { image: itemImage } : {}),
            offers: {
              '@type': 'Offer',
              price,
              priceCurrency: 'BYN',
              availability: item.isAvailable
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            },
          },
        ];
      });
      if (items.length === 0) {
        return null;
      }
      return {
        '@type': 'MenuSection',
        name: category.name,
        hasMenuItem: items,
      };
    })
    .filter((section) => section != null);

  const openingHoursSpecification = input.schedules.flatMap((schedule) => {
    if (schedule.isOpen === false) {
      return [];
    }
    const day = SCHEMA_DAYS[schedule.dayOfWeek];
    const opens = clock(schedule.openTime);
    const closes = clock(schedule.closeTime);
    if (!day || !opens || !closes) {
      return [];
    }
    return [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: day,
        opens,
        closes,
      },
    ];
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${venueUrl}#restaurant`,
    name: input.restaurant.name,
    url: venueUrl,
    description: buildVenueDescription(input.restaurant),
    ...(image ? { image } : {}),
    ...(input.restaurant.contactPhone?.trim() ? { telephone: input.restaurant.contactPhone.trim() } : {}),
    ...(input.restaurant.contactEmail?.trim() ? { email: input.restaurant.contactEmail.trim() } : {}),
    currenciesAccepted: 'BYN',
    address: {
      '@type': 'PostalAddress',
      streetAddress: street,
      ...(primary?.city?.trim() ? { addressLocality: primary.city.trim() } : {}),
      addressCountry: 'BY',
    },
    ...(primary
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: primary.lat,
            longitude: primary.lng,
          },
        }
      : {}),
    ...(geoLocations.length > 0
      ? {
          location: geoLocations.map((location) => ({
            '@type': 'Place',
            name: location.label?.trim() || location.city,
            address: {
              '@type': 'PostalAddress',
              streetAddress: location.address,
              addressLocality: location.city,
              addressCountry: 'BY',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: location.lat,
              longitude: location.lng,
            },
          })),
        }
      : {}),
    ...(openingHoursSpecification.length > 0 ? { openingHoursSpecification } : {}),
    hasMenu: {
      '@type': 'Menu',
      '@id': `${menuUrl}#menu`,
      name: `Меню ${input.restaurant.name}`,
      url: menuUrl,
      inLanguage: 'ru',
      ...(sections.length > 0 ? { hasMenuSection: sections } : {}),
    },
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}

const CLOCK_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const PRICE_RE = /^\d+(\.\d{1,2})?$/;
const DAY_RE = /^https:\/\/schema\.org\/(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function push(errors: string[], condition: boolean, message: string): void {
  if (!condition) {
    errors.push(message);
  }
}

export function validateVenueJsonLd(data: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(data)) {
    return ['корень JSON-LD должен быть объектом'];
  }

  push(errors, data['@context'] === 'https://schema.org', '@context должен быть https://schema.org');
  push(errors, data['@type'] === 'Restaurant', '@type должен быть Restaurant');
  push(errors, typeof data.name === 'string' && data.name.trim().length > 0, 'name обязателен');
  push(
    errors,
    typeof data.url === 'string' && /^https?:\/\//.test(data.url),
    'url должен быть абсолютным',
  );

  if (data.image !== undefined) {
    push(
      errors,
      typeof data.image === 'string' && /^https?:\/\//.test(data.image),
      'image должен быть абсолютным URL',
    );
  }

  if (!isRecord(data.address)) {
    errors.push('address должен быть PostalAddress');
  } else {
    push(errors, data.address['@type'] === 'PostalAddress', 'address.@type');
    push(
      errors,
      typeof data.address.streetAddress === 'string' && data.address.streetAddress.trim().length > 0,
      'streetAddress обязателен',
    );
    push(errors, data.address.addressCountry === 'BY', 'addressCountry должен быть BY');
  }

  if (data.geo !== undefined) {
    if (!isRecord(data.geo)) {
      errors.push('geo должен быть объектом');
    } else {
      const latitude = data.geo.latitude;
      const longitude = data.geo.longitude;
      push(errors, data.geo['@type'] === 'GeoCoordinates', 'geo.@type');
      push(
        errors,
        typeof latitude === 'number' && latitude >= -90 && latitude <= 90,
        'широта вне диапазона',
      );
      push(
        errors,
        typeof longitude === 'number' && longitude >= -180 && longitude <= 180,
        'долгота вне диапазона',
      );
    }
  }

  if (data.openingHoursSpecification !== undefined) {
    if (!Array.isArray(data.openingHoursSpecification) || data.openingHoursSpecification.length === 0) {
      errors.push('openingHoursSpecification должен быть непустым массивом');
    } else {
      data.openingHoursSpecification.forEach((row, index) => {
        if (!isRecord(row)) {
          errors.push(`часы ${index} не объект`);
          return;
        }
        push(errors, row['@type'] === 'OpeningHoursSpecification', `часы ${index} @type`);
        push(errors, typeof row.dayOfWeek === 'string' && DAY_RE.test(row.dayOfWeek), `часы ${index} dayOfWeek`);
        push(errors, typeof row.opens === 'string' && CLOCK_RE.test(row.opens), `часы ${index} opens`);
        push(errors, typeof row.closes === 'string' && CLOCK_RE.test(row.closes), `часы ${index} closes`);
      });
    }
  }

  if (!isRecord(data.hasMenu)) {
    errors.push('hasMenu обязателен');
  } else {
    push(errors, data.hasMenu['@type'] === 'Menu', 'hasMenu.@type');
    push(
      errors,
      typeof data.hasMenu.url === 'string' && /^https?:\/\//.test(data.hasMenu.url),
      'hasMenu.url должен быть абсолютным',
    );
    if (data.hasMenu.hasMenuSection !== undefined) {
      if (!Array.isArray(data.hasMenu.hasMenuSection)) {
        errors.push('hasMenuSection должен быть массивом');
      } else {
        data.hasMenu.hasMenuSection.forEach((section, sectionIndex) => {
          if (!isRecord(section) || !Array.isArray(section.hasMenuItem)) {
            errors.push(`секция ${sectionIndex} без позиций`);
            return;
          }
          section.hasMenuItem.forEach((item, itemIndex) => {
            if (!isRecord(item) || !isRecord(item.offers)) {
              errors.push(`позиция ${sectionIndex}.${itemIndex} без offers`);
              return;
            }
            push(
              errors,
              item['@type'] === 'MenuItem' && typeof item.name === 'string' && item.name.trim().length > 0,
              `позиция ${sectionIndex}.${itemIndex} name`,
            );
            push(errors, item.offers['@type'] === 'Offer', `оффер ${sectionIndex}.${itemIndex} @type`);
            push(errors, item.offers.priceCurrency === 'BYN', `оффер ${sectionIndex}.${itemIndex} валюта не BYN`);
            const price = item.offers.price;
            push(
              errors,
              (typeof price === 'number' && price >= 0) || (typeof price === 'string' && PRICE_RE.test(price)),
              `оффер ${sectionIndex}.${itemIndex} цена`,
            );
          });
        });
      }
    }
  }

  return errors;
}

export function buildVenueSitemapEntries(input: {
  restaurantId: string;
  customDomain?: string | null;
  lastModified?: string | null;
  platformOrigin: string;
}): MetadataRoute.Sitemap {
  const modified = input.lastModified ? new Date(input.lastModified) : new Date();
  const lastModified = Number.isNaN(modified.getTime()) ? new Date() : modified;
  return (['venue', 'menu'] as const).map((page) => ({
    url: venueCanonicalUrl({
      restaurantId: input.restaurantId,
      customDomain: input.customDomain,
      platformOrigin: input.platformOrigin,
      page,
    }),
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: page === 'venue' ? 0.8 : 0.7,
  }));
}
