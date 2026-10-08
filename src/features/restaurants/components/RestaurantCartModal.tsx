'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ApiError } from '@/shared/api/api-client';
import { CurrencyAmount } from '@/shared/components/CurrencyAmount';
import { PhoneInput } from '@/shared/components/PhoneInput';
import { useModalPresence } from '@/hooks/useModalPresence';
import { ResponsiveImage } from '@/shared/components/ResponsiveImage';
import { useCartStore } from '@/store/cart.store';
import { fetchRestaurantLocations } from '../api/locations.api';
import type { RestaurantLocation } from '@/shared/types/restaurant-location';
import { FulfillmentSelector } from './FulfillmentSelector';
import { CartLocationPicker } from './CartLocationPicker';
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
import { isCompleteBelarusPhone } from '@/shared/utils/phone.util';
import { createPreOrder } from '../api/pre-orders.api';
import type { FulfillmentType } from '@/shared/types/pre-order';
import { toPreOrderPaymentMethod } from '../utils/payment-method.util';
import { RestaurantStylingPortalRoot } from '../context/RestaurantStylingContext';
import '../styles/restaurant-cart-modal.scss';

const MODAL_ANIMATION_MS = 200;

interface RestaurantCartModalProps {
  restaurantId: string;
  orderSettings: RestaurantOrderSettings;
  bookingEnabled?: boolean;
  onClose: () => void;
  onOpenAuth?: () => void;
}

const EMPTY_CART_ITEMS: CartLineItem[] = [];

function toFulfillmentType(key: FulfillmentKey): FulfillmentType {
  switch (key) {
    case 'fulfillmentDelivery':
      return 'delivery';
    case 'fulfillmentTakeaway':
      return 'takeaway';
    case 'fulfillmentDineIn':
      return 'dine_in';
  }
}

