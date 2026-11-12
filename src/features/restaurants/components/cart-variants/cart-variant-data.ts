import type { CartLineItem } from '@/shared/types/cart';
import {
  FULFILLMENT_OPTIONS,
  type FulfillmentKey,
  type RestaurantOrderSettings,
} from '@/shared/types/order-settings';

export type CartVariantId = 'summary' | 'dock' | 'receipt';

export const CART_VARIANT_OPTIONS: Array<{ value: CartVariantId; label: string }> = [
  { value: 'summary', label: 'Сводка' },
  { value: 'dock', label: 'Док' },
  { value: 'receipt', label: 'Чек' },
];

export const PREVIEW_ORDER_SETTINGS: RestaurantOrderSettings = {
  restaurantId: 'cart-variants-preview',
  fulfillmentDelivery: true,
  fulfillmentTakeaway: true,
  fulfillmentDineIn: true,
  paymentCash: true,
  paymentCardOnSite: true,
  paymentOnline: false,
  deliveryForSomeoneElse: false,
  updatedAt: '2020-01-01T00:00:00.000Z',
};

export function fulfillmentTitle(key: FulfillmentKey): string {
  return FULFILLMENT_OPTIONS.find((option) => option.key === key)?.title ?? 'Получение';
}

export function isCartVariantId(value: string): value is CartVariantId {
  return CART_VARIANT_OPTIONS.some((option) => option.value === value);
}

const LONG_DISH =
  'Очень длинное название блюда с двойной порцией, сезонными добавками и соусом на выбор';

export function createPreviewCartLines(): CartLineItem[] {
  return [
    {
      id: 'preview-cappuccino',
      lineKey: 'preview-cappuccino',
      menuItemId: 'preview-cappuccino',
      name: 'Капучино',
      variantLabel: '350 мл',
      quantity: 1,
      unitPrice: 7.5,
      imageUrl: '/e2e/menu-dish.png',
      imageWebpUrl: null,
      modifiers: [],
      modifierSelections: {},
    },
    {
      id: 'preview-long',
      lineKey: 'preview-long',
      menuItemId: 'preview-long',
      name: LONG_DISH,
      variantLabel: 'Большая порция',
      quantity: 2,
      unitPrice: 18.9,
      imageUrl: '/e2e/menu-dish.png',
      imageWebpUrl: null,
      modifiers: [
        { groupName: 'Молоко', optionName: 'Овсяное', priceDelta: 1 },
        { groupName: 'Сироп', optionName: 'Ваниль', priceDelta: 0 },
      ],
      modifierSelections: {},
    },
    {
      id: 'preview-cheesecake',
      lineKey: 'preview-cheesecake',
      menuItemId: 'preview-cheesecake',
      name: 'Чизкейк',
      variantLabel: null,
      quantity: 1,
      unitPrice: 9,
      imageUrl: '',
      imageWebpUrl: null,
      modifiers: [],
      modifierSelections: {},
    },
  ];
}

export interface CartVariantPreviewProps {
  lines: CartLineItem[];
  fulfillment: FulfillmentKey;
  onFulfillmentChange: (value: FulfillmentKey) => void;
  onDecrement: (line: CartLineItem) => void;
  onIncrement: (line: CartLineItem) => void;
  clearPromptOpen: boolean;
  onAskClear: () => void;
  onCancelClear: () => void;
  onConfirmClear: () => void;
  totalAmount: number;
}
