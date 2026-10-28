'use client';

import { SegmentedControl } from '@/shared/ui';
import { CART_CHECKOUT_SEGMENTED_PROPS } from '../constants/cart-segmented-control';

const ADDRESS_LABEL_OPTIONS = [
  { value: 'Дом', label: 'Дом', testId: 'address-label-dom' },
  { value: 'Работа', label: 'Работа', testId: 'address-label-work' },
] as const;

type AddressLabelValue = (typeof ADDRESS_LABEL_OPTIONS)[number]['value'];

interface AddressLabelSegmentProps {
  value: string;
  onChange: (label: AddressLabelValue) => void;
  testId?: string;
}

export function AddressLabelSegment({ value, onChange, testId }: AddressLabelSegmentProps) {
  const selected: AddressLabelValue = value === 'Работа' ? 'Работа' : 'Дом';

  return (
    <SegmentedControl
      options={[...ADDRESS_LABEL_OPTIONS]}
      value={selected}
      onChange={onChange}
      ariaLabel="Метка адреса"
      size="md"
      {...CART_CHECKOUT_SEGMENTED_PROPS}
      testId={testId ?? 'address-label-segmented'}
    />
  );
}
