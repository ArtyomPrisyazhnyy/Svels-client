import type { CartLineItem } from '@/shared/types/cart';
import type { CreatePreOrderPayload, DeliveryAddress } from '@/shared/types/pre-order';
import type { FulfillmentKey, PaymentKey } from '@/shared/types/order-settings';
import { toPhoneApiValue } from '@/shared/utils/phone.util';
import { toPreOrderPaymentMethod } from './payment-method.util';
import { fulfillmentKeyToType } from './guest-order.util';

export interface BuildCheckoutPayloadInput {
  fulfillment: FulfillmentKey;
  payment: PaymentKey;
  items: CartLineItem[];
  customerName: string;
  customerPhone: string;
  locationId: string | null;
  deliveryAddress: DeliveryAddress | null;
  requestedAtIso: string | null;
  orderForSomeoneElse: boolean;
  recipientName: string;
  recipientPhone: string;
  comment: string;
  needsVenue: boolean;
  multipleLocations: boolean;
  showSomeoneElseOption: boolean;
}

export function buildCreatePreOrderPayload(
  input: BuildCheckoutPayloadInput,
): CreatePreOrderPayload {
  const payload: CreatePreOrderPayload = {
    fulfillmentType: fulfillmentKeyToType(input.fulfillment),
    paymentMethod: toPreOrderPaymentMethod(input.payment),
    items: input.items.map((line) => {
      const hasModifiers = Object.values(line.modifierSelections).some((ids) => ids.length > 0);
      return {
        menuItemId: line.menuItemId,
        quantity: line.quantity,
        ...(hasModifiers ? { modifierSelections: line.modifierSelections } : {}),
      };
    }),
    customerName: input.customerName.trim(),
    customerPhone: toPhoneApiValue(input.customerPhone),
    comment: input.comment.trim() || undefined,
  };

  if (input.fulfillment === 'fulfillmentDelivery' && input.deliveryAddress) {
    const { street, house, apartment, entrance, floor, intercom, comment: addrComment } =
      input.deliveryAddress;
    payload.deliveryAddress = {
      street: street.trim(),
      house: house.trim(),
      ...(apartment?.trim() ? { apartment: apartment.trim() } : {}),
      ...(entrance?.trim() ? { entrance: entrance.trim() } : {}),
      ...(floor?.trim() ? { floor: floor.trim() } : {}),
      ...(intercom?.trim() ? { intercom: intercom.trim() } : {}),
      ...(addrComment?.trim() ? { comment: addrComment.trim() } : {}),
    };
  }

  if (input.requestedAtIso) {
    payload.requestedAt = input.requestedAtIso;
  } else {
    payload.requestedAt = null;
  }

  if (input.needsVenue && input.multipleLocations && input.locationId) {
    payload.locationId = input.locationId;
  }

  if (input.showSomeoneElseOption && input.orderForSomeoneElse) {
    payload.recipientName = input.recipientName.trim();
    payload.recipientPhone = toPhoneApiValue(input.recipientPhone);
  }

  return payload;
}

export function isDeliveryAddressComplete(address: DeliveryAddress | null): boolean {
  if (!address) {
    return false;
  }
  return Boolean(address.street.trim() && address.house.trim());
}
