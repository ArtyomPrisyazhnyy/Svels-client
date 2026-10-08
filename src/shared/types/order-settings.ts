export type FulfillmentKey =
  | 'fulfillmentDelivery'
  | 'fulfillmentTakeaway'
  | 'fulfillmentDineIn';

export type PaymentKey = 'paymentCash' | 'paymentCardOnSite' | 'paymentOnline';

export interface RestaurantOrderSettings {
  restaurantId: string;
  fulfillmentDelivery: boolean;
  fulfillmentTakeaway: boolean;
  fulfillmentDineIn: boolean;
  paymentCash: boolean;
  paymentCardOnSite: boolean;
  paymentOnline: boolean;
  /** Гость может указать получателя доставки (другое имя и телефон). */
  deliveryForSomeoneElse: boolean;
  updatedAt: string;
}

export type UpdateRestaurantOrderSettingsPayload = Partial<
  Pick<
    RestaurantOrderSettings,
    | 'fulfillmentDelivery'
    | 'fulfillmentTakeaway'
    | 'fulfillmentDineIn'
    | 'paymentCash'
    | 'paymentCardOnSite'
    | 'paymentOnline'
    | 'deliveryForSomeoneElse'
  >
>;

export interface FulfillmentOption {
  key: FulfillmentKey;
  title: string;
  description: string;
}

export const FULFILLMENT_OPTIONS: FulfillmentOption[] = [
  {
    key: 'fulfillmentDelivery',
    title: 'Доставка',
    description: 'Клиент получает заказ по указанному адресу.',
  },
  {
    key: 'fulfillmentTakeaway',
    title: 'Самовывоз',
    description: 'Клиент забирает заказ и уносит с собой — как кофе в бумажном стаканчике.',
  },
  {
    key: 'fulfillmentDineIn',
    title: 'На месте',
    description: 'Клиент потребляет заказ в заведении — как кофе в стеклянной кружке.',
  },
];

export function getEnabledFulfillmentOptions(
  settings: Pick<
    RestaurantOrderSettings,
    'fulfillmentDelivery' | 'fulfillmentTakeaway' | 'fulfillmentDineIn'
  >,
): FulfillmentOption[] {
  return FULFILLMENT_OPTIONS.filter((option) => settings[option.key]);
}

export function getDefaultFulfillment(
  settings: Pick<
    RestaurantOrderSettings,
    'fulfillmentDelivery' | 'fulfillmentTakeaway' | 'fulfillmentDineIn'
  >,
): FulfillmentKey {
  const enabled = getEnabledFulfillmentOptions(settings);
  return (enabled[0]?.key ?? 'fulfillmentTakeaway') as FulfillmentKey;
}

export interface PaymentOption {
  key: PaymentKey;
  title: string;
  description: string;
}

export const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    key: 'paymentCash',
    title: 'Наличными',
    description: 'Оплата наличными при получении заказа.',
  },
  {
    key: 'paymentCardOnSite',
    title: 'Картой на месте',
    description: 'Оплата картой при получении — в зале или на кассе.',
  },
  {
    key: 'paymentOnline',
    title: 'Онлайн',
    description: 'Предоплата или оплата картой через приложение до получения.',
  },
];

export function getEnabledPaymentOptions(
  settings: Pick<RestaurantOrderSettings, 'paymentCash' | 'paymentCardOnSite' | 'paymentOnline'>,
): PaymentOption[] {
  return PAYMENT_OPTIONS.filter((option) => settings[option.key]);
}

export function getDefaultPayment(
  settings: Pick<RestaurantOrderSettings, 'paymentCash' | 'paymentCardOnSite' | 'paymentOnline'>,
): PaymentKey | null {
  const enabled = getEnabledPaymentOptions(settings);
  return (enabled[0]?.key ?? null) as PaymentKey | null;
}
