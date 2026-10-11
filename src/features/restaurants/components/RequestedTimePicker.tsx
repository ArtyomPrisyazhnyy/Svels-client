'use client';

import { useMemo } from 'react';
import type { RequestedAtMode } from '@/shared/types/cart';
import { SegmentedControl } from '@/shared/ui';
import { Field } from '@/shared/ui/Field/Field';
import { Select } from '@/shared/ui/Select/Select';
import { buildRequestedTimeSlots } from '../utils/requested-time.util';
import '../styles/requested-time-picker.scss';

interface RequestedTimePickerProps {
  mode: RequestedAtMode;
  slotIso: string | null;
  onModeChange: (mode: RequestedAtMode) => void;
  onSlotChange: (iso: string | null) => void;
}

export function RequestedTimePicker({
  mode,
  slotIso,
  onModeChange,
  onSlotChange,
}: RequestedTimePickerProps) {
  const slots = useMemo(() => buildRequestedTimeSlots(), []);

  const effectiveSlot = slotIso && slots.some((s) => s.id === slotIso)
    ? slotIso
    : slots[0]?.id ?? null;

  const segmentedValue = mode === 'asap' ? 'asap' : 'slot';

  return (
    <div className="requested-time-picker" data-testid="requested-time-picker">
      <SegmentedControl
        options={[
          { value: 'asap', label: 'Как можно скорее', testId: 'requested-time-asap' },
          { value: 'slot', label: 'Ко времени', testId: 'requested-time-slot-mode' },
        ]}
        value={segmentedValue}
        onChange={(next) => {
          if (next === 'asap') {
            onModeChange('asap');
            return;
          }
          onModeChange('slot');
          if (!slotIso && effectiveSlot) {
            onSlotChange(effectiveSlot);
          }
        }}
        ariaLabel="Время доставки"
        fullWidth
        legacyFulfillmentClasses
        compact
        testId="cart-requested-time-segmented"
      />

      {mode === 'slot' && (
        <Field
          label="Время"
          htmlFor="cart-requested-time-slot"
          className="requested-time-picker__slot-field"
        >
          <Select
            value={effectiveSlot ?? ''}
            onChange={(e) => onSlotChange(e.target.value || null)}
            testId="requested-time-slot-select"
          >
            {slots.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.label}
              </option>
            ))}
          </Select>
        </Field>
      )}
    </div>
  );
}
