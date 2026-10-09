import type { CartCheckoutDraft, CartLineItem } from '@/shared/types/cart';
import type { FulfillmentKey, PaymentKey } from '@/shared/types/order-settings';
import { isCompleteBelarusPhone } from '@/shared/utils/phone.util';
import { isDeliveryAddressComplete } from './checkout-payload.util';

const CUSTOMER_NAME_MAX = 120;
const COMMENT_MAX = 1000;

export type CartDetailRowKey =
  | 'address'
  | 'addressExtra'
  | 'location'
  | 'time'
  | 'payment'
  | 'comment'
  | 'recipient'
  | 'contacts';

export interface CartCheckoutValidation {
  canSubmit: boolean;
  ctaLabel: string;
  rowsToExpand: CartDetailRowKey[];
  fieldErrors: Partial<Record<CartDetailRowKey, string>>;
}

interface ValidateCartCheckoutParams {
  items: CartLineItem[];
  ordersPaused: boolean;
  submitting: boolean;
  successOrderNumber: number | null;
  enabledFulfillmentKeys: FulfillmentKey[];
  fulfillment: FulfillmentKey;
  enabledPaymentsCount: number;
  payment: PaymentKey | null;
  isGuestOfRestaurant: boolean;
  accessToken: string | null;
  draft: CartCheckoutDraft;
  needsVenue: boolean;
  multipleLocations: boolean;
  locationId: string | null;
  showSomeoneElseOption: boolean;
}

export function validateCartCheckout(params: ValidateCartCheckoutParams): CartCheckoutValidation {
  const {
    items,
    ordersPaused,
    submitting,
    successOrderNumber,
    enabledFulfillmentKeys,
    fulfillment,
    enabledPaymentsCount,
    payment,
    isGuestOfRestaurant,
    accessToken,
    draft,
    needsVenue,
    multipleLocations,
    locationId,
    showSomeoneElseOption,
  } = params;

  const rowsToExpand: CartDetailRowKey[] = [];
  const fieldErrors: Partial<Record<CartDetailRowKey, string>> = {};

  const baseInvalid =
    items.length === 0 ||
    ordersPaused ||
    submitting ||
    successOrderNumber !== null ||
    !enabledFulfillmentKeys.includes(fulfillment) ||
    (enabledPaymentsCount > 0 && !payment) ||
    !isGuestOfRestaurant ||
    !accessToken;

  const customerName = draft.customerName.trim();
  if (!customerName || customerName.length > CUSTOMER_NAME_MAX) {
    fieldErrors.contacts = 'Укажите имя';
    rowsToExpand.push('contacts');
  }

  if (!isCompleteBelarusPhone(draft.phone)) {
    fieldErrors.contacts = fieldErrors.contacts ?? 'Укажите телефон';
    if (!rowsToExpand.includes('contacts')) {
      rowsToExpand.push('contacts');
    }
  }

  if (fulfillment === 'fulfillmentDelivery' && !isDeliveryAddressComplete(draft.deliveryAddress)) {
    fieldErrors.address = 'Укажите улицу и дом';
    rowsToExpand.push('address');
  }

  if (needsVenue && multipleLocations && !locationId) {
    fieldErrors.location = 'Выберите точку';
    rowsToExpand.push('location');
  }

  if (draft.requestedAtMode === 'slot' && !draft.requestedAtSlotIso) {
    fieldErrors.time = 'Выберите время';
    rowsToExpand.push('time');
  }

  if (showSomeoneElseOption && draft.orderForSomeoneElse) {
    if (!draft.recipientName.trim() || !isCompleteBelarusPhone(draft.recipientPhone)) {
      fieldErrors.recipient = 'Укажите данные получателя';
      rowsToExpand.push('recipient');
    }
  }

  if (draft.comment.trim().length > COMMENT_MAX) {
    fieldErrors.comment = `Не более ${COMMENT_MAX} символов`;
    rowsToExpand.push('comment');
  }

  let ctaLabel = 'Оформить заказ';
  if (fulfillment === 'fulfillmentDelivery' && !isDeliveryAddressComplete(draft.deliveryAddress)) {
    ctaLabel = 'Укажите адрес';
  } else if (!isCompleteBelarusPhone(draft.phone)) {
    ctaLabel = 'Укажите телефон';
  } else if (!customerName || customerName.length > CUSTOMER_NAME_MAX) {
    ctaLabel = 'Укажите имя';
  } else if (needsVenue && multipleLocations && !locationId) {
    ctaLabel = 'Выберите точку';
  } else if (draft.requestedAtMode === 'slot' && !draft.requestedAtSlotIso) {
    ctaLabel = 'Выберите время';
  } else if (fieldErrors.recipient) {
    ctaLabel = 'Укажите получателя';
  } else if (payment === 'paymentOnline') {
    ctaLabel = 'Перейти к оплате';
  }

  const canSubmit = !baseInvalid && rowsToExpand.length === 0;

  return { canSubmit, ctaLabel, rowsToExpand, fieldErrors };
}

export function getStep2Title(fulfillment: FulfillmentKey): string {
  switch (fulfillment) {
    case 'fulfillmentDelivery':
      return 'Доставка';
    case 'fulfillmentTakeaway':
      return 'Самовывоз';
    case 'fulfillmentDineIn':
      return 'В зале';
    default:
      return 'Оформление';
  }
}
