'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { Stack, Skeleton, Checkbox, Button } from '@/shared/ui';
import type { CartCheckoutDraft } from '@/shared/types/cart';
import { useGuestAddressesStore } from '@/store/guest-addresses.store';
import { CartDetailRow } from '../CartDetailRow';
import { DeliveryAddressFields } from '../DeliveryAddressFields';
import { GuestAddressSheet } from './GuestAddressSheet';
import type { GuestAddressFormValues } from './GuestAddressForm';
import { formatGuestAddressCheckoutValue } from '../../utils/guest-address.util';
import { createGuestAddressPayloadFromForm } from '../../utils/guest-address-form.util';
import '../../styles/guest-addresses.scss';

interface CartCheckoutGuestAddressLoaderProps {
  restaurantId: string;
  accessToken: string;
}

export function CartCheckoutGuestAddressLoader({
  restaurantId,
  accessToken,
}: CartCheckoutGuestAddressLoaderProps) {
  const loadAddresses = useGuestAddressesStore((s) => s.loadAddresses);

  useEffect(() => {
    void loadAddresses(restaurantId, accessToken);
  }, [restaurantId, accessToken, loadAddresses]);

  return null;
}

interface CartCheckoutDeliveryAddressInlineProps {
  draft: CartCheckoutDraft;
  onDraftChange: (patch: Partial<CartCheckoutDraft>) => void;
  addressError?: string | null;
  addressExtraExpanded: boolean;
  onToggleAddressExtra: () => void;
}

export function CartCheckoutDeliveryAddressInline({
  draft,
  onDraftChange,
  addressError,
  addressExtraExpanded,
  onToggleAddressExtra,
}: CartCheckoutDeliveryAddressInlineProps) {
  const handleDeliveryChange = useCallback(
    (deliveryAddress: CartCheckoutDraft['deliveryAddress']) => {
      onDraftChange({ deliveryAddress });
    },
    [onDraftChange],
  );

  return (
    <Stack
      gap={3}
      as="section"
      className="cart-checkout-section cart-checkout-section--address"
      testId="cart-address-section"
    >
      <DeliveryAddressFields
        value={draft.deliveryAddress}
        onChange={handleDeliveryChange}
        variant="required"
      />
      {addressError && (
        <p className="restaurant-cart-modal__inline-error" role="alert">
          {addressError}
        </p>
      )}
      <Checkbox
        label="Сохранить адрес для следующих заказов"
        checked={draft.saveDeliveryAddress}
        onChange={(e) => onDraftChange({ saveDeliveryAddress: e.target.checked })}
        testId="address-save-checkbox"
      />
      <div className="guest-address-form__chips" data-testid="address-label-chips-inline">
        {['Дом', 'Работа'].map((chip) => (
          <Button
            key={chip}
            type="button"
            variant="secondary"
            size="md"
            className={`guest-address-form__chip-btn${
              draft.deliveryAddressLabel === chip ? ' guest-address-form__chip-btn--active' : ''
            }`}
            onClick={() => onDraftChange({ deliveryAddressLabel: chip })}
          >
            {chip}
          </Button>
        ))}
      </div>
      <div className="cart-checkout-rows cart-checkout-rows--inset">
        <CartDetailRow
          label="Уточнить адрес"
          value=""
          grouped
          expanded={addressExtraExpanded}
          onToggle={onToggleAddressExtra}
          testId="cart-address-extra-row"
        >
          <DeliveryAddressFields
            value={draft.deliveryAddress}
            onChange={handleDeliveryChange}
            variant="extended"
          />
        </CartDetailRow>
      </div>
    </Stack>
  );
}

interface CartCheckoutSavedAddressRowProps {
  addressError?: string | null;
  onOpenSheet: () => void;
  restaurantId: string;
}

export function CartCheckoutSavedAddressRow({
  addressError,
  onOpenSheet,
  restaurantId,
}: CartCheckoutSavedAddressRowProps) {
  const addresses = useGuestAddressesStore(
    (s) => s.byRestaurant[restaurantId]?.addresses ?? [],
  );
  const selectedId = useGuestAddressesStore(
    (s) => s.byRestaurant[restaurantId]?.selectedId ?? null,
  );

  const selectedAddress = useMemo(
    () => addresses.find((row) => row.id === selectedId) ?? null,
    [addresses, selectedId],
  );

  const rowValue = selectedAddress
    ? formatGuestAddressCheckoutValue(selectedAddress)
    : 'Не выбран';

  return (
    <CartDetailRow
      label="Адрес"
      value={rowValue}
      navigate
      valueEllipsis
      grouped
      expanded={false}
      onToggle={onOpenSheet}
      error={addressError}
      testId="checkout-address-row"
    />
  );
}

export function CartCheckoutSavedAddressRowSkeleton() {
  return (
    <div className="cart-detail-row cart-detail-row--grouped" data-testid="checkout-address-row">
      <div className="cart-detail-row__trigger cart-detail-row__trigger--static">
        <span className="cart-detail-row__label">Адрес</span>
        <Skeleton className="guest-address-checkout-row__skeleton" />
      </div>
    </div>
  );
}

interface CartCheckoutGuestAddressSheetProps {
  open: boolean;
  onClose: () => void;
  restaurantId: string;
  accessToken: string;
}

export function CartCheckoutGuestAddressSheet({
  open,
  onClose,
  restaurantId,
  accessToken,
}: CartCheckoutGuestAddressSheetProps) {
  const addresses = useGuestAddressesStore(
    (s) => s.byRestaurant[restaurantId]?.addresses ?? [],
  );
  const selectedId = useGuestAddressesStore(
    (s) => s.byRestaurant[restaurantId]?.selectedId ?? null,
  );
  const setSelectedId = useGuestAddressesStore((s) => s.setSelectedId);
  const createAddress = useGuestAddressesStore((s) => s.createAddress);
  const updateAddress = useGuestAddressesStore((s) => s.updateAddress);
  const removeAddress = useGuestAddressesStore((s) => s.removeAddress);
  const makeDefault = useGuestAddressesStore((s) => s.makeDefault);

  const handleCreate = useCallback(
    async (values: GuestAddressFormValues) => {
      const payload = createGuestAddressPayloadFromForm(values);
      await createAddress(restaurantId, accessToken, payload);
    },
    [accessToken, createAddress, restaurantId],
  );

  const handleUpdate = useCallback(
    async (addressId: string, values: GuestAddressFormValues) => {
      const payload = createGuestAddressPayloadFromForm(values);
      await updateAddress(restaurantId, accessToken, addressId, payload);
    },
    [accessToken, restaurantId, updateAddress],
  );

  if (!open) {
    return null;
  }

  return (
    <GuestAddressSheet
      open
      stacked
      onClose={onClose}
      addresses={addresses}
      selectedId={selectedId}
      onSelectAddress={(id) => setSelectedId(restaurantId, id)}
      onCreateAddress={handleCreate}
      onUpdateAddress={handleUpdate}
      onDeleteAddress={(id) => removeAddress(restaurantId, accessToken, id)}
      onMakeDefault={(id) => makeDefault(restaurantId, accessToken, id)}
    />
  );
}

export function selectCheckoutUsesSavedAddresses(restaurantId: string): boolean {
  const bucket = useGuestAddressesStore.getState().byRestaurant[restaurantId];
  return bucket?.status === 'ready' && (bucket.addresses.length ?? 0) > 0;
}

export function selectCheckoutSelectedAddressId(restaurantId: string): string | null {
  return useGuestAddressesStore.getState().byRestaurant[restaurantId]?.selectedId ?? null;
}
