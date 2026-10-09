'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { CurrencyAmount } from '@/shared/components/CurrencyAmount';
import { PhoneInput } from '@/shared/components/PhoneInput';
import { useModalPresence } from '@/hooks/useModalPresence';
import { ResponsiveImage } from '@/shared/components/ResponsiveImage';
import { useCartStore } from '@/store/cart.store';
import { fetchRestaurantLocations } from '../api/locations.api';
import {
  formatRestaurantLocationLine,
  type RestaurantLocation,
} from '@/shared/types/restaurant-location';
import { FulfillmentSelector } from './FulfillmentSelector';
import { CartLocationPicker } from './CartLocationPicker';
import { PaymentSelector } from './PaymentSelector';
import { DeliveryAddressFields } from './DeliveryAddressFields';
import { RequestedTimePicker } from './RequestedTimePicker';
import { OrderSuccessView } from './OrderSuccessView';
import { CartDetailRow } from './CartDetailRow';
import type { CartCheckoutDraft, CartLineItem } from '@/shared/types/cart';
import {
  getDefaultFulfillment,
  getDefaultPayment,
  getEnabledFulfillmentOptions,
  getEnabledPaymentOptions,
  PAYMENT_OPTIONS,
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
} from '../utils/checkout-payload.util';
import { getPreOrderErrorMessage, isItemUnavailableError } from '../utils/pre-order-error.util';
import { buildRequestedTimeSlots } from '../utils/requested-time.util';
import {
  getStep2Title,
  validateCartCheckout,
  type CartDetailRowKey,
} from '../utils/cart-checkout-validation.util';
import '../styles/restaurant-cart-modal.scss';

const MODAL_ANIMATION_MS = 200;
const COMMENT_MAX = 1000;
const CUSTOMER_NAME_MAX = 120;

type CartStep = 1 | 2;

interface RestaurantCartModalProps {
  restaurantId: string;
  orderSettings: RestaurantOrderSettings;
  bookingEnabled?: boolean;
  onClose: () => void;
  onOpenAuth?: () => void;
}

const EMPTY_CART_ITEMS: CartLineItem[] = [];

