export type FulfillmentType = 'delivery' | 'takeaway' | 'dine_in';

export type PreOrderPaymentMethod = 'cash' | 'card' | 'online';

export type PreOrderStatus =
  | 'new'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled';

export type OrderPaymentStatus =
  | 'not_required'
  | 'pending'
  | 'authorized'
  | 'paid'
  | 'voided'
  | 'failed';

export interface DeliveryAddress {
  street: string;
  house: string;
  apartment?: string;
  entrance?: string;
  floor?: string;
  intercom?: string;
  comment?: string;
}

export interface CreatePreOrderItemPayload {
  menuItemId: string;
  quantity: number;
  modifierSelections?: Record<string, string[]>;
}

export type LoyaltyDiscountRewardType = 'percent_discount' | 'fixed_discount';

/** Скидка уровня огонька, уже посчитанная сервером. */
export interface CartLoyaltyDiscount {
  levelId: string;
  levelName: string;
  rewardType: LoyaltyDiscountRewardType;
  percentOff: number | null;
  amountOff: number | null;
  /** Сколько реально вычли из подытога. */
  amount: number;
}

export interface CartGiftReward {
  name: string;
}

export interface CartQuoteLine {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  modifiers: OrderItemModifierDto[];
  lineTotal: number;
}

/** Ответ POST /restaurants/:restaurantId/pre-orders/quote. */
export interface CartQuoteResponse {
  lines: CartQuoteLine[];
  subtotal: number;
  loyaltyDiscount: CartLoyaltyDiscount | null;
  giftRewards: CartGiftReward[];
  total: number;
}

export interface QuotePreOrderPayload {
  items: CreatePreOrderItemPayload[];
}

export interface CreatePreOrderPayload {
  fulfillmentType: FulfillmentType;
  paymentMethod: PreOrderPaymentMethod;
  items: CreatePreOrderItemPayload[];
  customerName: string;
  customerPhone: string;
  locationId?: string;
  deliveryAddress?: DeliveryAddress;
  addressId?: string;
  saveAddress?: boolean;
  addressLabel?: string;
  requestedAt?: string | null;
  recipientName?: string;
  recipientPhone?: string;
  comment?: string;
  bookingId?: string;
}

export interface OrderItemModifierDto {
  groupName: string;
  optionName: string;
  priceDelta: number;
}

export interface OrderItemDto {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  modifiers: OrderItemModifierDto[];
  lineTotal: number;
}

export interface OrderDto {
  id: string;
  restaurantId: string;
  orderNumber: number;
  status: PreOrderStatus;
  paymentMethod: PreOrderPaymentMethod;
  paymentStatus: OrderPaymentStatus;
  fulfillmentType: FulfillmentType;
  customerName: string;
  customerPhone: string;
  recipientName: string | null;
  recipientPhone: string | null;
  deliveryAddress: DeliveryAddress | null;
  locationId: string | null;
  requestedAt: string | null;
  comment: string | null;
  cancelReason: string | null;
  /**
   * Поля скидки есть у заказов после серверного расчёта.
   * Старые ответы без них остаются только с totalAmount.
   */
  subtotalAmount?: number;
  loyaltyDiscountAmount?: number;
  loyaltyLevelId?: string | null;
  loyaltyLevelName?: string | null;
  loyaltyDiscount?: CartLoyaltyDiscount | null;
  giftRewards?: CartGiftReward[];
  totalAmount: number;
  items: OrderItemDto[];
  bookingId: string | null;
  statusChangedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentInfo {
  id: string;
  restaurantId: string;
  preOrderId: string;
  status: import('./payment').PaymentStatus;
  amount: number;
  amountMinor: number;
  currency: string;
  trackingId: string;
  redirectUrl: string | null;
  checkoutToken: string | null;
  bepaidUid: string | null;
  test: boolean;
  transactionType: string | null;
  lastMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PreOrderResponse extends OrderDto {
  payment: PaymentInfo | null;
  paymentRedirectUrl: string | null;
}
