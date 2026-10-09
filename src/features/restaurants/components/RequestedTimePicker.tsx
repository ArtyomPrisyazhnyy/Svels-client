'use client';

import { useMemo } from 'react';
import type { RequestedAtMode } from '@/shared/types/cart';
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

  return (
    <div className="requested-time-picker" data-testid="requested-time-picker">
      <div className="requested-time-picker__modes">
        <button
          type="button"
          className={`requested-time-picker__mode${
            mode === 'asap' ? ' requested-time-picker__mode--active' : ''
          }`}
          onClick={() => onModeChange('asap')}
          data-testid="requested-time-asap"
        >
          Как можно скорее
        </button>
        <button
          type="button"
          className={`requested-time-picker__mode${
            mode === 'slot' ? ' requested-time-picker__mode--active' : ''
          }`}
          onClick={() => {
            onModeChange('slot');
            if (!slotIso && effectiveSlot) {
              onSlotChange(effectiveSlot);
            }
          }}
          data-testid="requested-time-slot-mode"
        >
          Ко времени
        </button>
      </div>

      {mode === 'slot' && (
        <label className="requested-time-picker__select-wrap">
          <span className="requested-time-picker__label">Время</span>
          <select
            className="requested-time-picker__select"
            value={effectiveSlot ?? ''}
            onChange={(e) => onSlotChange(e.target.value || null)}
            data-testid="requested-time-slot-select"
          >
            {slots.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.label}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}
