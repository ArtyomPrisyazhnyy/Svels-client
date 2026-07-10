'use client';

import {
  FULFILLMENT_OPTIONS,
  type FulfillmentKey,
  type RestaurantOrderSettings,
} from '@/shared/types/order-settings';
import { SegmentedSwitcher } from './SegmentedSwitcher';

interface FulfillmentSelectorProps {
  settings: RestaurantOrderSettings;
  value: FulfillmentKey;
  onChange: (value: FulfillmentKey) => void;
}

export function FulfillmentSelector({ settings, value, onChange }: FulfillmentSelectorProps) {
  const options = FULFILLMENT_OPTIONS.filter((option) => settings[option.key]);

  if (options.length <= 1) {
    return null;
  }

  return (
    <SegmentedSwitcher
      options={options}
      value={value}
      onChange={onChange}
      ariaLabel="Способ получения заказа"
    />
  );
}
