'use client';

import '../styles/fulfillment-selector.scss';
import {
  SegmentedControl,
  type SegmentedControlOption,
} from '@/shared/ui/SegmentedControl/SegmentedControl';

export interface SegmentedSwitcherOption<K extends string> {
  key: K;
  title: string;
}

interface SegmentedSwitcherProps<K extends string> {
  options: SegmentedSwitcherOption<K>[];
  value: K;
  onChange: (value: K) => void;
  ariaLabel: string;
}

/** @deprecated Use SegmentedControl from `@/shared/ui` */
export function SegmentedSwitcher<K extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: SegmentedSwitcherProps<K>) {
  const mapped: SegmentedControlOption<K>[] = options.map((option) => ({
    value: option.key,
    label: option.title,
  }));

  return (
    <SegmentedControl options={mapped} value={value} onChange={onChange} ariaLabel={ariaLabel} />
  );
}
