'use client';

import {
  PAYMENT_OPTIONS,
  type PaymentKey,
  type RestaurantOrderSettings,
} from '@/shared/types/order-settings';
import { SegmentedControl } from '@/shared/ui';
import { CART_CHECKOUT_SEGMENTED_PROPS } from '../constants/cart-segmented-control';

interface PaymentSelectorProps {
  settings: RestaurantOrderSettings;
  value: PaymentKey;
  onChange: (value: PaymentKey) => void;
}

export function PaymentSelector({ settings, value, onChange }: PaymentSelectorProps) {
  const options = PAYMENT_OPTIONS.filter((option) => settings[option.key]);

  if (options.length <= 1) {
    return null;
  }

  return (
    <SegmentedControl
      options={options.map((option) => ({ value: option.key, label: option.title }))}
      value={value}
      onChange={onChange}
      ariaLabel="Способ оплаты"
      {...CART_CHECKOUT_SEGMENTED_PROPS}
      testId="cart-payment-segmented"
    />
  );
}
