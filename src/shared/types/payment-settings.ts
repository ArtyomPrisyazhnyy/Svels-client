export type BePaidCheckoutTransactionType = 'authorization' | 'payment';

export interface RestaurantPaymentSettings {
  restaurantId: string;
  enabled: boolean;
  shopId: string | null;
  secretKeyConfigured: boolean;
  testMode: boolean;
  checkoutTransactionType: BePaidCheckoutTransactionType;
  autoCapture: boolean;
  currency: string;
  updatedAt: string;
}

export interface UpdateRestaurantPaymentSettingsPayload {
  enabled?: boolean;
  shopId?: string | null;
  /** Передать только чтобы сменить; пустое/omit — не трогать. */
  secretKey?: string;
  clearSecretKey?: boolean;
  testMode?: boolean;
  checkoutTransactionType?: BePaidCheckoutTransactionType;
  autoCapture?: boolean;
  currency?: string;
}
