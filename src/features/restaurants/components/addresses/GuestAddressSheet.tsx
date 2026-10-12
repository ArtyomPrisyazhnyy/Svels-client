'use client';

import { useMemo, useState } from 'react';
import { ApiError } from '@/shared/api/api-client';
import { Sheet, Stack, Button, IconButton } from '@/shared/ui';
import { IconBack } from '@/shared/ui/icons/icons';
import type { GuestAddress } from '@/shared/types/guest-address';
import { EMPTY_DELIVERY_ADDRESS } from '@/shared/types/cart';
import { guestAddressToDeliveryAddress } from '../../utils/guest-address.util';
import { GuestAddressList } from './GuestAddressList';
import { GuestAddressForm, type GuestAddressFormValues } from './GuestAddressForm';
import { RestaurantStylingPortalRoot } from '../../context/RestaurantStylingContext';
import '../../styles/guest-addresses.scss';

const ADDRESS_LIMIT = 10;

type SheetView = 'list' | 'create' | 'edit' | 'menu';

interface GuestAddressSheetProps {
  open: boolean;
  onClose: () => void;
  addresses: GuestAddress[];
  selectedId: string | null;
  onSelectAddress: (addressId: string) => void;
  onCreateAddress: (values: GuestAddressFormValues) => Promise<void>;
  onUpdateAddress: (addressId: string, values: GuestAddressFormValues) => Promise<void>;
  onDeleteAddress: (addressId: string) => Promise<void>;
  onMakeDefault: (addressId: string) => Promise<unknown>;
  initialView?: SheetView;
  initialEditAddressId?: string | null;
  /** When opened from cart modal, stack above modal backdrop. */
  stacked?: boolean;
}

export function GuestAddressSheet({
  open,
  onClose,
  addresses,
  selectedId,
  onSelectAddress,
  onCreateAddress,
  onUpdateAddress,
  onDeleteAddress,
  onMakeDefault,
  initialView = 'list',
  initialEditAddressId = null,
  stacked = false,
}: GuestAddressSheetProps) {
  const [view, setView] = useState<SheetView>(initialView);
  const [menuAddressId, setMenuAddressId] = useState<string | null>(initialEditAddressId);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const menuAddress = useMemo(
    () => addresses.find((row) => row.id === menuAddressId) ?? null,
    [addresses, menuAddressId],
  );

  const editAddress = useMemo(
    () => addresses.find((row) => row.id === menuAddressId) ?? null,
    [addresses, menuAddressId],
  );

  function handleClose() {
    setView('list');
    setMenuAddressId(null);
    setConfirmDelete(false);
    setFormError(null);
    onClose();
  }

  function handleSelect(addressId: string) {
    onSelectAddress(addressId);
    handleClose();
  }

  async function handleCreate(values: GuestAddressFormValues) {
    setFormError(null);
    try {
      await onCreateAddress(values);
      setView('list');
    } catch (error) {
      setFormError(resolveAddressError(error));
    }
  }

  async function handleUpdate(values: GuestAddressFormValues) {
    if (!editAddress) {
      return;
    }
    setFormError(null);
    try {
      await onUpdateAddress(editAddress.id, values);
      setView('list');
      setMenuAddressId(null);
    } catch (error) {
      setFormError(resolveAddressError(error));
    }
  }

  const title =
    view === 'create'
      ? 'Новый адрес'
      : view === 'edit'
        ? 'Изменить адрес'
        : view === 'menu'
          ? 'Адрес'
          : 'Адрес доставки';

  const atLimit = addresses.length >= ADDRESS_LIMIT;

  return (
    <Sheet
      open={open}
      onClose={handleClose}
      title={title}
      testId="address-sheet"
      stacked={stacked}
      wrap={(node) => <RestaurantStylingPortalRoot>{node}</RestaurantStylingPortalRoot>}
      headerStart={
        view === 'create' || view === 'edit' ? (
          <IconButton
            label="Назад"
            variant="ghost"
            size="md"
            onClick={() => {
              setView(view === 'edit' ? 'menu' : 'list');
              setFormError(null);
            }}
            testId="address-sheet-back"
          >
            <IconBack />
          </IconButton>
        ) : view === 'menu' ? (
          <IconButton
            label="Назад"
            variant="ghost"
            size="md"
            onClick={() => {
              setView('list');
              setMenuAddressId(null);
              setConfirmDelete(false);
            }}
            testId="address-sheet-back"
          >
            <IconBack />
          </IconButton>
        ) : undefined
      }
      footer={
        view === 'list' ? (
          atLimit ? (
            <p className="guest-address-limit-hint" data-testid="address-limit-hint">
              Можно сохранить не больше 10 адресов
            </p>
          ) : (
            <Button
              type="button"
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => {
                setView('create');
                setFormError(null);
              }}
              testId="address-add"
            >
              + Добавить адрес
            </Button>
          )
        ) : undefined
      }
    >
      <Stack gap={2} className="guest-address-sheet__body">
        {view === 'list' && (
          <GuestAddressList
            addresses={addresses}
            selectedId={selectedId}
            selectable
            onSelect={handleSelect}
            onOpenMenu={(addressId) => {
              setMenuAddressId(addressId);
              setView('menu');
              setConfirmDelete(false);
            }}
          />
        )}

        {view === 'menu' && menuAddress && (
          <div className="guest-address-menu" data-testid="address-action-menu">
            {!confirmDelete ? (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  fullWidth
                  className="guest-address-menu__action"
                  onClick={() => {
                    setView('edit');
                    setFormError(null);
                  }}
                >
                  Изменить
                </Button>
                {!menuAddress.isDefault && (
                  <Button
                    type="button"
                    variant="ghost"
                    fullWidth
                    className="guest-address-menu__action"
                    onClick={() => void onMakeDefault(menuAddress.id).then(() => setView('list'))}
                    testId="address-make-default"
                  >
                    Сделать основным
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  fullWidth
                  className="guest-address-menu__action guest-address-menu__action--danger"
                  onClick={() => setConfirmDelete(true)}
                  testId="address-delete-start"
                >
                  Удалить
                </Button>
              </>
            ) : (
              <div className="guest-address-menu__confirm" data-testid="address-delete-confirm">
                <span>Удалить адрес?</span>
                <div className="guest-address-menu__confirm-actions">
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      void onDeleteAddress(menuAddress.id).then(() => {
                        setView('list');
                        setMenuAddressId(null);
                        setConfirmDelete(false);
                      })
                    }
                    testId="address-delete-yes"
                  >
                    Да
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setConfirmDelete(false)}
                    testId="address-delete-no"
                  >
                    Нет
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {(view === 'create' || view === 'edit') && (
          <div className="guest-address-form-card">
            {view === 'create' && (
              <GuestAddressForm
                mode="create"
                initialValues={{
                  label: '',
                  delivery: { ...EMPTY_DELIVERY_ADDRESS },
                  isDefault: addresses.length === 0,
                }}
                onSubmit={handleCreate}
                submitError={formError}
              />
            )}
            {view === 'edit' && editAddress && (
              <GuestAddressForm
                mode="edit"
                initialValues={{
                  label: editAddress.label ?? '',
                  delivery: guestAddressToDeliveryAddress(editAddress),
                  isDefault: editAddress.isDefault,
                }}
                onSubmit={handleUpdate}
                submitError={formError}
              />
            )}
          </div>
        )}
      </Stack>
    </Sheet>
  );
}

function resolveAddressError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === 'ADDRESS_LIMIT') {
      return 'Можно сохранить не больше 10 адресов';
    }
    return error.message;
  }
  return 'Не удалось сохранить адрес';
}
