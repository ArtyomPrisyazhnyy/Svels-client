'use client';

import { useState } from 'react';
import { CurrencyAmount } from '@/shared/components/CurrencyAmount';
import { Button, Stack } from '@/shared/ui';
import { formatCartItemsCount } from '../../utils/cart-items-label.util';
import { CartClearControl, CartCheckoutBar, CartEmptyNote } from '../CartBasket';
import { CartQtyStepper } from '../CartLineRow';
import { FulfillmentSelector } from '../FulfillmentSelector';
import { CartVariantFrame } from './CartVariantFrame';
import {
  PREVIEW_ORDER_SETTINGS,
  fulfillmentTitle,
  type CartVariantPreviewProps,
} from './cart-variant-data';

export function CartVariantReceipt({
  lines,
  fulfillment,
  onFulfillmentChange,
  onDecrement,
  onIncrement,
  clearPromptOpen,
  onAskClear,
  onCancelClear,
  onConfirmClear,
  totalAmount,
}: CartVariantPreviewProps) {
  const [fulfillmentOpen, setFulfillmentOpen] = useState(false);

  return (
    <CartVariantFrame
      title="Счёт"
      footer={
        <CartCheckoutBar totalAmount={totalAmount}>
          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            disabled={lines.length === 0}
            className="restaurant-cart-modal__submit"
            testId="cart-variant-receipt-checkout"
          >
            Оплатить счёт
          </Button>
        </CartCheckoutBar>
      }
    >
      <Stack gap={4} className="cart-receipt">
        <div className="cart-receipt__head">
          <Button
            type="button"
            variant="ghost"
            fullWidth
            className="cart-receipt__toggle"
            aria-expanded={fulfillmentOpen}
            onClick={() => setFulfillmentOpen((open) => !open)}
            testId="cart-variant-receipt-fulfillment"
          >
            <span>Получение</span>
            <span className="cart-receipt__toggle-value">{fulfillmentTitle(fulfillment)}</span>
          </Button>
          {fulfillmentOpen ? (
            <div className="cart-receipt__fulfillment">
              <FulfillmentSelector
                settings={PREVIEW_ORDER_SETTINGS}
                value={fulfillment}
                onChange={onFulfillmentChange}
              />
            </div>
          ) : null}
          {lines.length > 0 ? (
            <div className="cart-receipt__tools">
              <CartClearControl
                promptOpen={clearPromptOpen}
                onAsk={onAskClear}
                onConfirm={onConfirmClear}
                onCancel={onCancelClear}
              />
            </div>
          ) : null}
        </div>

        {lines.length === 0 ? (
          <CartEmptyNote />
        ) : (
          <ul className="cart-receipt__items">
            {lines.map((line) => (
              <li key={line.id} className="cart-receipt__item">
                <div className="cart-receipt__row">
                  <p className="cart-receipt__name">
                    {line.name}
                    {line.variantLabel ? (
                      <span className="cart-receipt__variant"> {line.variantLabel}</span>
                    ) : null}
                  </p>
                  <span className="cart-receipt__leader" aria-hidden />
                  <p className="cart-receipt__price">
                    <CurrencyAmount amount={line.unitPrice * line.quantity} />
                  </p>
                </div>
                {line.modifiers.length > 0 ? (
                  <p className="cart-receipt__meta">
                    {line.modifiers.map((modifier) => modifier.optionName).join(' · ')}
                  </p>
                ) : null}
                <div className="cart-receipt__stepper">
                  <CartQtyStepper
                    quiet
                    quantity={line.quantity}
                    onDecrement={() => onDecrement(line)}
                    onIncrement={() => onIncrement(line)}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="cart-receipt__bill">
          <div className="cart-receipt__bill-line">
            <span>Позиции</span>
            <span>{formatCartItemsCount(lines.length)}</span>
          </div>
          <p className="cart-receipt__note">Время: как можно скорее</p>
        </div>
      </Stack>
    </CartVariantFrame>
  );
}
