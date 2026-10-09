/** Фиктивное демо-заведение «Чайка» для лендинга и mock API (id: demo). */

export const LANDING_DEMO_RESTAURANT_ID = 'demo';
export const LANDING_DEMO_DOMAIN = 'chaika-coffee.by';

const now = () => new Date().toISOString();

export function buildLandingDemoPayload() {
  const restaurantId = LANDING_DEMO_RESTAURANT_ID;

  const restaurant = {
    id: restaurantId,
    name: 'Чайка',
    description: 'Кофейня с завтраками и выпечкой собственного производства',
    address: 'г. Минск, ул. Немига, 12',
    status: 'active',
    customDomain: LANDING_DEMO_DOMAIN,
    logoUrl: '/landing/demo/logo.webp',
    logoWebpUrl: '/landing/demo/logo.webp',
    createdAt: now(),
  };

  const menu = {
    categories: [
      {
        id: 'demo-cat-coffee',
        name: 'Кофе',
        sortOrder: 0,
        items: [
          {
            id: 'demo-item-cappuccino',
            categoryId: 'demo-cat-coffee',
            name: 'Капучино',
            variantLabel: '350 мл',
            description: 'Эспрессо и молоко',
            ingredients: null,
            nutrition: null,
            price: 8.5,
            oldPrice: null,
            isAvailable: true,
            imageUrl: '/landing/demo/cappuccino.webp',
            imageWebpUrl: '/landing/demo/cappuccino.webp',
            galleryUrls: [],
            galleryWebpUrls: [],
            modifierGroups: [],
          },
          {
            id: 'demo-item-raf',
            categoryId: 'demo-cat-coffee',
            name: 'Раф ванильный',
            variantLabel: '400 мл',
            description: 'Сливки и ванильный сироп',
            ingredients: null,
            nutrition: null,
            price: 9.9,
            oldPrice: 11.5,
            isAvailable: true,
            imageUrl: '/landing/demo/raf.webp',
            imageWebpUrl: '/landing/demo/raf.webp',
            galleryUrls: [],
            galleryWebpUrls: [],
            modifierGroups: [],
          },
        ],
      },
      {
        id: 'demo-cat-food',
        name: 'Выпечка',
        sortOrder: 1,
        items: [
          {
            id: 'demo-item-croissant',
            categoryId: 'demo-cat-food',
            name: 'Круассан с миндалём',
            variantLabel: null,
            description: 'Свежая выпечка',
            ingredients: null,
            nutrition: null,
            price: 6.2,
            oldPrice: null,
            isAvailable: true,
            imageUrl: '/landing/demo/croissant.webp',
            imageWebpUrl: '/landing/demo/croissant.webp',
            galleryUrls: [],
            galleryWebpUrls: [],
            modifierGroups: [],
          },
          {
            id: 'demo-item-cheesecake',
            categoryId: 'demo-cat-food',
            name: 'Чизкейк',
            variantLabel: 'порция',
            description: 'Классический сырный десерт',
            ingredients: null,
            nutrition: null,
            price: 7.8,
            oldPrice: null,
            isAvailable: true,
            imageUrl: '/landing/demo/cheesecake.webp',
            imageWebpUrl: '/landing/demo/cheesecake.webp',
            galleryUrls: [],
            galleryWebpUrls: [],
            modifierGroups: [],
          },
        ],
      },
    ],
  };

  const orderSettings = {
    restaurantId,
    fulfillmentDelivery: true,
    fulfillmentTakeaway: true,
    fulfillmentDineIn: true,
    paymentCash: true,
    paymentCardOnSite: true,
    paymentOnline: true,
    deliveryForSomeoneElse: true,
    updatedAt: now(),
  };

  const styling = {
    restaurantId,
    fontFamily: 'system',
    colorTheme: 'forest',
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
    footerAccent: 'tinted',
    updatedAt: now(),
  };

  const locations = [
    {
      id: 'demo-loc-1',
      restaurantId,
      label: 'Немига',
      city: 'Минск',
      address: 'ул. Немига, 12',
      lat: 53.9045,
      lng: 27.5615,
      sortOrder: 0,
    },
  ];

  return {
    restaurant,
    menu,
    orderSettings,
    styling,
    locations,
    socialLinks: [],
    promoBanners: [
      {
        id: 'demo-banner-1',
        restaurantId,
        type: 'strip',
        title: 'Завтраки до 12:00',
        imageUrl: '/landing/demo/banner.webp',
        imageWebpUrl: '/landing/demo/banner.webp',
        linkUrl: null,
        sortOrder: 0,
        isActive: true,
        displayFrequency: 'every_visit',
        aspectRatio: '4_1',
        createdAt: now(),
        updatedAt: now(),
      },
    ],
    bookingSettings: {
      restaurantId,
      bookingEnabled: false,
      mode: 'by_seats',
      depositScheme: 'no_deposit',
      depositAmount: 0,
      bookingDurationMinutes: 120,
      slotMinutes: 30,
      maxGuests: 8,
      advanceDays: 14,
      autoConfirm: false,
      updatedAt: now(),
    },
    loyaltySettings: {
      restaurantId,
      flameDisplayEnabled: true,
      flameRewardsEnabled: true,
      flameExpireDays: 14,
      flameLevels: [],
      otherPrograms: [],
      updatedAt: now(),
    },
  };
}
