'use client';

import { type ReactNode, useState } from 'react';
import { CurrencyAmount } from '@/shared/components/CurrencyAmount';
import { Button, Cluster, Sheet, Stack } from '@/shared/ui';
import {
  FULFILLMENT_OPTIONS,
  type FulfillmentKey,
  type RestaurantOrderSettings,
} from '@/shared/types/order-settings';
import type { CartLineItem } from '@/shared/types/cart';
import { RestaurantStylingPortalRoot } from '../context/RestaurantStylingContext';
import { formatCartItemsCount } from '../utils/cart-items-label.util';
import { CartDetailRow } from './CartDetailRow';
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
  const [sheetOpen, setSheetOpen] = useState(false);
  const options = FULFILLMENT_OPTIONS.filter((option) => orderSettings[option.key]);
  const fulfillmentLabel = options.find((option) => option.key === fulfillment)?.title ?? '';

  return (
    <>
      {options.length > 1 ? (
        <div
          className="restaurant-cart-modal__fulfillment-block"
          data-testid="cart-fulfillment-switcher"
        >
          <CartDetailRow
            label="Получение"
            value={fulfillmentLabel}
            navigate
            expanded={false}
            onToggle={() => setSheetOpen(true)}
            testId="cart-fulfillment-summary"
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
              {formatCartItemsCount(items.length)}
            </span>
            <CartClearControl
              promptOpen={clearPromptOpen}
              onAsk={onAskClear}
              onConfirm={onConfirmClear}
              onCancel={onCancelClear}
            />
          </Cluster>
          <ul className="restaurant-cart-modal__list">
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

      <Sheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Получение"
        testId="cart-fulfillment-sheet"
        stacked
        wrap={(node) => <RestaurantStylingPortalRoot>{node}</RestaurantStylingPortalRoot>}
      >
        <div className="cart-fulfillment-sheet-body">
          <FulfillmentSelector
            settings={orderSettings}
            value={fulfillment}
            onChange={(value) => {
              onFulfillmentChange(value);
              setSheetOpen(false);
            }}
          />
        </div>
      </Sheet>
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
