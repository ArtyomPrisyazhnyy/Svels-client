'use client';

import { useMemo, useState } from 'react';
import { Field, PageTitle, SegmentedControl, Select, Stack } from '@/shared/ui';
import { RestaurantStylingShell } from '@/features/restaurants/context/RestaurantStylingContext';
import {
  DEFAULT_RESTAURANT_STYLING,
  RESTAURANT_COLOR_THEME_OPTIONS,
  type RestaurantColorTheme,
} from '@/shared/types/restaurant-styling';
import type { CartLineItem } from '@/shared/types/cart';
import type { FulfillmentKey } from '@/shared/types/order-settings';
import { CartVariantDock } from './CartVariantDock';
import { CartVariantReceipt } from './CartVariantReceipt';
import { CartVariantSummary } from './CartVariantSummary';
import {
  CART_VARIANT_OPTIONS,
  createPreviewCartLines,
  type CartVariantId,
} from './cart-variant-data';
import '../../styles/cart-variants.scss';

interface CartVariantsPreviewProps {
  initialTheme: RestaurantColorTheme;
  initialVariant: CartVariantId;
}

export function CartVariantsPreview({ initialTheme, initialVariant }: CartVariantsPreviewProps) {
  const [theme, setTheme] = useState(initialTheme);
  const [variant, setVariant] = useState(initialVariant);
  const [lines, setLines] = useState<CartLineItem[]>(() => createPreviewCartLines());
  const [fulfillment, setFulfillment] = useState<FulfillmentKey>('fulfillmentDelivery');
  const [clearPromptOpen, setClearPromptOpen] = useState(false);

  const totalAmount = useMemo(
    () => lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),
    [lines],
  );

  const styling = {
    restaurantId: 'cart-variants-preview',
    ...DEFAULT_RESTAURANT_STYLING,
    colorTheme: theme,
    updatedAt: '2020-01-01T00:00:00.000Z',
  };

  function changeQuantity(line: CartLineItem, next: number) {
    setClearPromptOpen(false);
    setLines((current) => {
      if (next < 1) {
        return current.filter((item) => item.id !== line.id);
      }
      return current.map((item) => (item.id === line.id ? { ...item, quantity: next } : item));
    });
  }

  const shared = {
    lines,
    fulfillment,
    onFulfillmentChange: setFulfillment,
    onDecrement: (line: CartLineItem) => changeQuantity(line, line.quantity - 1),
    onIncrement: (line: CartLineItem) => changeQuantity(line, line.quantity + 1),
    clearPromptOpen,
    onAskClear: () => setClearPromptOpen(true),
    onCancelClear: () => setClearPromptOpen(false),
    onConfirmClear: () => {
      setLines([]);
      setClearPromptOpen(false);
    },
    totalAmount,
  };

  return (
    <RestaurantStylingShell styling={styling} enableScrollToTop={false} className="cart-variants-shell">
      <Stack gap={4} className="cart-variants-page" testId="cart-variants-page">
        <PageTitle
          title="Варианты корзины"
          subtitle="Сравнение для владельца. Страница не в меню сайта и закрыта без dev-флага."
        />
        <Field label="Тема" htmlFor="cart-variant-theme">
          <Select
            id="cart-variant-theme"
            value={theme}
            testId="cart-variant-theme"
            onChange={(event) => setTheme(event.target.value as RestaurantColorTheme)}
          >
            {RESTAURANT_COLOR_THEME_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>
        <SegmentedControl
          options={CART_VARIANT_OPTIONS.map((option) => ({
            ...option,
            testId: `cart-variant-tab-${option.value}`,
          }))}
          value={variant}
          onChange={setVariant}
          ariaLabel="Вариант корзины"
          fullWidth
          testId="cart-variant-tabs"
        />
        <div className="cart-variants-page__stage" data-testid="cart-variant-stage" data-variant={variant}>
          {variant === 'summary' ? <CartVariantSummary {...shared} /> : null}
          {variant === 'dock' ? <CartVariantDock {...shared} /> : null}
          {variant === 'receipt' ? <CartVariantReceipt {...shared} /> : null}
        </div>
      </Stack>
    </RestaurantStylingShell>
  );
}
