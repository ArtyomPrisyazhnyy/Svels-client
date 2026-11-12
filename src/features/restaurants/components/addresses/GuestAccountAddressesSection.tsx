'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button, Skeleton, Stack } from '@/shared/ui';
import { useGuestAddressesStore } from '@/store/guest-addresses.store';
import { GuestAddressList } from './GuestAddressList';
import { GuestAddressSheet } from './GuestAddressSheet';
import type { GuestAddressFormValues } from './GuestAddressForm';
import { createGuestAddressPayloadFromForm } from '../../utils/guest-address-form.util';
import '../../styles/guest-addresses.scss';

interface GuestAccountAddressesSectionProps {
  restaurantId: string;
  accessToken: string;
}

type SheetLaunch = {
  view: 'list' | 'create' | 'edit' | 'menu';
  addressId: string | null;
};

export function GuestAccountAddressesSection({
  restaurantId,
  accessToken,
}: GuestAccountAddressesSectionProps) {
  const addresses = useGuestAddressesStore(
    (s) => s.byRestaurant[restaurantId]?.addresses ?? [],
  );
  const status = useGuestAddressesStore(
    (s) => s.byRestaurant[restaurantId]?.status ?? 'idle',
  );
  const loadAddresses = useGuestAddressesStore((s) => s.loadAddresses);
  const createAddress = useGuestAddressesStore((s) => s.createAddress);
  const updateAddress = useGuestAddressesStore((s) => s.updateAddress);
  const removeAddress = useGuestAddressesStore((s) => s.removeAddress);
  const makeDefault = useGuestAddressesStore((s) => s.makeDefault);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetLaunch, setSheetLaunch] = useState<SheetLaunch>({
    view: 'list',
    addressId: null,
  });

  useEffect(() => {
    void loadAddresses(restaurantId, accessToken);
  }, [restaurantId, accessToken, loadAddresses]);

  const openSheet = useCallback((launch: SheetLaunch) => {
    setSheetLaunch(launch);
    setSheetOpen(true);
  }, []);

  const handleCreate = useCallback(
    async (values: GuestAddressFormValues) => {
      await createAddress(
        restaurantId,
        accessToken,
        createGuestAddressPayloadFromForm(values),
      );
      setSheetOpen(false);
    },
    [accessToken, createAddress, restaurantId],
  );

  const handleUpdate = useCallback(
    async (addressId: string, values: GuestAddressFormValues) => {
      await updateAddress(
        restaurantId,
        accessToken,
        addressId,
        createGuestAddressPayloadFromForm(values),
      );
    },
    [accessToken, restaurantId, updateAddress],
  );

  const loading = status === 'loading' || status === 'idle';

  return (
    <section
      className="restaurant-guest-account__section guest-account-addresses"
      data-testid="account-addresses"
    >
      <h2>Мои адреса</h2>
      {loading ? (
        <Stack gap={2}>
          <Skeleton />
          <Skeleton />
        </Stack>
      ) : addresses.length === 0 ? (
        <>
          <p className="guest-account-addresses__empty">Сохранённых адресов пока нет</p>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={() => openSheet({ view: 'create', addressId: null })}
            testId="account-address-add"
          >
            Добавить адрес
          </Button>
        </>
      ) : (
        <>
          <GuestAddressList
            layout="profile"
            addresses={addresses}
            onRowPress={(addressId) => openSheet({ view: 'edit', addressId })}
            onOpenMenu={(addressId) => openSheet({ view: 'menu', addressId })}
          />
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={() => openSheet({ view: 'create', addressId: null })}
            testId="address-add"
          >
            + Добавить адрес
          </Button>
        </>
      )}

      {sheetOpen && (
        <GuestAddressSheet
          open
          onClose={() => setSheetOpen(false)}
          addresses={addresses}
          selectedId={null}
          onSelectAddress={() => setSheetOpen(false)}
          onCreateAddress={handleCreate}
          onUpdateAddress={handleUpdate}
          onDeleteAddress={(id) => removeAddress(restaurantId, accessToken, id)}
          onMakeDefault={(id) => makeDefault(restaurantId, accessToken, id)}
          initialView={sheetLaunch.view}
          initialEditAddressId={sheetLaunch.addressId}
        />
      )}
    </section>
  );
}
