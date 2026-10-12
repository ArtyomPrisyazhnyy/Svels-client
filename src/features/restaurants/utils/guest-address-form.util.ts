import type { CreateGuestAddressPayload } from '@/shared/types/guest-address';
import type { GuestAddressFormValues } from '../components/addresses/GuestAddressForm';

function optionalField(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function createGuestAddressPayloadFromForm(
  values: GuestAddressFormValues,
): CreateGuestAddressPayload {
  const { delivery, label, isDefault } = values;
  return {
    street: delivery.street.trim(),
    house: delivery.house.trim(),
    label: optionalField(label),
    apartment: optionalField(delivery.apartment),
    entrance: optionalField(delivery.entrance),
    floor: optionalField(delivery.floor),
    intercom: optionalField(delivery.intercom),
    comment: optionalField(delivery.comment),
    isDefault,
  };
}
