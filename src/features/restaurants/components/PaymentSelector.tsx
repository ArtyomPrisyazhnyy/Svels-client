'use client';

import {
  PAYMENT_OPTIONS,
  type PaymentKey,
  type RestaurantOrderSettings,
} from '@/shared/types/order-settings';
import { SegmentedSwitcher } from './SegmentedSwitcher';

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
    <SegmentedSwitcher
      options={options}
      value={value}
      onChange={onChange}
      ariaLabel="Способ оплаты"
    />
  );
}
