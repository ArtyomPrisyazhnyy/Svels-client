'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { CurrencyAmount } from '@/shared/components/CurrencyAmount';
import { useScrollLock } from '@/hooks/useScrollLock';
import { resolveImageUrl } from '@/shared/types/menu';
import { useCartStore } from '@/store/cart.store';
import { FulfillmentSelector } from './FulfillmentSelector';
import { PaymentSelector } from './PaymentSelector';
import type { CartLineItem } from '@/shared/types/cart';
import {
  getDefaultFulfillment,
  getDefaultPayment,
  getEnabledFulfillmentOptions,
  getEnabledPaymentOptions,
  type FulfillmentKey,
  type PaymentKey,
  type RestaurantOrderSettings,
} from '@/shared/types/order-settings';
import { useAuthStore } from '@/store/auth.store';
import { useRestaurantGuestPaths } from '@/shared/routing/restaurant-guest-path';
import { RestaurantStylingPortalRoot } from '../context/RestaurantStylingContext';
import '../styles/restaurant-cart-modal.scss';

const MODAL_ANIMATION_MS = 200;

interface RestaurantCartModalProps {
  restaurantId: string;
  orderSettings: RestaurantOrderSettings;
  bookingEnabled?: boolean;
  onClose: () => void;
}

function normalizePhone(value: string): string {
  return value.replace(/\D/g, '');
}

const EMPTY_CART_ITEMS: CartLineItem[] = [];

