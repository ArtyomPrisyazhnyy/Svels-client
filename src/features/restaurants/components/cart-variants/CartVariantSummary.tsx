'use client';

import { Button } from '@/shared/ui';
import { CartBasketBody, CartCheckoutBar } from '../CartBasket';
import { CartVariantFrame } from './CartVariantFrame';
import { PREVIEW_ORDER_SETTINGS, type CartVariantPreviewProps } from './cart-variant-data';

export function CartVariantSummary({
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
  return (
    <CartVariantFrame
      title="Корзина"
      footer={
        <CartCheckoutBar totalAmount={totalAmount}>
          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            disabled={lines.length === 0}
            testId="cart-variant-checkout"
            className="restaurant-cart-modal__submit"
          >
            Оформить заказ
          </Button>
        </CartCheckoutBar>
      }
    >
      <CartBasketBody
        items={lines}
        orderSettings={PREVIEW_ORDER_SETTINGS}
        fulfillment={fulfillment}
        onFulfillmentChange={onFulfillmentChange}
        onDecrement={onDecrement}
        onIncrement={onIncrement}
        clearPromptOpen={clearPromptOpen}
        onAskClear={onAskClear}
        onCancelClear={onCancelClear}
        onConfirmClear={onConfirmClear}
      />
    </CartVariantFrame>
  );
}
