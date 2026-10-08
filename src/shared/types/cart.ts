import type { ModifierSelections } from '@/features/restaurants/utils/menu-modifiers.util';

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

export interface CartCheckoutDraft {
  customerName: string;
  phone: string;
  fulfillment: FulfillmentMethod;
  orderForSomeoneElse?: boolean;
  recipientName?: string;
  recipientPhone?: string;
  /** Комментарий к заказу (опционально). */
  comment?: string;
}
