'use client';

import { useState } from 'react';
import { CurrencyAmount } from '@/shared/components/CurrencyAmount';
import { ResponsiveImage } from '@/shared/components/ResponsiveImage';
import { Button, SegmentedControl, Sheet, Stack } from '@/shared/ui';
import { IconChevron } from '@/shared/ui/icons/icons';
import { RestaurantStylingPortalRoot } from '../../context/RestaurantStylingContext';
import { CartClearControl, CartEmptyNote } from '../CartBasket';
import { CartQtyStepper } from '../CartLineRow';
import { FulfillmentSelector } from '../FulfillmentSelector';
import { CartVariantFrame } from './CartVariantFrame';
import {
  PREVIEW_ORDER_SETTINGS,
  fulfillmentTitle,
  type CartVariantPreviewProps,
} from './cart-variant-data';

const DOCK_TIME_OPTIONS = [
  { value: 'asap', label: 'Как можно скорее' },
  { value: 'slot', label: 'Ко времени' },
] as const;

export function CartVariantDock({
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
  const [sheetOpen, setSheetOpen] = useState(false);
  const [timeMode, setTimeMode] = useState<(typeof DOCK_TIME_OPTIONS)[number]['value']>('asap');
  const timeLabel = timeMode === 'asap' ? 'скоро' : 'ко времени';

  return (
    <CartVariantFrame
      title="Корзина"
      footer={
        <div className="cart-dock__footer">
          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            disabled={lines.length === 0}
            className="cart-dock__submit"
            testId="cart-variant-dock-checkout"
          >
            <span className="cart-dock__cta-label">Оформить</span>
            <span className="cart-dock__cta-amount">
              <CurrencyAmount amount={totalAmount} fractionDigits={2} />
            </span>
          </Button>
        </div>
      }
    >
      <Stack gap={3}>
        <Button
          type="button"
          variant="secondary"
          size="md"
          fullWidth
          className="cart-dock__summary"
          onClick={() => setSheetOpen(true)}
          testId="cart-variant-dock-summary"
        >
          <span className="cart-dock__summary-copy">
            <span className="cart-dock__summary-label">{fulfillmentTitle(fulfillment)}</span>
            <span className="cart-dock__summary-value">ул. Ленина, 1 · {timeLabel}</span>
          </span>
          <span className="cart-dock__summary-chevron" aria-hidden>
            <IconChevron />
          </span>
        </Button>

        {lines.length === 0 ? (
          <CartEmptyNote />
        ) : (
          <div className="cart-dock__list">
            <div className="cart-dock__list-tools">
              <CartClearControl
                promptOpen={clearPromptOpen}
                onAsk={onAskClear}
                onConfirm={onConfirmClear}
                onCancel={onCancelClear}
              />
            </div>
            <ul className="cart-dock__items">
              {lines.map((line) => (
                <li key={line.id} className="cart-dock__item">
                  {line.imageUrl ? (
                    <div className="cart-dock__media">
                      <ResponsiveImage src={line.imageUrl} webpSrc={line.imageWebpUrl} alt="" />
                    </div>
                  ) : (
                    <span className="cart-dock__fallback" aria-hidden>
                      {line.name.slice(0, 1)}
                    </span>
                  )}
                  <div className="cart-dock__copy">
                    <p className="cart-dock__name">
                      {line.name}
                      {line.variantLabel ? (
                        <span className="cart-dock__variant"> {line.variantLabel}</span>
                      ) : null}
                    </p>
                    {line.modifiers.length > 0 ? (
                      <p className="cart-dock__meta">
                        {line.modifiers.map((modifier) => modifier.optionName).join(' · ')}
                      </p>
                    ) : null}
                  </div>
                  <div className="cart-dock__qty">
                    <CartQtyStepper
                      quantity={line.quantity}
                      onDecrement={() => onDecrement(line)}
                      onIncrement={() => onIncrement(line)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Stack>

      <Sheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Детали заказа"
        testId="cart-variant-dock-sheet"
        stacked
        wrap={(node) => <RestaurantStylingPortalRoot>{node}</RestaurantStylingPortalRoot>}
        footer={
          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => setSheetOpen(false)}
            testId="cart-variant-dock-done"
          >
            Готово
          </Button>
        }
      >
        <Stack gap={4} className="cart-dock__sheet">
          <FulfillmentSelector
            settings={PREVIEW_ORDER_SETTINGS}
            value={fulfillment}
            onChange={onFulfillmentChange}
          />
          <p className="cart-dock__address">ул. Ленина, 1</p>
          <SegmentedControl
            options={DOCK_TIME_OPTIONS.map((option) => ({ ...option }))}
            value={timeMode}
            onChange={setTimeMode}
            ariaLabel="Время получения"
            fullWidth
            testId="cart-variant-dock-time"
          />
        </Stack>
      </Sheet>
    </CartVariantFrame>
  );
}
