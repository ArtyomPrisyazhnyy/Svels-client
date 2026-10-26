import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { MenuResponse } from '../../../shared/types/menu.ts';
import type { RestaurantLocation } from '../../../shared/types/restaurant-location.ts';
import type { WorkSchedule } from '../../../shared/types/schedule.ts';
import {
  buildMenuDescription,
  buildVenueJsonLd,
  buildVenuePageMetadata,
  buildVenueSitemapEntries,
  serializeJsonLd,
  validateVenueJsonLd,
  venueCanonicalUrl,
  type VenueSeoInput,
} from './venue-seo.ts';

const platformOrigin = 'https://svels.by';

const menu: MenuResponse = {
  categories: [
    {
      id: 'cat-1',
      name: 'Супы',
      sortOrder: 1,
      items: [
        {
          id: 'item-1',
          categoryId: 'cat-1',
          name: 'Борщ <script>',
          variantLabel: 'большая',
          description: 'Со сметаной',
          ingredients: null,
          nutrition: null,
          price: 12.5,
          oldPrice: 15,
          isAvailable: true,
          imageUrl: '/uploads/borscht.jpg',
          galleryUrls: [],
          modifierGroups: [],
        },
        {
          id: 'item-2',
          categoryId: 'cat-1',
          name: 'Сезонный',
          variantLabel: null,
          description: null,
          ingredients: null,
          nutrition: null,
          price: 0,
          oldPrice: null,
          isAvailable: false,
          imageUrl: '',
          galleryUrls: [],
          modifierGroups: [],
        },
      ],
    },
  ],
};

const locations: RestaurantLocation[] = [
  {
    id: 'loc-1',
    restaurantId: 'rest-1',
    city: 'Минск',
    address: 'пр. Независимости 1',
    label: 'Центр',
    lat: 53.9023,
    lng: 27.5619,
    sortOrder: 0,
  },
];

