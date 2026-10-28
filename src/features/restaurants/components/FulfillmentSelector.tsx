'use client';

import {
  FULFILLMENT_OPTIONS,
  type FulfillmentKey,
  type RestaurantOrderSettings,
} from '@/shared/types/order-settings';
import { SegmentedControl } from '@/shared/ui';
import { CART_CHECKOUT_SEGMENTED_PROPS } from '../constants/cart-segmented-control';

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
    <SegmentedControl
      options={options.map((option) => ({ value: option.key, label: option.title }))}
      value={value}
      onChange={onChange}
      ariaLabel="Способ получения заказа"
      {...CART_CHECKOUT_SEGMENTED_PROPS}
      testId="cart-fulfillment-segmented"
    />
  );
}