export function RestaurantCartModal({
  restaurantId,
  orderSettings,
  bookingEnabled = false,
  onClose,
  onOpenAuth,
}: RestaurantCartModalProps) {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const paths = useRestaurantGuestPaths(restaurantId);
  const items = useCartStore((s) =>
    s.restaurantId === restaurantId ? s.items : EMPTY_CART_ITEMS,
  );
  const removeLine = useCartStore((s) => s.removeLine);
  const updateLineQuantity = useCartStore((s) => s.updateLineQuantity);
  const clearCart = useCartStore((s) => s.clearCart);

  const { mounted, isActive, handleClose } = useModalPresence(onClose, MODAL_ANIMATION_MS);
  const [fulfillment, setFulfillment] = useState<FulfillmentKey>(() =>
    getDefaultFulfillment(orderSettings),
  );
  const [payment, setPayment] = useState<PaymentKey | null>(() =>
    getDefaultPayment(orderSettings),
  );
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [orderForSomeoneElse, setOrderForSomeoneElse] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [locations, setLocations] = useState<RestaurantLocation[]>([]);
  const [locationId, setLocationId] = useState<string | null>(null);

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

  const showSomeoneElseOption =
    orderSettings.deliveryForSomeoneElse && fulfillment === 'fulfillmentDelivery';

  useEffect(() => {
    if (!showSomeoneElseOption && orderForSomeoneElse) {
      // TODO(w0): убрать после рефакторинга корзины — правило react-hooks/set-state-in-effect (до W0 не трогали UI).
      // eslint-disable-next-line react-hooks/set-state-in-effect -- legacy effect, out of scope for foundation PR
      setOrderForSomeoneElse(false);
      setRecipientName('');
      setRecipientPhone('');
    }
  }, [showSomeoneElseOption, orderForSomeoneElse]);

  const needsVenue =
    fulfillment === 'fulfillmentTakeaway' || fulfillment === 'fulfillmentDineIn';

  useEffect(() => {
    let cancelled = false;
    void fetchRestaurantLocations(restaurantId)
      .then((rows) => {
        if (!cancelled) {
          setLocations(rows);
          setLocationId((current) => current ?? rows[0]?.id ?? null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLocations([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [restaurantId]);

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

  async function handleSubmit() {
    setError(null);

    if (items.length === 0) {
      setError('Корзина пуста');
      return;
    }

    if (!enabledFulfillment.some((option) => option.key === fulfillment)) {
      setError('Выберите способ получения заказа');
      return;
    }

    if (needsVenue && locations.length > 0 && !locationId) {
      setError('Выберите точку заведения');
      return;
    }

    if (enabledPayments.length > 0 && !payment) {
      setError('Выберите способ оплаты');
      return;
    }

    if (!isGuestOfRestaurant || !accessToken) {
      setError('Войдите в аккаунт, чтобы оформить заказ');
      onOpenAuth?.();
      return;
    }

    if (showSomeoneElseOption && orderForSomeoneElse) {
      if (!recipientName.trim()) {
        setError('Укажите имя получателя');
        return;
      }

      if (!isCompleteBelarusPhone(recipientPhone)) {
        setError('Укажите корректный телефон получателя');
        return;
      }
    }

    if (comment.trim().length > 4000) {
      setError('Комментарий слишком длинный (максимум 4000 символов)');
      return;
    }

    if (!payment) {
      setError('Выберите способ оплаты');
      return;
    }

    setSubmitting(true);

    try {
      const resolvedCustomerName = customerName.trim() || user.firstName;
      const resolvedCustomerPhone = phone.trim() || user.phone || '';

      const order = await createPreOrder(restaurantId, accessToken, {
        fulfillmentType: toFulfillmentType(fulfillment),
        paymentMethod: toPreOrderPaymentMethod(payment),
        items: items.map((line) => {
          const hasModifiers = Object.values(line.modifierSelections).some(
            (ids) => ids.length > 0,
          );
          return {
            menuItemId: line.menuItemId,
            quantity: line.quantity,
            ...(hasModifiers ? { modifierSelections: line.modifierSelections } : {}),
          };
        }),
        customerName: resolvedCustomerName,
        customerPhone: resolvedCustomerPhone,
        comment: comment.trim() || undefined,
        ...(needsVenue && locationId ? { locationId } : {}),
        ...(showSomeoneElseOption && orderForSomeoneElse
          ? {
              recipientName: recipientName.trim(),
              recipientPhone: recipientPhone.trim(),
            }
          : {}),
      });

      if (order.paymentRedirectUrl) {
        clearCart();
        window.location.href = order.paymentRedirectUrl;
        return;
      }

      setSuccess('Заказ принят. Мы свяжемся с вами для подтверждения.');
      clearCart();
      window.setTimeout(handleClose, 1200);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось оформить заказ');
    } finally {
      setSubmitting(false);
    }
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
                <div className="restaurant-cart-modal__field">
                  <label htmlFor="cart-customer-phone">Телефон</label>
                  <PhoneInput
                    id="cart-customer-phone"
                    value={phone}
                    onChange={setPhone}
                  />
                </div>
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

            {needsVenue && locations.length > 0 && (
              <section className="restaurant-cart-modal__section">
                <h3 className="restaurant-cart-modal__section-title">Точка заведения</h3>
                <CartLocationPicker
                  locations={locations}
                  selectedId={locationId}
                  onSelect={setLocationId}
                />
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

            {showSomeoneElseOption && (
              <section className="restaurant-cart-modal__section">
                <h3 className="restaurant-cart-modal__section-title">Получатель</h3>
                <label className="restaurant-cart-modal__checkbox">
                  <input
                    type="checkbox"
                    checked={orderForSomeoneElse}
                    onChange={(e) => {
                      setOrderForSomeoneElse(e.target.checked);
                      if (!e.target.checked) {
                        setRecipientName('');
                        setRecipientPhone('');
                      }
                    }}
                  />
                  <span>Доставка другому человеку</span>
                </label>
                {orderForSomeoneElse && (
                  <div className="restaurant-cart-modal__recipient">
                    <p className="restaurant-cart-modal__recipient-hint">
                      Укажите, кому доставить заказ — мы свяжемся с получателем по этому номеру.
                    </p>
                    <label className="restaurant-cart-modal__field">
                      <span>Имя получателя</span>
                      <input
                        type="text"
                        autoComplete="off"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="Имя получателя"
                      />
                    </label>
                    <div className="restaurant-cart-modal__field">
                      <label htmlFor="cart-recipient-phone">Телефон получателя</label>
                      <PhoneInput
                        id="cart-recipient-phone"
                        value={recipientPhone}
                        onChange={setRecipientPhone}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                )}
              </section>
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
              <h3 className="restaurant-cart-modal__section-title">Комментарии к заказу</h3>
              <label className="restaurant-cart-modal__field">
                <span className="restaurant-cart-modal__field-hint">Необязательно</span>
                <textarea
                  rows={4}
                  maxLength={4000}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Пожелания к заказу"
                />
              </label>
            </section>

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
                          <ResponsiveImage
                            src={line.imageUrl}
                            webpSrc={line.imageWebpUrl}
                            alt=""
                          />
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
              disabled={items.length === 0 || Boolean(success) || submitting}
              onClick={() => void handleSubmit()}
            >
              {submitting
                ? 'Оформление…'
                : payment === 'paymentOnline'
                  ? 'Перейти к оплате'
                  : 'Оформить заказ'}
            </button>
          </footer>
        </div>
      </div>
      </>
    </RestaurantStylingPortalRoot>,
    document.body,
  );
}
