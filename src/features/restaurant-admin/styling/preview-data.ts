import type { MenuItem } from '@/shared/types/menu';
import type { RestaurantOrderSettings } from '@/shared/types/order-settings';

export const PREVIEW_ORDER_SETTINGS: RestaurantOrderSettings = {
  restaurantId: 'preview',
  fulfillmentDelivery: true,
  fulfillmentTakeaway: true,
  fulfillmentDineIn: true,
  paymentCash: true,
  paymentCardOnSite: true,
  paymentOnline: true,
  deliveryForSomeoneElse: false,
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const PREVIEW_MENU_ITEM_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1f5f9"/><stop offset="1" stop-color="#cbd5e1"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/><g fill="none" stroke="#64748b" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><path d="M155 135 h85 v35 a42 42 0 0 1 -42 42 h-1 a42 42 0 0 1 -42 -42 z"/><path d="M240 145 a24 24 0 0 1 0 36"/></g><g stroke="#94a3b8" stroke-width="6" stroke-linecap="round" fill="none"><path d="M175 108 q-8 -10 0 -20"/><path d="M197 108 q-8 -10 0 -20"/><path d="M219 108 q-8 -10 0 -20"/></g></svg>',
)}`;

export const PREVIEW_MENU_ITEM: MenuItem = {
  id: 'preview-item',
  categoryId: 'preview-category',
  name: 'Капучино',
  variantLabel: '350 мл',
  description: 'Классический кофе с нежной молочной пенкой',
  ingredients: null,
  nutrition: null,
  price: 7.5,
  oldPrice: 9.5,
  isAvailable: true,
  imageUrl: PREVIEW_MENU_ITEM_IMAGE,
  galleryUrls: [],
  modifierGroups: [],
};

export const PREVIEW_MENU_CATEGORIES = [
  { id: 'burgers', name: 'Бургеры' },
  { id: 'rolls', name: 'Роллы' },
  { id: 'drinks', name: 'Напитки' },
];
