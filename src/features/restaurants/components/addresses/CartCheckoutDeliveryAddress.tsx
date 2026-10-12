'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Stack, Skeleton, Checkbox } from '@/shared/ui';
import type { CartCheckoutDraft } from '@/shared/types/cart';
import { useGuestAddressesStore } from '@/store/guest-addresses.store';
import { CartDetailRow } from '../CartDetailRow';
import { DeliveryAddressFields } from '../DeliveryAddressFields';
import { GuestAddressSheet } from './GuestAddressSheet';
import type { GuestAddressFormValues } from './GuestAddressForm';
import { formatGuestAddressCheckoutValue } from '../../utils/guest-address.util';
import { createGuestAddressPayloadFromForm } from '../../utils/guest-address-form.util';
import '../../styles/guest-addresses.scss';

interface CartCheckoutDeliveryAddressProps {
  restaurantId: string;
  accessToken: string;
  draft: CartCheckoutDraft;
  onDraftChange: (patch: Partial<CartCheckoutDraft>) => void;
  addressError?: string | null;
  addressExtraExpanded: boolean;
  onToggleAddressExtra: () => void;
}

export function CartCheckoutDeliveryAddress({
  restaurantId,
  accessToken,
  draft,
  onDraftChange,
  addressError,
  addressExtraExpanded,
  onToggleAddressExtra,
}: CartCheckoutDeliveryAddressProps) {
  const addresses = useGuestAddressesStore(
    (s) => s.byRestaurant[restaurantId]?.addresses ?? [],
  );
  const status = useGuestAddressesStore(
    (s) => s.byRestaurant[restaurantId]?.status ?? 'idle',
  );
  const selectedId = useGuestAddressesStore(
    (s) => s.byRestaurant[restaurantId]?.selectedId ?? null,
  );
  const loadAddresses = useGuestAddressesStore((s) => s.loadAddresses);
  const setSelectedId = useGuestAddressesStore((s) => s.setSelectedId);
  const createAddress = useGuestAddressesStore((s) => s.createAddress);
  const updateAddress = useGuestAddressesStore((s) => s.updateAddress);
  const removeAddress = useGuestAddressesStore((s) => s.removeAddress);
  const makeDefault = useGuestAddressesStore((s) => s.makeDefault);

  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    void loadAddresses(restaurantId, accessToken);
  }, [restaurantId, accessToken, loadAddresses]);

  const hasSavedAddresses = status === 'ready' && addresses.length > 0;
  const loadingAddresses = status === 'loading' || status === 'idle';

  const selectedAddress = useMemo(
    () => addresses.find((row) => row.id === selectedId) ?? null,
    [addresses, selectedId],
  );

  const rowValue = selectedAddress
    ? formatGuestAddressCheckoutValue(selectedAddress)
    : 'Не выбран';

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

  if (loadingAddresses) {
    return (
      <Stack
        gap={3}
        as="section"
        className="cart-checkout-section cart-checkout-section--address"
        testId="cart-address-section"
      >
        <div className="cart-checkout-rows">
          <div className="cart-detail-row cart-detail-row--grouped" data-testid="checkout-address-row">
            <div className="cart-detail-row__trigger cart-detail-row__trigger--static">
              <span className="cart-detail-row__label">Адрес</span>
              <Skeleton className="guest-address-checkout-row__skeleton" />
            </div>
          </div>
        </div>
      </Stack>
    );
  }

  if (hasSavedAddresses) {
    return (
      <Stack
        gap={3}
        as="section"
        className="cart-checkout-section cart-checkout-section--address"
        testId="cart-address-section"
      >
        <div className="cart-checkout-rows">
          <CartDetailRow
            label="Адрес"
            value={rowValue}
            navigate
            valueEllipsis
            grouped
            expanded={false}
            onToggle={() => setSheetOpen(true)}
            error={addressError}
            testId="checkout-address-row"
          />
        </div>
        <GuestAddressSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          addresses={addresses}
          selectedId={selectedId}
          onSelectAddress={(id) => setSelectedId(restaurantId, id)}
          onCreateAddress={handleCreate}
          onUpdateAddress={handleUpdate}
          onDeleteAddress={(id) => removeAddress(restaurantId, accessToken, id)}
          onMakeDefault={(id) => makeDefault(restaurantId, accessToken, id)}
        />
      </Stack>
    );
  }

  return (
    <Stack
      gap={3}
      as="section"
      className="cart-checkout-section cart-checkout-section--address"
      testId="cart-address-section"
    >
      <DeliveryAddressFields
        value={draft.deliveryAddress}
        onChange={(deliveryAddress) => onDraftChange({ deliveryAddress })}
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
          <button
            key={chip}
            type="button"
            className={`guest-address-form__chip${
              draft.deliveryAddressLabel === chip ? ' guest-address-form__chip--active' : ''
            }`}
            onClick={() => onDraftChange({ deliveryAddressLabel: chip })}
          >
            {chip}
          </button>
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
            onChange={(deliveryAddress) => onDraftChange({ deliveryAddress })}
            variant="extended"
          />
        </CartDetailRow>
      </div>
    </Stack>
  );
}

export function selectCheckoutUsesSavedAddresses(
  restaurantId: string,
): boolean {
  const bucket = useGuestAddressesStore.getState().byRestaurant[restaurantId];
  return bucket?.status === 'ready' && (bucket.addresses.length ?? 0) > 0;
}

export function selectCheckoutSelectedAddressId(restaurantId: string): string | null {
  return useGuestAddressesStore.getState().byRestaurant[restaurantId]?.selectedId ?? null;
}
