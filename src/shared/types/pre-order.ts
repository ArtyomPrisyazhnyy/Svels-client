import type { PaymentStatus } from './payment';

export type PreOrderPaymentMethod = 'cash' | 'card' | 'online';

export type PreOrderStatus = 'pending' | 'confirmed' | 'paid' | 'cancelled';

export interface PreOrderItemPayload {
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  name?: string;
}

export interface CreatePreOrderPayload {
  paymentMethod: PreOrderPaymentMethod;
  items: PreOrderItemPayload[];
  comment?: string;
  bookingId?: string;
  customerName?: string;
  customerPhone?: string;
}

export interface PaymentInfo {
  id: string;
  restaurantId: string;
  preOrderId: string;
  status: PaymentStatus;
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

export interface PreOrderResponse {
  id: string;
  restaurantId: string;
  userId: string;
  bookingId: string | null;
  status: PreOrderStatus;
  paymentMethod: PreOrderPaymentMethod;
  totalAmount: number;
  comment: string | null;
  items: Array<{
    id: string;
    menuItemId: string;
    name: string;
    quantity: number;
    unitPrice: number;
  }>;
  payment: PaymentInfo | null;
  paymentRedirectUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
