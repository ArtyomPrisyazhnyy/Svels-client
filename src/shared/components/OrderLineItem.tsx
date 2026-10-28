'use client';

import { CurrencyAmount, PriceDelta } from '@/shared/components/CurrencyAmount';
import type { OrderItemDto } from '@/shared/types/pre-order';
import { getOrderLineOptionLabels } from '@/shared/utils/order-line-item.util';
import '@/shared/styles/order-line-item.scss';

export interface OrderLineItemProps {
  item: OrderItemDto;
  className?: string;
  testId?: string;
  /** Staff order card: show (+price) next to each modifier option. */
  showModifierPriceDelta?: boolean;
}

export function OrderLineItem({
  item,
  className,
  testId,
  showModifierPriceDelta = false,
}: OrderLineItemProps) {
  const optionLabels = getOrderLineOptionLabels(item.modifiers);

  return (
    <li
      className={className ? `order-line-item ${className}` : 'order-line-item'}
      data-testid={testId ?? `order-line-${item.id}`}
    >
      <div className="order-line-item__main">
        <p className="order-line-item__title">
          {item.name} × {item.quantity}
        </p>
        {showModifierPriceDelta && item.modifiers.length > 0 ? (
          <ul className="order-line-item__modifier-list" data-testid="order-line-modifiers">
            {item.modifiers.map((modifier, index) => (
              <li key={`${item.id}-${index}`}>
                {modifier.groupName}: {modifier.optionName}
                {modifier.priceDelta !== 0 ? (
                  <>
                    {' '}
                    <PriceDelta delta={modifier.priceDelta} />
                  </>
                ) : null}
              </li>
            ))}
          </ul>
        ) : optionLabels.length > 0 ? (
          <p className="order-line-item__options" data-testid="order-line-options">
            {optionLabels.join(' · ')}
          </p>
        ) : null}
      </div>
      <CurrencyAmount amount={item.lineTotal} className="order-line-item__price" />
    </li>
  );
}