function toggleRowKey(
  current: Partial<Record<CartDetailRowKey, boolean>>,
  key: CartDetailRowKey,
): Partial<Record<CartDetailRowKey, boolean>> {
  return { ...current, [key]: !current[key] };
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
  const getCheckoutDraft = useCartStore((s) => s.getCheckoutDraft);
  const patchCheckoutDraft = useCartStore((s) => s.patchCheckoutDraft);

  const defaultFulfillment = useMemo(
    () => getDefaultFulfillment(orderSettings),
    [orderSettings],
  );

  const { mounted, isActive, handleClose } = useModalPresence(onClose, MODAL_ANIMATION_MS);

  const [cartStep, setCartStep] = useState<CartStep>(1);
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
  const [expandedRows, setExpandedRows] = useState<Partial<Record<CartDetailRowKey, boolean>>>(
    {},
  );
  const [showValidationHints, setShowValidationHints] = useState(false);

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

  const selectedLocation = useMemo(
    () => locations.find((row) => row.id === locationId) ?? null,
    [locations, locationId],
  );

  const timeSlots = useMemo(() => buildRequestedTimeSlots(), []);

  const timeSummary = useMemo(() => {
    if (draft.requestedAtMode === 'asap') {
      return 'Как можно скорее';
    }
    const slot = timeSlots.find((s) => s.id === draft.requestedAtSlotIso);
    return slot?.label ?? 'Ко времени';
  }, [draft.requestedAtMode, draft.requestedAtSlotIso, timeSlots]);

  const paymentSummary = useMemo(() => {
    const key = payment ?? enabledPayments[0]?.key;
    return PAYMENT_OPTIONS.find((o) => o.key === key)?.title ?? '—';
  }, [payment, enabledPayments]);

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
        if (cartStep === 2 && successOrderNumber === null) {
          setCartStep(1);
          return;
        }
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose, cartStep, successOrderNumber]);

  const requestedAtIso =
    draft.requestedAtMode === 'slot' ? draft.requestedAtSlotIso : null;

  const enabledFulfillmentKeys = useMemo(
    () => enabledFulfillment.map((o) => o.key),
    [enabledFulfillment],
  );

  const checkoutValidation = useMemo(
    () =>
      validateCartCheckout({
        items,
        ordersPaused,
        submitting,
        successOrderNumber,
        enabledFulfillmentKeys,
        fulfillment,
        enabledPaymentsCount: enabledPayments.length,
        payment,
        isGuestOfRestaurant,
        accessToken,
        draft,
        needsVenue,
        multipleLocations,
        locationId,
        showSomeoneElseOption,
      }),
    [
      items,
      ordersPaused,
      submitting,
      successOrderNumber,
      enabledFulfillmentKeys,
      fulfillment,
      enabledPayments.length,
      payment,
      isGuestOfRestaurant,
      accessToken,
      draft,
      needsVenue,
      multipleLocations,
      locationId,
      showSomeoneElseOption,
    ],
  );

  const canSubmit = checkoutValidation.canSubmit;

  const canContinueToStep2 = items.length > 0 && !ordersPaused && successOrderNumber === null;

  function expandRows(keys: CartDetailRowKey[]) {
    setExpandedRows((prev) => {
      const next = { ...prev };
      for (const key of keys) {
        next[key] = true;
      }
      return next;
    });
  }

  function handleGoToCheckout() {
    setError(null);
    if (!canContinueToStep2) {
      return;
    }
    if (!isGuestOfRestaurant || !accessToken) {
      onOpenAuth?.();
      return;
    }
    setCartStep(2);
    setShowValidationHints(false);
  }

  async function handleSubmit() {
    setError(null);
    setShowValidationHints(true);

    if (!canSubmit || !payment || !accessToken) {
      expandRows(checkoutValidation.rowsToExpand);
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
          `${getPreOrderErrorMessage(err)} Вернитесь в корзину и уберите позицию.`,
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleClearCart() {
    if (items.length === 0) {
      return;
    }
    clearCart();
    setCartStep(1);
    setError(null);
  }

  const fieldErrors = showValidationHints ? checkoutValidation.fieldErrors : {};

  if (!mounted) {
    return null;
  }

  const activeClass = isActive ? ' restaurant-cart-modal--active' : '';
  const step2 = cartStep === 2 && successOrderNumber === null;
  const modalTitle = step2 ? getStep2Title(fulfillment) : 'Корзина';
  const titleId = 'restaurant-cart-modal-title';

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
          aria-labelledby={titleId}
          data-testid="restaurant-cart-modal"
          data-cart-step={cartStep}
        >
          <div
            className={`restaurant-cart-modal__panel${activeClass}${
              step2 ? ' restaurant-cart-modal__panel--checkout' : ''
            }`}
            data-testid="cart-modal-panel"
          >
            <header
              className={`restaurant-cart-modal__header${
                step2 ? ' restaurant-cart-modal__header--checkout' : ''
              }`}
            >
              <div className="restaurant-cart-modal__header-bar" data-testid="cart-header-bar">
                <div className="restaurant-cart-modal__header-start">
                  {step2 ? (
                    <button
                      type="button"
                      className="restaurant-cart-modal__icon-btn"
                      onClick={() => setCartStep(1)}
                      aria-label="Назад к корзине"
                      data-testid="cart-back-to-step-1"
                    >
                      ←
                    </button>
                  ) : null}
                </div>
                <h2
                  id={titleId}
                  className="restaurant-cart-modal__header-title"
                  data-testid="cart-header-title"
                >
                  {modalTitle}
                </h2>
                <div className="restaurant-cart-modal__header-end">
                  {!step2 && items.length > 0 && (
                    <button
                      type="button"
                      className="restaurant-cart-modal__clear"
                      onClick={handleClearCart}
                      data-testid="cart-clear"
                    >
                      Очистить
                    </button>
                  )}
                  <button
                    type="button"
                    className="restaurant-cart-modal__icon-btn restaurant-cart-modal__close"
                    onClick={handleClose}
                    aria-label="Закрыть"
                    data-testid="cart-close"
                  >
                    ×
                  </button>
                </div>
              </div>
            </header>

            <div className="restaurant-cart-modal__body" data-testid="cart-modal-body">
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
              ) : step2 ? (
                <div className="restaurant-cart-modal__checkout" data-testid="cart-checkout-step">
                  <div className="restaurant-cart-modal__contacts-card">
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
                    {fieldErrors.contacts && (
                      <p className="restaurant-cart-modal__inline-error" role="alert">
                        {fieldErrors.contacts}
                      </p>
                    )}
                  </div>

                  {fulfillment === 'fulfillmentDelivery' && (
                    <div className="restaurant-cart-modal__address-block">
                      <DeliveryAddressFields
                        value={draft.deliveryAddress}
                        onChange={(deliveryAddress) => syncDraft({ deliveryAddress })}
                        variant="required"
                      />
                      {fieldErrors.address && (
                        <p className="restaurant-cart-modal__inline-error" role="alert">
                          {fieldErrors.address}
                        </p>
                      )}
                      <CartDetailRow
                        label="Уточнить адрес"
                        value=""
                        expanded={Boolean(expandedRows.addressExtra)}
                        onToggle={() =>
                          setExpandedRows((prev) => toggleRowKey(prev, 'addressExtra'))
                        }
                        testId="cart-address-extra-row"
                      >
                        <DeliveryAddressFields
                          value={draft.deliveryAddress}
                          onChange={(deliveryAddress) => syncDraft({ deliveryAddress })}
                          variant="extended"
                        />
                      </CartDetailRow>
                    </div>
                  )}

                  {needsVenue && multipleLocations && (
                    <CartDetailRow
                      label="Точка"
                      value={
                        selectedLocation
                          ? selectedLocation.label?.trim() ||
                            formatRestaurantLocationLine(selectedLocation)
                          : 'Не выбрана'
                      }
                      expanded={Boolean(expandedRows.location)}
                      onToggle={() => setExpandedRows((prev) => toggleRowKey(prev, 'location'))}
                      error={fieldErrors.location}
                      testId="cart-location-row"
                    >
                      <CartLocationPicker
                        locations={locations}
                        selectedId={locationId}
                        onSelect={(id) => {
                          setLocationId(id);
                          syncDraft({ locationId: id });
                        }}
                      />
                    </CartDetailRow>
                  )}

                  <CartDetailRow
                    label="Время"
                    value={timeSummary}
                    expanded={Boolean(expandedRows.time)}
                    onToggle={() => setExpandedRows((prev) => toggleRowKey(prev, 'time'))}
                    error={fieldErrors.time}
                    testId="cart-time-row"
                  >
                    <RequestedTimePicker
                      mode={draft.requestedAtMode}
                      slotIso={draft.requestedAtSlotIso}
                      onModeChange={(mode) => syncDraft({ requestedAtMode: mode })}
                      onSlotChange={(iso) => syncDraft({ requestedAtSlotIso: iso })}
                    />
                  </CartDetailRow>

                  {enabledPayments.length > 1 ? (
                    <CartDetailRow
                      label="Оплата"
                      value={paymentSummary}
                      expanded={Boolean(expandedRows.payment)}
                      onToggle={() => setExpandedRows((prev) => toggleRowKey(prev, 'payment'))}
                      testId="cart-payment-row"
                    >
                      <div className="restaurant-cart-modal__fulfillment">
                        <PaymentSelector
                          settings={orderSettings}
                          value={payment ?? enabledPayments[0].key}
                          onChange={setPayment}
                        />
                      </div>
                    </CartDetailRow>
                  ) : (
                    <div className="cart-detail-row cart-detail-row--static">
                      <span className="cart-detail-row__label">Оплата</span>
                      <span className="cart-detail-row__value">{paymentSummary}</span>
                    </div>
                  )}

                  <CartDetailRow
                    label="Комментарий"
                    value={draft.comment.trim() ? 'Добавлен' : 'Не указан'}
                    expanded={Boolean(expandedRows.comment)}
                    onToggle={() => setExpandedRows((prev) => toggleRowKey(prev, 'comment'))}
                    error={fieldErrors.comment}
                    testId="cart-comment-row"
                  >
                    <label className="restaurant-cart-modal__field restaurant-cart-modal__field--flush">
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
                  </CartDetailRow>

                  {showSomeoneElseOption && (
                    <CartDetailRow
                      label="Доставить другому человеку"
                      value={draft.orderForSomeoneElse ? 'Да' : 'Нет'}
                      expanded={Boolean(expandedRows.recipient)}
                      onToggle={() => setExpandedRows((prev) => toggleRowKey(prev, 'recipient'))}
                      error={fieldErrors.recipient}
                      testId="cart-recipient-row"
                    >
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
                          <div className="restaurant-cart-modal__field restaurant-cart-modal__field--flush">
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
                    </CartDetailRow>
                  )}

                  {fulfillment === 'fulfillmentDineIn' && bookingEnabled && (
                    <p className="restaurant-cart-modal__cross-sell restaurant-cart-modal__cross-sell--row">
                      <a href={paths.booking} className="restaurant-cart-modal__cross-sell-link">
                        Забронировать стол
                      </a>
                    </p>
                  )}

                  {error && <p className="restaurant-cart-modal__error">{error}</p>}
                </div>
              ) : (
                <>
                  {enabledFulfillment.length > 1 && (
                    <div
                      className="restaurant-cart-modal__fulfillment-block"
                      data-testid="cart-fulfillment-switcher"
                    >
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
                    </div>
                  )}

                  {items.length === 0 ? (
                    <p className="restaurant-cart-modal__empty" data-testid="cart-empty">
                      Корзина пуста
                    </p>
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

                          <div
                            className="restaurant-cart-modal__item-actions"
                            data-testid="cart-item-actions"
                          >
                            <div
                              className="restaurant-cart-modal__counter"
                              aria-label="Количество"
                              data-testid="cart-item-counter"
                            >
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
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  {error && <p className="restaurant-cart-modal__error">{error}</p>}
                </>
              )}
            </div>

            {successOrderNumber === null && (
              <footer className="restaurant-cart-modal__footer" data-testid="cart-modal-footer">
                <p className="restaurant-cart-modal__total">
                  Итого: <CurrencyAmount amount={totalAmount} />
                </p>
                {step2 ? (
                  <button
                    type="button"
                    className="restaurant-cart-modal__submit"
                    disabled={submitting}
                    onClick={() => void handleSubmit()}
                    data-testid="cart-submit"
                  >
                    {submitting ? 'Оформление…' : checkoutValidation.ctaLabel}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="restaurant-cart-modal__submit"
                    disabled={!canContinueToStep2}
                    onClick={handleGoToCheckout}
                    data-testid="cart-go-to-checkout"
                  >
                    Оформить заказ
                  </button>
                )}
              </footer>
            )}
          </div>
        </div>
      </>
    </RestaurantStylingPortalRoot>,
    document.body,
  );
}
