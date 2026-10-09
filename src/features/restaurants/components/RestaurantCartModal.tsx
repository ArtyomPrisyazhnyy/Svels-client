'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
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
import { DeliveryAddressFields } from './DeliveryAddressFields';
import { RequestedTimePicker } from './RequestedTimePicker';
import { OrderSuccessView } from './OrderSuccessView';
import type { CartCheckoutDraft, CartLineItem } from '@/shared/types/cart';
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
import {
  isCompleteBelarusPhone,
  normalizePhoneForPhoneInput,
} from '@/shared/utils/phone.util';
import { createPreOrder } from '../api/pre-orders.api';
import { RestaurantStylingPortalRoot } from '../context/RestaurantStylingContext';
import {
  buildCreatePreOrderPayload,
  isDeliveryAddressComplete,
} from '../utils/checkout-payload.util';
import { getPreOrderErrorMessage, isItemUnavailableError } from '../utils/pre-order-error.util';
import '../styles/restaurant-cart-modal.scss';

const MODAL_ANIMATION_MS = 200;
const COMMENT_MAX = 1000;
const CUSTOMER_NAME_MAX = 120;

interface RestaurantCartModalProps {
  restaurantId: string;
  orderSettings: RestaurantOrderSettings;
  bookingEnabled?: boolean;
  onClose: () => void;
  onOpenAuth?: () => void;
}

