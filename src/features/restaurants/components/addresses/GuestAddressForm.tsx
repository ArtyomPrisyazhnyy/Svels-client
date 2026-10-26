'use client';

import { useMemo, useState } from 'react';
import { DeliveryAddressFields } from '../DeliveryAddressFields';
import { Field, Input, Stack, Button, Checkbox } from '@/shared/ui';
import { AddressLabelSegment } from '../AddressLabelSegment';
import type { DeliveryAddress } from '@/shared/types/pre-order';
import { isGuestAddressFormValid } from '../../utils/guest-address.util';
import '../../styles/guest-addresses.scss';

const LABEL_MAX = 40;

export interface GuestAddressFormValues {
  label: string;
  delivery: DeliveryAddress;
  isDefault: boolean;
}

interface GuestAddressFormProps {
  mode: 'create' | 'edit';
  initialValues: GuestAddressFormValues;
  onSubmit: (values: GuestAddressFormValues) => Promise<void>;
  submitError?: string | null;
}

export function GuestAddressForm({
  mode,
  initialValues,
  onSubmit,
  submitError,
}: GuestAddressFormProps) {
  const [label, setLabel] = useState(initialValues.label);
  const [delivery, setDelivery] = useState<DeliveryAddress>(initialValues.delivery);
  const [isDefault, setIsDefault] = useState(initialValues.isDefault);
  const [submitting, setSubmitting] = useState(false);

  const canSave = useMemo(
    () => isGuestAddressFormValid(delivery.street, delivery.house) && !submitting,
    [delivery.house, delivery.street, submitting],
  );

  async function handleSubmit() {
    if (!canSave) {
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        label: label.trim(),
        delivery,
        isDefault,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Stack gap={3} testId="guest-address-form">
      <DeliveryAddressFields value={delivery} onChange={setDelivery} variant="full" />
      <Field label="Название" htmlFor="guest-address-label" error={submitError ?? undefined}>
        <Input
          id="guest-address-label"
          value={label}
          maxLength={LABEL_MAX}
          placeholder="Дом, Работа…"
          onChange={(e) => setLabel(e.target.value)}
          testId="address-label-input"
        />
      </Field>
      <AddressLabelSegment
        value={label}
        onChange={setLabel}
        testId="address-label-chips"
      />
      <Checkbox
        label="Сделать основным"
        checked={isDefault}
        onChange={(e) => setIsDefault(e.target.checked)}
        testId="address-default-checkbox"
      />
      <Button
        type="button"
        variant="primary"
        size="lg"
        fullWidth
        disabled={!canSave}
        loading={submitting}
        onClick={() => void handleSubmit()}
        testId="address-save"
      >
        {mode === 'create' ? 'Сохранить адрес' : 'Сохранить адрес'}
      </Button>
    </Stack>
  );
}
