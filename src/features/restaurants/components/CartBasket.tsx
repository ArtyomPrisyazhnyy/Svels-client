'use client';

import { type ReactNode } from 'react';
import { CurrencyAmount } from '@/shared/components/CurrencyAmount';
import { Button, Cluster, Stack } from '@/shared/ui';
import {
  FULFILLMENT_OPTIONS,
  type FulfillmentKey,
  type RestaurantOrderSettings,
} from '@/shared/types/order-settings';
import type { CartLineItem } from '@/shared/types/cart';
import { formatCartItemsCount, sumCartQuantity } from '../utils/cart-items-label.util';
import { CartLineRow } from './CartLineRow';
import { FulfillmentSelector } from './FulfillmentSelector';

interface CartClearControlProps {
  promptOpen: boolean;
  onAsk: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CartClearControl({
  promptOpen,
  onAsk,
  onConfirm,
  onCancel,
}: CartClearControlProps) {
  if (promptOpen) {
    return (
      <Cluster gap={2} align="center">
        <span className="restaurant-cart-modal__clear-prompt">Очистить?</span>
        <Button type="button" variant="link" size="sm" onClick={onConfirm} testId="cart-clear-confirm-yes">
          Да
        </Button>
        <Button type="button" variant="link" size="sm" onClick={onCancel} testId="cart-clear-confirm-no">
          Нет
        </Button>
      </Cluster>
    );
  }

  return (
    <Button
      type="button"
      variant="link"
      size="sm"
      className="restaurant-cart-modal__clear-link"
      onClick={onAsk}
      testId="cart-clear"
    >
      Очистить
    </Button>
  );
}

interface CartBasketBodyProps {
  items: CartLineItem[];
  orderSettings: RestaurantOrderSettings;
  fulfillment: FulfillmentKey;
  onFulfillmentChange: (value: FulfillmentKey) => void;
  onDecrement: (line: CartLineItem) => void;
  onIncrement: (line: CartLineItem) => void;
  clearPromptOpen: boolean;
  onAskClear: () => void;
  onCancelClear: () => void;
  onConfirmClear: () => void;
  emptyTestId?: string;
}

export function CartBasketBody({
  items,
  orderSettings,
  fulfillment,
  onFulfillmentChange,
  onDecrement,
  onIncrement,
  clearPromptOpen,
  onAskClear,
  onCancelClear,
  onConfirmClear,
  emptyTestId = 'cart-empty',
}: CartBasketBodyProps) {
  const options = FULFILLMENT_OPTIONS.filter((option) => orderSettings[option.key]);

  return (
    <>
      {options.length > 1 ? (
        <div
          className="restaurant-cart-modal__fulfillment-block"
          data-testid="cart-fulfillment-switcher"
        >
          <FulfillmentSelector
            settings={orderSettings}
            value={fulfillment}
            onChange={onFulfillmentChange}
          />
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className="restaurant-cart-modal__empty" data-testid={emptyTestId}>
          <p className="restaurant-cart-modal__empty-title">Корзина пуста</p>
          <p className="restaurant-cart-modal__empty-hint">
            Добавьте блюда из меню — они появятся здесь
          </p>
        </div>
      ) : (
        <div className="restaurant-cart-modal__list-card">
          <Cluster
            className="restaurant-cart-modal__list-header"
            justify="space-between"
            align="center"
            testId="cart-items-header"
          >
            <span className="restaurant-cart-modal__list-header-title">
              {formatCartItemsCount(sumCartQuantity(items))}
            </span>
            <CartClearControl
              promptOpen={clearPromptOpen}
              onAsk={onAskClear}
              onConfirm={onConfirmClear}
              onCancel={onCancelClear}
            />
          </Cluster>
          <ul className="restaurant-cart-modal__list" data-testid="cart-items-list">
            {items.map((line) => (
              <CartLineRow
                key={line.id}
                line={line}
                onDecrement={() => onDecrement(line)}
                onIncrement={() => onIncrement(line)}
              />
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

interface CartCheckoutBarProps {
  totalAmount: number;
  children: ReactNode;
}

export function CartCheckoutBar({ totalAmount, children }: CartCheckoutBarProps) {
  return (
    <footer className="restaurant-cart-modal__footer" data-testid="cart-modal-footer">
      <p className="restaurant-cart-modal__total">
        <span className="restaurant-cart-modal__total-label">Итого</span>
        <span className="restaurant-cart-modal__total-amount">
          <CurrencyAmount amount={totalAmount} fractionDigits={2} />
        </span>
      </p>
      {children}
    </footer>
  );
}

export function CartEmptyNote({ testId = 'cart-variant-empty' }: { testId?: string }) {
  return (
    <Stack gap={2} className="restaurant-cart-modal__empty" testId={testId}>
      <p className="restaurant-cart-modal__empty-title">Корзина пуста</p>
      <p className="restaurant-cart-modal__empty-hint">Добавьте блюда из меню — они появятся здесь</p>
    </Stack>
  );
}
