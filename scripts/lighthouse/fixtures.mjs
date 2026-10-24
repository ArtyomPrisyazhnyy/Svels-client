/** Stable fixture IDs for local Lighthouse runs (mock API only — not production). */
export const LIGHTHOUSE_RESTAURANT_ID = '00000000-0000-4000-8000-000000000001';

const now = '2026-01-01T00:00:00.000Z';

/** Tiny SVG placeholder — no network, predictable decode cost. */
export const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="#e2e8f0" width="400" height="300"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-family="system-ui" font-size="18">Svels</text></svg>',
  );

export const PLACEHOLDER_LOGO =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72"><rect fill="#2563eb" rx="12" width="72" height="72"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="22" font-weight="700">S</text></svg>',
  );

export function buildRestaurantFixture(id = LIGHTHOUSE_RESTAURANT_ID) {
  return {
    id,
    name: 'Lighthouse Bistro',
    description: 'Тестовое заведение для замеров производительности.',
    address: 'ул. Перфомансная 1, Минск',
    status: 'active',
    customDomain: null,
    logoUrl: PLACEHOLDER_LOGO,
    logoWebpUrl: null,
    createdAt: now,
  };
}

export function buildStylingFixture(restaurantId = LIGHTHOUSE_RESTAURANT_ID) {
  return {
    restaurantId,
    fontFamily: 'inter',
    colorTheme: 'classic',
    currencyDisplay: 'byn_glyph',
    buttonShape: 'rounded',
    buttonVariant: 'filled',
    switcherStyle: 'pill',
    cardStyle: 'classic',
    magazineCardLayout: 'content_left',
    menuCategoryNavEnabled: true,
    favoritesEnabled: true,
    headerStyle: 'glass',
    footerLayout: 'columns',
    footerAccent: 'flat',
    updatedAt: now,
  };
}

export function buildMenuFixture(restaurantId = LIGHTHOUSE_RESTAURANT_ID) {
  const categoryId = 'cat-lighthouse-main';
  const items = Array.from({ length: 8 }, (_, index) => {
    const n = index + 1;
    return {
      id: `item-lighthouse-${n}`,
      categoryId,
      name: `Блюдо ${n}`,
      variantLabel: null,
      description: 'Описание для карточки меню.',
      ingredients: null,
      nutrition: null,
      price: 10 + n,
      oldPrice: null,
      isAvailable: true,
      imageUrl: PLACEHOLDER_IMAGE,
      imageWebpUrl: null,
      galleryUrls: [],
      galleryWebpUrls: [],
      modifierGroups: [],
    };
  });

  return {
    categories: [
      {
        id: categoryId,
        restaurantId,
        name: 'Основное меню',
        sortOrder: 0,
        items,
      },
    ],
  };
}

export function buildOrderSettingsFixture(restaurantId = LIGHTHOUSE_RESTAURANT_ID) {
  return {
    restaurantId,
    fulfillmentDelivery: false,
    fulfillmentTakeaway: true,
    fulfillmentDineIn: true,
    paymentCash: true,
    paymentCardOnSite: true,
    paymentOnline: false,
    deliveryForSomeoneElse: false,
    updatedAt: now,
  };
}

export function buildBookingSettingsFixture(restaurantId = LIGHTHOUSE_RESTAURANT_ID) {
  return {
    restaurantId,
    bookingEnabled: true,
    minPartySize: 1,
    maxPartySize: 8,
    slotDurationMinutes: 90,
    advanceBookingDays: 14,
    updatedAt: now,
  };
}

export function buildLoyaltySettingsFixture(restaurantId = LIGHTHOUSE_RESTAURANT_ID) {
  return {
    restaurantId,
    flameDisplayEnabled: false,
    updatedAt: now,
  };
}
