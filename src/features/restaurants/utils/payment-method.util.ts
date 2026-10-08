import type { PaymentKey } from '@/shared/types/order-settings';
import type { PreOrderPaymentMethod } from '@/shared/types/pre-order';

export function toPreOrderPaymentMethod(key: PaymentKey): PreOrderPaymentMethod {
  switch (key) {
    case 'paymentCash':
      return 'cash';
    case 'paymentCardOnSite':
      return 'card';
    case 'paymentOnline':
      return 'online';
    default:
      return 'cash';
  }
}
