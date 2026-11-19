'use client';

import { type ReactNode } from 'react';
import { CurrencyAmount } from '@/shared/components/CurrencyAmount';
import type { CartGiftReward } from '@/shared/types/pre-order';
import { Button, Cluster, Skeleton, Stack } from '@/shared/ui';
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

export interface CartCheckoutTotals {
  mode: 'skeleton' | 'fallback' | 'quote';
  total: number;
  subtotal?: number;
  discountLabel?: string | null;
  discountAmount?: number | null;
  gifts?: CartGiftReward[];
  onRetry?: () => void;
  priceNoticeAmount?: number | null;
}

interface CartCheckoutBarProps {
  totalAmount: number;
  totals?: CartCheckoutTotals;
  children: ReactNode;
}

function CartTotalAmount({ amount, testId }: { amount: number; testId?: string }) {
  return (
    <span className="restaurant-cart-modal__total-amount" data-testid={testId}>
      <CurrencyAmount amount={amount} fractionDigits={2} />
    </span>
  );
}

function CartQuoteLines({ totals }: { totals: CartCheckoutTotals }) {
  const gifts = totals.gifts ?? [];
  const showDiscount = Boolean(totals.discountLabel) && (totals.discountAmount ?? 0) > 0;
  const showSubtotal = showDiscount || gifts.length > 0;

  return (
    <div
      className={
        showSubtotal
          ? 'restaurant-cart-modal__totals'
          : 'restaurant-cart-modal__totals restaurant-cart-modal__totals--flat'
      }
    >
      {showSubtotal && totals.subtotal != null && (
        <p className="restaurant-cart-modal__quote-line" data-testid="cart-subtotal">
          <span className="restaurant-cart-modal__quote-line-label">Подытог</span>
          <span className="restaurant-cart-modal__quote-line-amount">
            <CurrencyAmount amount={totals.subtotal} fractionDigits={2} />
          </span>
        </p>
      )}
      {showDiscount && (
        <p
          className="restaurant-cart-modal__quote-line restaurant-cart-modal__quote-line--discount"
          data-testid="cart-loyalty-discount"
        >
          <span className="restaurant-cart-modal__quote-line-label">{totals.discountLabel}</span>
          <span className="restaurant-cart-modal__quote-line-amount">
            −<CurrencyAmount amount={totals.discountAmount ?? 0} fractionDigits={2} />
          </span>
        </p>
      )}
      {gifts.map((gift) => (
        <p
          key={gift.name}
          className="restaurant-cart-modal__quote-line"
          data-testid="cart-gift-reward"
        >
          <span className="restaurant-cart-modal__quote-line-label">Подарок: {gift.name}</span>
        </p>
      ))}
      <p className="restaurant-cart-modal__total" data-testid="cart-totals">
        <span className="restaurant-cart-modal__total-label">Итого</span>
        <CartTotalAmount amount={totals.total} testId="cart-server-total" />
      </p>
    </div>
  );
}

function CartTotalsBlock({ totalAmount, totals }: { totalAmount: number; totals?: CartCheckoutTotals }) {
  if (!totals || totals.mode === 'fallback') {
    return (
      <p className="restaurant-cart-modal__total" data-testid="cart-totals">
        <span className="restaurant-cart-modal__total-label">Итого</span>
        {totals?.onRetry ? (
          <Button
            type="button"
            variant="link"
            size="sm"
            className="restaurant-cart-modal__quote-retry"
            onClick={totals.onRetry}
            testId="cart-quote-retry"
          >
            Повторить
          </Button>
        ) : null}
        <CartTotalAmount amount={totals?.total ?? totalAmount} testId="cart-server-total" />
      </p>
    );
  }

  if (totals.mode === 'skeleton') {
    return (
      <p
        className="restaurant-cart-modal__total"
        data-testid="cart-totals-skeleton"
        aria-busy="true"
        aria-hidden
      >
        <Skeleton variant="text" width="5rem" height="0.875rem" />
        <Skeleton variant="text" width="6rem" height="1.25rem" />
      </p>
    );
  }

  return <CartQuoteLines totals={totals} />;
}

export function CartCheckoutBar({ totalAmount, totals, children }: CartCheckoutBarProps) {
  const notice = totals?.priceNoticeAmount;
  const showNotice = notice != null;
  const hasBreakdown =
    totals?.mode === 'quote' &&
    (((totals.discountAmount ?? 0) > 0 && Boolean(totals.discountLabel)) ||
      (totals.gifts?.length ?? 0) > 0);
  const stacked = showNotice || hasBreakdown;
  const totalsBlock = <CartTotalsBlock totalAmount={totalAmount} totals={totals} />;

  return (
    <footer
      className={
        stacked
          ? 'restaurant-cart-modal__footer restaurant-cart-modal__footer--stacked'
          : 'restaurant-cart-modal__footer'
      }
      data-testid="cart-modal-footer"
    >
      {showNotice && (
        <div className="restaurant-cart-modal__price-notice" data-testid="cart-price-changed" role="status">
          <p className="restaurant-cart-modal__price-notice-title">Цена изменилась</p>
          <p className="restaurant-cart-modal__price-notice-text">
            Новая сумма <CurrencyAmount amount={notice} fractionDigits={2} />
          </p>
        </div>
      )}
      {stacked ? (
        <div className="restaurant-cart-modal__footer-bar">
          {totalsBlock}
          {children}
        </div>
      ) : (
        <>
          {totalsBlock}
          {children}
        </>
      )}
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