export function RestaurantCartModal({
  restaurantId,
  orderSettings,
  bookingEnabled = false,
  onClose,
}: RestaurantCartModalProps) {
  const user = useAuthStore((s) => s.user);
  const paths = useRestaurantGuestPaths(restaurantId);
  const items = useCartStore((s) =>
    s.restaurantId === restaurantId ? s.items : EMPTY_CART_ITEMS,
  );
  const removeLine = useCartStore((s) => s.removeLine);
  const updateLineQuantity = useCartStore((s) => s.updateLineQuantity);
  const clearCart = useCartStore((s) => s.clearCart);

  const [mounted, setMounted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [fulfillment, setFulfillment] = useState<FulfillmentKey>(() =>
    getDefaultFulfillment(orderSettings),
  );
  const [payment, setPayment] = useState<PaymentKey | null>(() =>
    getDefaultPayment(orderSettings),
  );
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isGuestOfRestaurant =
    user?.role === 'user' && user.restaurantId === restaurantId;

  const totalAmount = useMemo(
    () => items.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),
    [items],
  );

  const enabledFulfillment = useMemo(
    () => getEnabledFulfillmentOptions(orderSettings),
    [orderSettings],
  );

  const enabledPayments = useMemo(
    () => getEnabledPaymentOptions(orderSettings),
    [orderSettings],
  );

  useScrollLock(mounted);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsActive(true));
    });

    return () => cancelAnimationFrame(frame);
  }, [mounted]);

  const handleClose = useCallback(() => {
    setIsActive(false);
    window.setTimeout(onClose, MODAL_ANIMATION_MS);
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose]);

  function handleSubmit() {
    setError(null);

    if (items.length === 0) {
      setError('Корзина пуста');
      return;
    }

    if (!enabledFulfillment.some((option) => option.key === fulfillment)) {
      setError('Выберите способ получения заказа');
      return;
    }

    if (enabledPayments.length > 0 && !payment) {
      setError('Выберите способ оплаты');
      return;
    }

    if (!isGuestOfRestaurant) {
      if (!customerName.trim()) {
        setError('Укажите имя');
        return;
      }

      const normalizedPhone = normalizePhone(phone);
      if (normalizedPhone.length < 9) {
        setError('Укажите корректный номер телефона');
        return;
      }
    }

    setSuccess('Заказ принят. Мы свяжемся с вами для подтверждения.');
    clearCart();
    window.setTimeout(handleClose, 1200);
  }

  if (!mounted) {
    return null;
  }

  const activeClass = isActive ? ' restaurant-cart-modal--active' : '';

  return createPortal(
    <RestaurantStylingPortalRoot>
      <>
        <button
        type="button"
        className={`restaurant-cart-modal__backdrop${activeClass}`}
        onClick={handleClose}
        aria-label="Закрыть"
      />

      <div
        className={`restaurant-cart-modal${activeClass}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="restaurant-cart-modal-title"
      >
        <div className={`restaurant-cart-modal__panel${activeClass}`}>
          <button
            type="button"
            className="restaurant-cart-modal__close"
            onClick={handleClose}
            aria-label="Закрыть"
          >
            ×
          </button>

          <header className="restaurant-cart-modal__header">
            <h2 id="restaurant-cart-modal-title">Корзина</h2>
            {isGuestOfRestaurant && user && (
              <p className="restaurant-cart-modal__guest">
                Заказ от {user.firstName} {user.lastName}
              </p>
            )}
          </header>

          <div className="restaurant-cart-modal__body">
            {!isGuestOfRestaurant && (
              <section className="restaurant-cart-modal__section">
                <h3 className="restaurant-cart-modal__section-title">Контакты</h3>
                <label className="restaurant-cart-modal__field">
                  <span>Имя</span>
                  <input
                    type="text"
                    autoComplete="name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Как к вам обращаться"
                  />
                </label>
                <label className="restaurant-cart-modal__field">
                  <span>Телефон</span>
                  <input
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+375 XX XXX-XX-XX"
                  />
                </label>
              </section>
            )}

            {enabledFulfillment.length > 1 && (
              <section className="restaurant-cart-modal__section">
                <h3 className="restaurant-cart-modal__section-title">Способ получения</h3>
                <div className="restaurant-cart-modal__fulfillment">
                  <FulfillmentSelector
                    settings={orderSettings}
                    value={fulfillment}
                    onChange={setFulfillment}
                  />
                </div>
              </section>
            )}

            {enabledFulfillment.length === 1 && (
              <section className="restaurant-cart-modal__section">
                <h3 className="restaurant-cart-modal__section-title">Способ получения</h3>
                <p className="restaurant-cart-modal__fulfillment-single">
                  {enabledFulfillment[0].title}
                </p>
              </section>
            )}

            {fulfillment === 'fulfillmentDineIn' && bookingEnabled && (
              <p className="restaurant-cart-modal__cross-sell">
                Планируете прийти?{' '}
                <a href={paths.booking} className="restaurant-cart-modal__cross-sell-link">
                  Забронировать стол
                </a>
              </p>
            )}

            {enabledPayments.length > 1 && (
              <section className="restaurant-cart-modal__section">
                <h3 className="restaurant-cart-modal__section-title">Способ оплаты</h3>
                <div className="restaurant-cart-modal__fulfillment">
                  <PaymentSelector
                    settings={orderSettings}
                    value={payment ?? enabledPayments[0].key}
                    onChange={setPayment}
                  />
                </div>
              </section>
            )}

            {enabledPayments.length === 1 && (
              <section className="restaurant-cart-modal__section">
                <h3 className="restaurant-cart-modal__section-title">Способ оплаты</h3>
                <p className="restaurant-cart-modal__fulfillment-single">
                  {enabledPayments[0].title}
                </p>
              </section>
            )}

            <section className="restaurant-cart-modal__section">
              <h3 className="restaurant-cart-modal__section-title">Ваш заказ</h3>
              {items.length === 0 ? (
                <p className="restaurant-cart-modal__empty">Корзина пуста</p>
              ) : (
                <ul className="restaurant-cart-modal__list">
                  {items.map((line) => (
                    <li
                      key={line.id}
                      className={`restaurant-cart-modal__item${
                        line.imageUrl ? ' restaurant-cart-modal__item--with-image' : ''
                      }`}
                    >
                      {line.imageUrl && (
                        <div className="restaurant-cart-modal__item-media">
                          <img src={resolveImageUrl(line.imageUrl)} alt="" />
                        </div>
                      )}

                      <div className="restaurant-cart-modal__item-main">
                        <p className="restaurant-cart-modal__item-title">
                          {line.name}
                          {line.variantLabel && (
                            <span className="restaurant-cart-modal__item-variant">
                              {' '}
                              {line.variantLabel}
                            </span>
                          )}
                        </p>

                        {line.modifiers.length > 0 && (
                          <ul className="restaurant-cart-modal__modifiers">
                            {line.modifiers.map((modifier) => (
                              <li key={`${modifier.groupName}-${modifier.optionName}`}>
                                {modifier.groupName}: {modifier.optionName}
                              </li>
                            ))}
                          </ul>
                        )}

                        <p className="restaurant-cart-modal__item-price">
                          <CurrencyAmount amount={line.unitPrice * line.quantity} />
                        </p>
                      </div>

                      <div className="restaurant-cart-modal__item-actions">
                        <div className="restaurant-cart-modal__counter" aria-label="Количество">
                          <button
                            type="button"
                            className="restaurant-cart-modal__counter-btn"
                            onClick={() => updateLineQuantity(line.id, line.quantity - 1)}
                            aria-label="Уменьшить количество"
                          >
                            −
                          </button>
                          <span className="restaurant-cart-modal__counter-value">{line.quantity}</span>
                          <button
                            type="button"
                            className="restaurant-cart-modal__counter-btn"
                            onClick={() => updateLineQuantity(line.id, line.quantity + 1)}
                            aria-label="Увеличить количество"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          className="restaurant-cart-modal__remove"
                          onClick={() => removeLine(line.id)}
                        >
                          Удалить
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {error && <p className="restaurant-cart-modal__error">{error}</p>}
            {success && <p className="restaurant-cart-modal__success">{success}</p>}
          </div>

          <footer className="restaurant-cart-modal__footer">
            <p className="restaurant-cart-modal__total">
              Итого: <CurrencyAmount amount={totalAmount} />
            </p>
            <button
              type="button"
              className="restaurant-cart-modal__submit"
              disabled={items.length === 0 || Boolean(success)}
              onClick={handleSubmit}
            >
              Оформить заказ
            </button>
          </footer>
        </div>
      </div>
      </>
    </RestaurantStylingPortalRoot>,
    document.body,
  );
}