const EMPTY_CART_ITEMS: CartLineItem[] = [];

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
  const getCheckoutDraft = useCartStore((s) => s.getCheckoutDraft);
  const patchCheckoutDraft = useCartStore((s) => s.patchCheckoutDraft);

  const defaultFulfillment = useMemo(
    () => getDefaultFulfillment(orderSettings),
    [orderSettings],
  );

  const { mounted, isActive, handleClose } = useModalPresence(onClose, MODAL_ANIMATION_MS);

  const [fulfillment, setFulfillment] = useState<FulfillmentKey>(defaultFulfillment);
  const [payment, setPayment] = useState<PaymentKey | null>(() =>
    getDefaultPayment(orderSettings),
  );
  const [draft, setDraft] = useState<CartCheckoutDraft>(() =>
    getCheckoutDraft(restaurantId, defaultFulfillment),
  );
  const [error, setError] = useState<string | null>(null);
  const [successOrderNumber, setSuccessOrderNumber] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [locations, setLocations] = useState<RestaurantLocation[]>([]);
  const [locationId, setLocationId] = useState<string | null>(draft.locationId);

  const ordersPaused = orderSettings.ordersPaused === true;

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

  const needsVenue =
    fulfillment === 'fulfillmentTakeaway' || fulfillment === 'fulfillmentDineIn';

  const multipleLocations = locations.length > 1;

  const syncDraft = useCallback(
    (patch: Partial<CartCheckoutDraft>) => {
      setDraft((prev) => {
        const next = { ...prev, ...patch };
        patchCheckoutDraft(restaurantId, next);
        return next;
      });
    },
    [patchCheckoutDraft, restaurantId],
  );

  useEffect(() => {
    const stored = getCheckoutDraft(restaurantId, defaultFulfillment);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate checkout draft from persist
    setDraft(stored);
    setFulfillment(
      enabledFulfillment.some((o) => o.key === stored.fulfillment)
        ? stored.fulfillment
        : defaultFulfillment,
    );
    setLocationId(stored.locationId);
  }, [restaurantId, defaultFulfillment, getCheckoutDraft, enabledFulfillment]);

  useEffect(() => {
    if (!user || !isGuestOfRestaurant) {
      return;
    }
    const nameFromProfile = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
    const phoneFromProfile = user.phone ? normalizePhoneForPhoneInput(user.phone) : '';
    if (!draft.customerName && nameFromProfile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- prefill from profile once
      syncDraft({ customerName: nameFromProfile });
    }
    if (!draft.phone && phoneFromProfile) {
      syncDraft({ phone: phoneFromProfile });
    }
  }, [user, isGuestOfRestaurant, draft.customerName, draft.phone, syncDraft]);

  useEffect(() => {
    if (!showSomeoneElseOption && draft.orderForSomeoneElse) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset recipient when option hidden
      syncDraft({
        orderForSomeoneElse: false,
        recipientName: '',
        recipientPhone: '',
      });
    }
  }, [showSomeoneElseOption, draft.orderForSomeoneElse, syncDraft]);

  useEffect(() => {
    if (!enabledFulfillment.some((o) => o.key === fulfillment)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clamp to enabled fulfillment
      setFulfillment(defaultFulfillment);
      syncDraft({ fulfillment: defaultFulfillment });
    }
  }, [enabledFulfillment, fulfillment, defaultFulfillment, syncDraft]);

  useEffect(() => {
    let cancelled = false;
    void fetchRestaurantLocations(restaurantId)
      .then((rows) => {
        if (!cancelled) {
          setLocations(rows);
          const fallback = rows[0]?.id ?? null;
          setLocationId((current) => current ?? fallback);
          if (!draft.locationId && fallback) {
            syncDraft({ locationId: fallback });
          }
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
  }, [restaurantId, draft.locationId, syncDraft]);

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

  const requestedAtIso =
    draft.requestedAtMode === 'slot' ? draft.requestedAtSlotIso : null;

  const canSubmit = useMemo(() => {
    if (items.length === 0 || ordersPaused || submitting || successOrderNumber !== null) {
      return false;
    }
    if (!enabledFulfillment.some((option) => option.key === fulfillment)) {
      return false;
    }
    if (enabledPayments.length > 0 && !payment) {
      return false;
    }
    if (!isGuestOfRestaurant || !accessToken) {
      return false;
    }
    const customerName = draft.customerName.trim();
    if (!customerName || customerName.length > CUSTOMER_NAME_MAX) {
      return false;
    }
    if (!isCompleteBelarusPhone(draft.phone)) {
      return false;
    }
    if (fulfillment === 'fulfillmentDelivery' && !isDeliveryAddressComplete(draft.deliveryAddress)) {
      return false;
    }
    if (needsVenue && multipleLocations && !locationId) {
      return false;
    }
    if (showSomeoneElseOption && draft.orderForSomeoneElse) {
      if (!draft.recipientName.trim()) {
        return false;
      }
      if (!isCompleteBelarusPhone(draft.recipientPhone)) {
        return false;
      }
    }
    if (draft.comment.trim().length > COMMENT_MAX) {
      return false;
    }
    if (draft.requestedAtMode === 'slot' && !draft.requestedAtSlotIso) {
      return false;
    }
    return true;
  }, [
    items.length,
    ordersPaused,
    submitting,
    successOrderNumber,
    enabledFulfillment,
    fulfillment,
    enabledPayments,
    payment,
    isGuestOfRestaurant,
    accessToken,
    draft,
    needsVenue,
    multipleLocations,
    locationId,
    showSomeoneElseOption,
  ]);

  async function handleSubmit() {
    setError(null);

    if (!canSubmit || !payment || !accessToken) {
      if (!isGuestOfRestaurant || !accessToken) {
        setError('Войдите в аккаунт, чтобы оформить заказ');
        onOpenAuth?.();
      }
      return;
    }

    setSubmitting(true);

    try {
      const payload = buildCreatePreOrderPayload({
        fulfillment,
        payment,
        items,
        customerName: draft.customerName,
        customerPhone: draft.phone,
        locationId,
        deliveryAddress:
          fulfillment === 'fulfillmentDelivery' ? draft.deliveryAddress : null,
        requestedAtIso,
        orderForSomeoneElse: draft.orderForSomeoneElse,
        recipientName: draft.recipientName,
        recipientPhone: draft.recipientPhone,
        comment: draft.comment,
        needsVenue,
        multipleLocations,
        showSomeoneElseOption,
      });

      const order = await createPreOrder(restaurantId, accessToken, payload);

      if (order.paymentRedirectUrl) {
        clearCart();
        window.location.href = order.paymentRedirectUrl;
        return;
      }

      setSuccessOrderNumber(order.orderNumber);
      clearCart();
    } catch (err) {
      setError(getPreOrderErrorMessage(err));
      if (isItemUnavailableError(err) && items.length === 1) {
        setError(
          `${getPreOrderErrorMessage(err)} Нажмите «Удалить» у позиции в корзине.`,
        );
      }
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
          data-testid="restaurant-cart-modal"
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
              {ordersPaused && (
                <div
                  className="restaurant-cart-modal__paused"
                  data-testid="orders-paused-banner"
                  role="status"
                >
                  Заведение сейчас не принимает заказы
                </div>
              )}

              {successOrderNumber !== null ? (
                <OrderSuccessView
                  orderNumber={successOrderNumber}
                  ordersHref={paths.preOrder}
                  onClose={handleClose}
                />
              ) : (
                <>
                  <section className="restaurant-cart-modal__section">
                    <h3 className="restaurant-cart-modal__section-title">Контакты</h3>
                    <label className="restaurant-cart-modal__field">
                      <span>Имя *</span>
                      <input
                        type="text"
                        autoComplete="name"
                        maxLength={CUSTOMER_NAME_MAX}
                        value={draft.customerName}
                        onChange={(e) => syncDraft({ customerName: e.target.value })}
                        placeholder="Как к вам обращаться"
                        data-testid="cart-customer-name"
                      />
                    </label>
                    <div className="restaurant-cart-modal__field">
                      <label htmlFor="cart-customer-phone">Телефон *</label>
                      <PhoneInput
                        id="cart-customer-phone"
                        value={draft.phone}
                        onChange={(value) => syncDraft({ phone: value })}
                      />
                    </div>
                  </section>

                  {enabledFulfillment.length > 1 && (
                    <section className="restaurant-cart-modal__section">
                      <h3 className="restaurant-cart-modal__section-title">Способ получения</h3>
                      <div className="restaurant-cart-modal__fulfillment">
                        <FulfillmentSelector
                          settings={orderSettings}
                          value={fulfillment}
                          onChange={(value) => {
                            setFulfillment(value);
                            syncDraft({ fulfillment: value });
                          }}
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

                  {fulfillment === 'fulfillmentDelivery' && (
                    <section className="restaurant-cart-modal__section">
                      <h3 className="restaurant-cart-modal__section-title">Адрес доставки</h3>
                      <DeliveryAddressFields
                        value={draft.deliveryAddress}
                        onChange={(deliveryAddress) => syncDraft({ deliveryAddress })}
                      />
                    </section>
                  )}

                  {needsVenue && multipleLocations && (
                    <section className="restaurant-cart-modal__section">
                      <h3 className="restaurant-cart-modal__section-title">Точка заведения</h3>
                      <CartLocationPicker
                        locations={locations}
                        selectedId={locationId}
                        onSelect={(id) => {
                          setLocationId(id);
                          syncDraft({ locationId: id });
                        }}
                      />
                    </section>
                  )}

                  <section className="restaurant-cart-modal__section">
                    <h3 className="restaurant-cart-modal__section-title">Время</h3>
                    <RequestedTimePicker
                      mode={draft.requestedAtMode}
                      slotIso={draft.requestedAtSlotIso}
                      onModeChange={(mode) => syncDraft({ requestedAtMode: mode })}
                      onSlotChange={(iso) => syncDraft({ requestedAtSlotIso: iso })}
                    />
                  </section>

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
                          checked={draft.orderForSomeoneElse}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            syncDraft({
                              orderForSomeoneElse: checked,
                              ...(checked
                                ? {}
                                : { recipientName: '', recipientPhone: '' }),
                            });
                          }}
                        />
                        <span>Доставка другому человеку</span>
                      </label>
                      {draft.orderForSomeoneElse && (
                        <div className="restaurant-cart-modal__recipient">
                          <p className="restaurant-cart-modal__recipient-hint">
                            Укажите, кому доставить заказ — мы свяжемся с получателем по этому
                            номеру.
                          </p>
                          <label className="restaurant-cart-modal__field">
                            <span>Имя получателя *</span>
                            <input
                              type="text"
                              autoComplete="off"
                              value={draft.recipientName}
                              onChange={(e) => syncDraft({ recipientName: e.target.value })}
                              placeholder="Имя получателя"
                            />
                          </label>
                          <div className="restaurant-cart-modal__field">
                            <label htmlFor="cart-recipient-phone">Телефон получателя *</label>
                            <PhoneInput
                              id="cart-recipient-phone"
                              value={draft.recipientPhone}
                              onChange={(value) => syncDraft({ recipientPhone: value })}
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
                      <span className="restaurant-cart-modal__field-hint">
                        Необязательно · {draft.comment.length}/{COMMENT_MAX}
                      </span>
                      <textarea
                        rows={3}
                        maxLength={COMMENT_MAX}
                        value={draft.comment}
                        onChange={(e) => syncDraft({ comment: e.target.value })}
                        placeholder="Пожелания к заказу"
                        data-testid="cart-comment"
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
                                <span className="restaurant-cart-modal__counter-value">
                                  {line.quantity}
                                </span>
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
                </>
              )}
            </div>

            {successOrderNumber === null && (
              <footer className="restaurant-cart-modal__footer">
                <p className="restaurant-cart-modal__total">
                  Итого: <CurrencyAmount amount={totalAmount} />
                </p>
                <button
                  type="button"
                  className="restaurant-cart-modal__submit"
                  disabled={!canSubmit}
                  onClick={() => void handleSubmit()}
                  data-testid="cart-submit"
                >
                  {submitting
                    ? 'Оформление…'
                    : payment === 'paymentOnline'
                      ? 'Перейти к оплате'
                      : 'Оформить заказ'}
                </button>
              </footer>
            )}
          </div>
        </div>
      </>
    </RestaurantStylingPortalRoot>,
    document.body,
  );
}
