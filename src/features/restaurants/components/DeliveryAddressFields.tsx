'use client';

import type { DeliveryAddress } from '@/shared/types/pre-order';
import '../styles/delivery-address-fields.scss';

interface DeliveryAddressFieldsProps {
  value: DeliveryAddress;
  onChange: (next: DeliveryAddress) => void;
}

export function DeliveryAddressFields({ value, onChange }: DeliveryAddressFieldsProps) {
  function patch(partial: Partial<DeliveryAddress>) {
    onChange({ ...value, ...partial });
  }

  return (
    <div className="delivery-address-fields" data-testid="delivery-address-fields">
      <div className="delivery-address-fields__row">
        <label className="delivery-address-fields__field delivery-address-fields__field--grow">
          <span>Улица *</span>
          <input
            type="text"
            autoComplete="street-address"
            value={value.street}
            onChange={(e) => patch({ street: e.target.value })}
            placeholder="Название улицы"
            data-testid="delivery-street"
          />
        </label>
        <label className="delivery-address-fields__field delivery-address-fields__field--house">
          <span>Дом *</span>
          <input
            type="text"
            value={value.house}
            onChange={(e) => patch({ house: e.target.value })}
            placeholder="№"
            data-testid="delivery-house"
          />
        </label>
      </div>

      <div className="delivery-address-fields__row delivery-address-fields__row--triple">
        <label className="delivery-address-fields__field">
          <span>Квартира</span>
          <input
            type="text"
            value={value.apartment ?? ''}
            onChange={(e) => patch({ apartment: e.target.value })}
          />
        </label>
        <label className="delivery-address-fields__field">
          <span>Подъезд</span>
          <input
            type="text"
            value={value.entrance ?? ''}
            onChange={(e) => patch({ entrance: e.target.value })}
          />
        </label>
        <label className="delivery-address-fields__field">
          <span>Этаж</span>
          <input
            type="text"
            value={value.floor ?? ''}
            onChange={(e) => patch({ floor: e.target.value })}
          />
        </label>
      </div>

      <label className="delivery-address-fields__field">
        <span>Домофон</span>
        <input
          type="text"
          value={value.intercom ?? ''}
          onChange={(e) => patch({ intercom: e.target.value })}
        />
      </label>

      <label className="delivery-address-fields__field">
        <span>Комментарий курьеру</span>
        <textarea
          rows={2}
          maxLength={300}
          value={value.comment ?? ''}
          onChange={(e) => patch({ comment: e.target.value })}
          placeholder="Подъезд, ориентиры"
        />
      </label>
    </div>
  );
}
