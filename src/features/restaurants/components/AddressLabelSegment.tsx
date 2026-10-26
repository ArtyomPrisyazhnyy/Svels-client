'use client';

import { SegmentedControl } from '@/shared/ui';

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
      fullWidth
      switcherStyle="segmented"
      compact
      testId={testId ?? 'address-label-segmented'}
    />
  );
}
