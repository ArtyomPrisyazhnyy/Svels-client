import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const FIXTURES = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../fixtures/demo-venue');
const IMAGE_PREFIX = '/demo-venue/images';

export function loadDemoVenuePack() {
  const raw = readFileSync(path.join(FIXTURES, 'menu.json'), 'utf8');
  return JSON.parse(raw);
}

function imageUrls(fileName) {
  const url = `${IMAGE_PREFIX}/${fileName}`;
  return { imageUrl: url, imageWebpUrl: url };
}

function packModifiersToGroups(modifiers) {
  if (!modifiers?.length) {
    return [];
  }
  return modifiers.map((group) => ({
    id: group.id,
    name: group.name,
    selectionType: group.maxSelect && group.maxSelect > 1 ? 'multiple' : 'single',
    required: Boolean(group.required),
    options: group.options.map((opt) => ({
      id: opt.id,
      name: opt.name,
      priceDelta: Number(opt.price ?? 0),
    })),
  }));
}

export function buildMenuFromPack(pack, restaurantId) {
  let sortOrder = 0;
  const categories = pack.categories.map((cat) => {
    const categoryId = `demo-cat-${cat.id}`;
    const items = cat.items.map((item) => {
      const img = imageUrls(item.image);
      return {
        id: `demo-${item.id}`,
        categoryId,
        name: item.name,
        variantLabel: item.volume ?? null,
        description: item.description ?? null,
        ingredients: null,
        nutrition: null,
        price: Number(item.price),
        oldPrice: null,
        isAvailable: true,
        imageUrl: img.imageUrl,
        imageWebpUrl: img.imageWebpUrl,
        galleryUrls: [],
        galleryWebpUrls: [],
        modifierGroups: packModifiersToGroups(item.modifiers),
      };
    });
    const category = {
      id: categoryId,
      name: cat.name,
      sortOrder,
      items,
    };
    sortOrder += 1;
    return category;
  });
  return { categories };
}

export function demoVenueRestaurant(pack, restaurantId, domain) {
  const { venue } = pack;
  const logo = imageUrls(venue.logo);
  return {
    id: restaurantId,
    name: venue.name,
    description: venue.description,
    address: venue.address,
    status: 'active',
    customDomain: domain,
    logoUrl: logo.imageUrl,
    logoWebpUrl: logo.imageWebpUrl,
    createdAt: new Date().toISOString(),
  };
}

export function demoVenueStyling(restaurantId) {
  return {
    restaurantId,
    fontFamily: 'inter',
    colorTheme: 'svelsGuest',
    currencyDisplay: 'byn_glyph',
    buttonShape: 'rounded',
    buttonVariant: 'filled',
    switcherStyle: 'pill',
    cardStyle: 'classic',
    magazineCardLayout: 'content_left',
    menuCategoryNavEnabled: true,
    favoritesEnabled: true,
    headerStyle: 'solid',
    footerLayout: 'columns',
    footerAccent: 'flat',
    updatedAt: new Date().toISOString(),
  };
}

export function demoVenuePromoBanner(pack, restaurantId) {
  const banner = imageUrls(pack.venue.banner);
  return [
    {
      id: 'demo-banner-main',
      restaurantId,
      type: 'strip',
      title: pack.venue.tagline,
      imageUrl: banner.imageUrl,
      imageWebpUrl: banner.imageWebpUrl,
      linkUrl: null,
      sortOrder: 0,
      isActive: true,
      displayFrequency: 'once',
      aspectRatio: '16_9',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

export function demoVenueLocation(pack, restaurantId) {
  const { venue } = pack;
  const city = venue.city ?? 'Гродно';
  return [
    {
      id: 'demo-loc-1',
      restaurantId,
      label: 'Центр',
      city,
      address: venue.address.replace(/^г\.\s*[^,]+,\s*/, ''),
      lat: 53.6778,
      lng: 23.8297,
      sortOrder: 0,
    },
  ];
}
