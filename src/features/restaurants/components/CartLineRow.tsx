'use client';

import { ResponsiveImage } from '@/shared/components/ResponsiveImage';
import type { CartLineItem } from '@/shared/types/cart';
import { CurrencyAmount } from '@/shared/components/CurrencyAmount';
import '../styles/restaurant-cart-modal.scss';

interface CartQtyStepperProps {
  quantity: number;
  onDecrement: () => void;
  onIncrement: () => void;
  quiet?: boolean;
}

export function CartQtyStepper({
  quantity,
  onDecrement,
  onIncrement,
  quiet = false,
}: CartQtyStepperProps) {
  return (
    <div
      className={
        quiet
          ? 'restaurant-cart-modal__counter restaurant-cart-modal__counter--quiet'
          : 'restaurant-cart-modal__counter'
      }
      aria-label="Количество"
      data-testid="cart-item-counter"
    >
      <button
        type="button"
        className="restaurant-cart-modal__counter-btn"
        onClick={onDecrement}
        aria-label="Уменьшить количество"
      >
        −
      </button>
      <span className="restaurant-cart-modal__counter-value">{quantity}</span>
      <button
        type="button"
        className="restaurant-cart-modal__counter-btn"
        onClick={onIncrement}
        aria-label="Увеличить количество"
      >
        +
      </button>
    </div>
  );
}

interface CartLineRowProps {
  line: CartLineItem;
  onDecrement: () => void;
  onIncrement: () => void;
}

export function CartLineRow({ line, onDecrement, onIncrement }: CartLineRowProps) {
  const hasNotes = Boolean(line.variantLabel) || line.modifiers.length > 0;

  return (
    <li className="restaurant-cart-modal__item" data-testid="cart-line">
      <div className="restaurant-cart-modal__item-media">
        {line.imageUrl ? (
          <ResponsiveImage src={line.imageUrl} webpSrc={line.imageWebpUrl} alt="" />
        ) : null}
      </div>

      <div className="restaurant-cart-modal__item-main">
        <div className="restaurant-cart-modal__item-head">
          <p className="restaurant-cart-modal__item-title">{line.name}</p>
          <p className="restaurant-cart-modal__item-price">
            <CurrencyAmount amount={line.unitPrice * line.quantity} fractionDigits={2} />
          </p>
        </div>
        <div className="restaurant-cart-modal__item-foot">
          {hasNotes ? (
            <div className="restaurant-cart-modal__item-notes">
              {line.variantLabel ? (
                <p className="restaurant-cart-modal__item-variant">{line.variantLabel}</p>
              ) : null}
              {line.modifiers.length > 0 ? (
                <ul className="restaurant-cart-modal__modifiers">
                  {line.modifiers.map((modifier) => (
                    <li key={`${modifier.groupName}-${modifier.optionName}`}>
                      {modifier.groupName}: {modifier.optionName}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
          <div className="restaurant-cart-modal__item-actions" data-testid="cart-item-actions">
            <CartQtyStepper
              quantity={line.quantity}
              onDecrement={onDecrement}
              onIncrement={onIncrement}
            />
          </div>
        </div>
      </div>
    </li>
  );
}