const schedules: WorkSchedule[] = [
  {
    id: 'sch-1',
    restaurantId: 'rest-1',
    dayOfWeek: 1,
    openTime: '10:00:00',
    closeTime: '23:00',
    isOpen: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'sch-2',
    restaurantId: 'rest-1',
    dayOfWeek: 0,
    openTime: '12:00',
    closeTime: '22:00',
    isOpen: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

function input(customDomain?: string): VenueSeoInput {
  return {
    platformOrigin,
    restaurant: {
      id: 'rest-1',
      name: 'Кафе <script>',
      description: 'Домашняя кухня',
      address: 'пр. Независимости 1',
      customDomain,
      logoUrl: 'https://cdn.example/logo.png',
      contactPhone: '+375 29 000-00-01',
      contactEmail: 'hello@cafe.example',
      legalAddress: 'г. Минск, пр. Независимости 1',
    },
    menu,
    locations,
    schedules,
  };
}

describe('venue canonical URLs', () => {
  it('uses the platform path without a custom domain', () => {
    assert.equal(
      venueCanonicalUrl({
        restaurantId: 'rest-1',
        platformOrigin,
        page: 'venue',
      }),
      'https://svels.by/restaurants/rest-1',
    );
    assert.equal(
      venueCanonicalUrl({
        restaurantId: 'rest-1',
        platformOrigin,
        page: 'menu',
      }),
      'https://svels.by/restaurants/rest-1/menu',
    );
  });

  it('uses the custom domain for the venue and the menu', () => {
    assert.equal(
      venueCanonicalUrl({
        restaurantId: 'rest-1',
        customDomain: 'cafe.example',
        platformOrigin,
        page: 'venue',
      }),
      'https://cafe.example/',
    );
    assert.equal(
      venueCanonicalUrl({
        restaurantId: 'rest-1',
        customDomain: 'https://cafe.example/ignored',
        platformOrigin,
        page: 'menu',
      }),
      'https://cafe.example/menu',
    );
  });
});

function ogImageUrl(images: unknown): string {
  if (!Array.isArray(images) || images.length === 0) {
    return '';
  }
  const first = images[0];
  if (typeof first === 'string') {
    return first;
  }
  if (first && typeof first === 'object' && 'url' in first) {
    const url = first.url;
    return typeof url === 'string' ? url : String(url);
  }
  return '';
}

describe('venue metadata', () => {
  it('sets a distinct title, description and image for the menu', () => {
    const venue = buildVenuePageMetadata({ ...input(), page: 'venue' });
    const menuMeta = buildVenuePageMetadata({ ...input('cafe.example'), page: 'menu' });
    assert.equal(venue.title, 'Кафе <script>');
    assert.equal(venue.alternates?.canonical, 'https://svels.by/restaurants/rest-1');
    assert.equal(ogImageUrl(venue.openGraph?.images), 'https://cdn.example/logo.png');
    assert.equal(menuMeta.title, 'Меню — Кафе <script>');
    assert.equal(menuMeta.alternates?.canonical, 'https://cafe.example/menu');
    assert.match(String(menuMeta.description), /Супы/);
    assert.equal(ogImageUrl(menuMeta.openGraph?.images), 'https://cafe.example/uploads/borscht.jpg');
    assert.match(buildMenuDescription(input().restaurant, menu), /Меню Кафе/);
  });
});

describe('venue JSON-LD', () => {
  it('builds a valid Restaurant graph with BYN offers, hours and geo', () => {
    const data = buildVenueJsonLd(input('cafe.example'));
    assert.deepEqual(validateVenueJsonLd(data), []);
    assert.equal(data.url, 'https://cafe.example/');
    const hasMenu = data.hasMenu as { url: string; hasMenuSection: Array<{ hasMenuItem: Array<{ name: string; offers: { price: string; priceCurrency: string; availability: string } }> }> };
    assert.equal(hasMenu.url, 'https://cafe.example/menu');
    const offer = hasMenu.hasMenuSection[0]?.hasMenuItem[0]?.offers;
    assert.equal(offer?.priceCurrency, 'BYN');
    assert.equal(offer?.price, '12.50');
    assert.equal(hasMenu.hasMenuSection[0]?.hasMenuItem[0]?.name, 'Борщ <script> (большая)');
    assert.equal(hasMenu.hasMenuSection[0]?.hasMenuItem[1]?.offers.price, '0.00');
    assert.equal(
      hasMenu.hasMenuSection[0]?.hasMenuItem[1]?.offers.availability,
      'https://schema.org/OutOfStock',
    );
    const hours = data.openingHoursSpecification as Array<{ dayOfWeek: string; opens: string; closes: string }>;
    assert.equal(hours.length, 1);
    assert.equal(hours[0]?.dayOfWeek, 'https://schema.org/Monday');
    assert.equal(hours[0]?.opens, '10:00');
    assert.equal(hours[0]?.closes, '23:00');
    const geo = data.geo as { latitude: number; longitude: number };
    assert.equal(geo.latitude, 53.9023);
    assert.equal(geo.longitude, 27.5619);
    assert.equal((data.address as { addressCountry: string }).addressCountry, 'BY');
  });

  it('escapes raw angle brackets in the serialized script payload', () => {
    const serialized = serializeJsonLd(buildVenueJsonLd(input()));
    assert.equal(serialized.includes('<'), false);
    assert.match(serialized, /\\u003cscript\\u003e/);
  });

  it('rejects a broken offer currency, geo and hours', () => {
    const broken = buildVenueJsonLd(input());
    const menuNode = broken.hasMenu as { hasMenuSection: Array<{ hasMenuItem: Array<{ offers: { priceCurrency: string } }> }> };
    menuNode.hasMenuSection[0]!.hasMenuItem[0]!.offers.priceCurrency = 'USD';
    (broken.geo as { latitude: number }).latitude = 120;
    (broken.openingHoursSpecification as Array<{ opens: string }>)[0]!.opens = '25:00';
    const errors = validateVenueJsonLd(broken);
    assert.ok(errors.some((error) => error.includes('BYN')));
    assert.ok(errors.some((error) => error.includes('широта')));
    assert.ok(errors.some((error) => error.includes('opens')));
  });

  it('stays valid without coordinates', () => {
    const data = buildVenueJsonLd({ ...input(), locations: [] });
    assert.equal(data.geo, undefined);
    assert.deepEqual(validateVenueJsonLd(data), []);
  });
});

describe('venue sitemap', () => {
  it('emits the venue and menu URLs on the custom domain', () => {
    const entries = buildVenueSitemapEntries({
      restaurantId: 'rest-1',
      customDomain: 'cafe.example',
      lastModified: '2026-04-01T00:00:00.000Z',
      platformOrigin,
    });
    assert.deepEqual(
      entries.map((entry) => entry.url),
      ['https://cafe.example/', 'https://cafe.example/menu'],
    );
    assert.equal(entries[0]?.priority, 0.8);
    assert.equal(entries[1]?.priority, 0.7);
  });
});
