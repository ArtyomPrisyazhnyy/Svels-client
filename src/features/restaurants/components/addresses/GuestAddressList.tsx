'use client';

import type { GuestAddress } from '@/shared/types/guest-address';
import { IconButton } from '@/shared/ui';
import {
  formatGuestAddressPrimaryLine,
  formatGuestAddressSecondaryLine,
} from '../../utils/guest-address.util';
import '../../styles/guest-addresses.scss';

interface GuestAddressListProps {
  addresses: GuestAddress[];
  selectedId?: string | null;
  selectable?: boolean;
  onSelect?: (addressId: string) => void;
  onOpenMenu?: (addressId: string) => void;
  onRowPress?: (addressId: string) => void;
}

export function GuestAddressList({
  addresses,
  selectedId,
  selectable = false,
  onSelect,
  onOpenMenu,
  onRowPress,
}: GuestAddressListProps) {
  return (
    <div className="guest-address-list" data-testid="guest-address-list">
      {addresses.map((address) => {
        const selected = selectable && selectedId === address.id;
        const staticRow = !selectable;

        if (staticRow) {
          const RowTag = onRowPress ? 'button' : 'div';
          return (
            <RowTag
              key={address.id}
              type={onRowPress ? 'button' : undefined}
              className={`guest-address-option guest-address-option--static${
                onRowPress ? ' guest-address-option--pressable' : ''
              }`}
              data-testid={`address-option-${address.id}`}
              onClick={onRowPress ? () => onRowPress(address.id) : undefined}
            >
              <div className="guest-address-option__main">
                <p className="guest-address-option__title">
                  {formatGuestAddressPrimaryLine(address)}
                </p>
                <p className="guest-address-option__subtitle">
                  {formatGuestAddressSecondaryLine(address)}
                </p>
                {address.isDefault && (
                  <span className="guest-address-option__chip">По умолчанию</span>
                )}
              </div>
              {onOpenMenu && (
                <IconButton
                  label="Действия с адресом"
                  variant="ghost"
                  size="md"
                  onClick={() => onOpenMenu(address.id)}
                  testId={`address-menu-${address.id}`}
                >
                  ⋯
                </IconButton>
              )}
            </RowTag>
          );
        }

        return (
          <div
            key={address.id}
            className={`guest-address-option${
              selected ? ' guest-address-option--selected' : ''
            }`}
            data-testid={`address-option-${address.id}`}
          >
            <button
              type="button"
              className="guest-address-option__select"
              onClick={() => onSelect?.(address.id)}
            >
              <input
                type="radio"
                className="guest-address-option__radio"
                checked={selected}
                readOnly
                aria-hidden
                tabIndex={-1}
              />
              <div className="guest-address-option__main">
                <p className="guest-address-option__title">
                  {formatGuestAddressPrimaryLine(address)}
                </p>
                <p className="guest-address-option__subtitle">
                  {formatGuestAddressSecondaryLine(address)}
                </p>
                {address.isDefault && (
                  <span className="guest-address-option__chip">По умолчанию</span>
                )}
              </div>
            </button>
            {onOpenMenu && (
              <IconButton
                label="Действия с адресом"
                variant="ghost"
                size="md"
                onClick={() => onOpenMenu(address.id)}
                testId={`address-menu-${address.id}`}
              >
                ⋯
              </IconButton>
            )}
          </div>
        );
      })}
    </div>
  );
}
