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
  /** Пауза приёма заказов (API отдаёт всегда; в локальных моках поле может отсутствовать). */
  ordersPaused?: boolean;
  updatedAt: string;
}

export interface SetOrdersPausedPayload {
  ordersPaused: boolean;
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
    description: 'Вы привозите заказ по адресу гостя. Включайте, только если доставка у вас уже есть.',
  },
  {
    key: 'fulfillmentTakeaway',
    title: 'Самовывоз',
    description: 'Гость забирает заказ с собой. Для кофейни это основной способ.',
  },
  {
    key: 'fulfillmentDineIn',
    title: 'На месте',
    description: 'Гость ест и пьёт у вас в зале.',
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
    description: 'Гость платит наличными при получении. Для запуска этого достаточно.',
  },
  {
    key: 'paymentCardOnSite',
    title: 'Картой на месте',
    description: 'Гость платит картой на вашей кассе. Деньги идут на ваш терминал, не в Svels.',
  },
  {
    key: 'paymentOnline',
    title: 'Онлайн',
    description: 'Гость платит картой на сайте. Нужен магазин bePaid, иначе выключите этот пункт.',
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
