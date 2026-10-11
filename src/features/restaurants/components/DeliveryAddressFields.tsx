'use client';

import type { DeliveryAddress } from '@/shared/types/pre-order';
import { Field } from '@/shared/ui/Field/Field';
import { Input } from '@/shared/ui/Input/Input';
import { Textarea } from '@/shared/ui/Textarea/Textarea';
import '../styles/delivery-address-fields.scss';

export type DeliveryAddressFieldsVariant = 'full' | 'required' | 'extended';

interface DeliveryAddressFieldsProps {
  value: DeliveryAddress;
  onChange: (next: DeliveryAddress) => void;
  variant?: DeliveryAddressFieldsVariant;
}

export function DeliveryAddressFields({
  value,
  onChange,
  variant = 'full',
}: DeliveryAddressFieldsProps) {
  function patch(partial: Partial<DeliveryAddress>) {
    onChange({ ...value, ...partial });
  }

  const showRequired = variant === 'full' || variant === 'required';
  const showExtended = variant === 'full' || variant === 'extended';
  const idPrefix = variant === 'extended' ? 'delivery-extra' : 'delivery';

  const rootTestId =
    variant === 'full' || variant === 'required' ? 'delivery-address-fields' : undefined;

  return (
    <div className="delivery-address-fields" data-testid={rootTestId}>
      {showRequired && (
        <>
          <Field label="Улица" htmlFor={`${idPrefix}-street`} required>
            <Input
              autoComplete="street-address"
              value={value.street}
              onChange={(e) => patch({ street: e.target.value })}
              placeholder="Название улицы"
              testId="delivery-street"
            />
          </Field>
          <div className="delivery-address-fields__pair">
            <Field label="Дом" htmlFor={`${idPrefix}-house`} required>
              <Input
                value={value.house}
                onChange={(e) => patch({ house: e.target.value })}
                placeholder="№"
                testId="delivery-house"
              />
            </Field>
            <Field label="Квартира" htmlFor={`${idPrefix}-apartment`}>
              <Input
                value={value.apartment ?? ''}
                onChange={(e) => patch({ apartment: e.target.value })}
                testId="delivery-apartment"
              />
            </Field>
          </div>
        </>
      )}

      {showExtended && (
        <>
          <div className="delivery-address-fields__triple">
            <Field label="Подъезд" htmlFor={`${idPrefix}-entrance`}>
              <Input
                value={value.entrance ?? ''}
                onChange={(e) => patch({ entrance: e.target.value })}
              />
            </Field>
            <Field label="Этаж" htmlFor={`${idPrefix}-floor`}>
              <Input
                value={value.floor ?? ''}
                onChange={(e) => patch({ floor: e.target.value })}
              />
            </Field>
            <Field label="Домофон" htmlFor={`${idPrefix}-intercom`}>
              <Input
                value={value.intercom ?? ''}
                onChange={(e) => patch({ intercom: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Комментарий курьеру" htmlFor={`${idPrefix}-courier-comment`}>
            <Textarea
              rows={2}
              maxLength={300}
              value={value.comment ?? ''}
              onChange={(e) => patch({ comment: e.target.value })}
              placeholder="Подъезд, ориентиры"
            />
          </Field>
        </>
      )}
    </div>
  );
}
