import type { ModifierSelections } from '@/features/restaurants/utils/menu-modifiers.util';
import type { DeliveryAddress } from '@/shared/types/pre-order';

export interface CartModifierLine {
  groupName: string;
  optionName: string;
  priceDelta: number;
}

export interface CartLineItem {
  id: string;
  lineKey: string;
  menuItemId: string;
  name: string;
  variantLabel: string | null;
  imageUrl: string;
  imageWebpUrl?: string | null;
  quantity: number;
  unitPrice: number;
  modifiers: CartModifierLine[];
  modifierSelections: ModifierSelections;
}

export type FulfillmentMethod = 'fulfillmentDelivery' | 'fulfillmentTakeaway' | 'fulfillmentDineIn';

export type RequestedAtMode = 'asap' | 'slot';

export interface CartCheckoutDraft {
  fulfillment: FulfillmentMethod;
  customerName: string;
  phone: string;
  deliveryAddress: DeliveryAddress;
  locationId: string | null;
  requestedAtMode: RequestedAtMode;
  requestedAtSlotIso: string | null;
  orderForSomeoneElse: boolean;
  recipientName: string;
  recipientPhone: string;
  comment: string;
}

export const EMPTY_DELIVERY_ADDRESS: DeliveryAddress = {
  street: '',
  house: '',
  apartment: '',
  entrance: '',
  floor: '',
  intercom: '',
  comment: '',
};

export function createDefaultCheckoutDraft(
  fulfillment: FulfillmentMethod = 'fulfillmentTakeaway',
): CartCheckoutDraft {
  return {
    fulfillment,
    customerName: '',
    phone: '',
    deliveryAddress: { ...EMPTY_DELIVERY_ADDRESS },
    locationId: null,
    requestedAtMode: 'asap',
    requestedAtSlotIso: null,
    orderForSomeoneElse: false,
    recipientName: '',
    recipientPhone: '',
    comment: '',
  };
}
