import type { DeliveryAddress } from '@/shared/types/pre-order';
import type { GuestAddress } from '@/shared/types/guest-address';

export function guestAddressToDeliveryAddress(address: GuestAddress): DeliveryAddress {
  return {
    street: address.street,
    house: address.house,
    apartment: address.apartment ?? '',
    entrance: address.entrance ?? '',
    floor: address.floor ?? '',
    intercom: address.intercom ?? '',
    comment: address.comment ?? '',
  };
}

export function formatGuestAddressPrimaryLine(address: GuestAddress): string {
  const label = address.label?.trim();
  if (label) {
    return label;
  }
  return `${address.street}, ${address.house}`;
}

export function formatGuestAddressSecondaryLine(address: GuestAddress): string {
  const parts: string[] = [`${address.street}, ${address.house}`];
  if (address.apartment?.trim()) {
    parts.push(`кв. ${address.apartment.trim()}`);
  }
  if (address.entrance?.trim()) {
    parts.push(`подъезд ${address.entrance.trim()}`);
  }
  if (address.floor?.trim()) {
    parts.push(`эт. ${address.floor.trim()}`);
  }
  if (address.intercom?.trim()) {
    parts.push(`домофон ${address.intercom.trim()}`);
  }
  return parts.join(', ');
}

export function formatGuestAddressCheckoutValue(address: GuestAddress): string {
  const label = address.label?.trim();
  const streetLine = `${address.street}, ${address.house}`;
  const apt =
    address.apartment?.trim() ? `, кв. ${address.apartment.trim()}` : '';
  if (label) {
    return `${label} · ${streetLine}${apt}`;
  }
  return `${streetLine}${apt}`;
}

export function pickGuestAddressPreselectId(addresses: GuestAddress[]): string | null {
  if (addresses.length === 0) {
    return null;
  }
  const defaultRow = addresses.find((row) => row.isDefault);
  if (defaultRow) {
    return defaultRow.id;
  }
  const withUsage = [...addresses].sort((a, b) => {
    const aUsed = a.lastUsedAt ? Date.parse(a.lastUsedAt) : 0;
    const bUsed = b.lastUsedAt ? Date.parse(b.lastUsedAt) : 0;
    if (aUsed !== bUsed) {
      return bUsed - aUsed;
    }
    return Date.parse(b.createdAt) - Date.parse(a.createdAt);
  });
  return withUsage[0]?.id ?? addresses[0].id;
}

export function isGuestAddressFormValid(street: string, house: string): boolean {
  return Boolean(street.trim() && house.trim());
}
