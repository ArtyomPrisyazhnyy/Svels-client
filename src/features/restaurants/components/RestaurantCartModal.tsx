'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { PhoneInput } from '@/shared/components/PhoneInput';
import { Modal, Stack } from '@/shared/ui';
import { Button } from '@/shared/ui/Button/Button';
import { Checkbox } from '@/shared/ui/Checkbox/Checkbox';
import { Field } from '@/shared/ui/Field/Field';
import { IconButton } from '@/shared/ui/IconButton/IconButton';
import { Input } from '@/shared/ui/Input/Input';
import { Textarea } from '@/shared/ui/Textarea/Textarea';
import { IconBack } from '@/shared/ui/icons/icons';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import { useCartStore } from '@/store/cart.store';
import { ApiError } from '@/shared/api/api-client';
import { fetchRestaurantLocations } from '../api/locations.api';
import {
  formatRestaurantLocationLine,
  type RestaurantLocation,
} from '@/shared/types/restaurant-location';
import { CartBasketBody, CartCheckoutBar } from './CartBasket';
import { CartLocationPicker } from './CartLocationPicker';
import { PaymentSelector } from './PaymentSelector';
import {
  CartCheckoutDeliveryAddressInline,
  CartCheckoutGuestAddressLoader,
  CartCheckoutGuestAddressSheet,
  CartCheckoutSavedAddressRow,
  CartCheckoutSavedAddressRowSkeleton,
  selectCheckoutSelectedAddressId,
  selectCheckoutUsesSavedAddresses,
} from './addresses/CartCheckoutDeliveryAddress';
import { useGuestAddressesStore } from '@/store/guest-addresses.store';
import { RequestedTimePicker } from './RequestedTimePicker';
import { OrderSuccessView } from './OrderSuccessView';
import { CartDetailRow } from './CartDetailRow';
import { CartCheckoutSection } from './CartCheckoutSection';
import { CartCheckoutFieldSection } from './CartCheckoutFieldSection';
import '../styles/cart-checkout-section.scss';
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
import { normalizePhoneForPhoneInput } from '@/shared/utils/phone.util';
import { createPreOrder } from '../api/pre-orders.api';
import { RestaurantStylingPortalRoot } from '../context/RestaurantStylingContext';
import {
  buildCreatePreOrderPayload,
} from '../utils/checkout-payload.util';
import { getPreOrderErrorMessage, isItemUnavailableError } from '../utils/pre-order-error.util';
import {
  getStep2Title,
  validateCartCheckout,
  type CartDetailRowKey,
} from '../utils/cart-checkout-validation.util';
import '../styles/restaurant-cart-modal.scss';

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
  const authHydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const paths = useRestaurantGuestPaths(restaurantId);
  const items = useCartStore((s) =>
    s.restaurantId === restaurantId ? s.items : EMPTY_CART_ITEMS,
  );
  const updateLineQuantity = useCartStore((s) => s.updateLineQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const getCheckoutDraft = useCartStore((s) => s.getCheckoutDraft);
  const patchCheckoutDraft = useCartStore((s) => s.patchCheckoutDraft);

  const defaultFulfillment = useMemo(
    () => getDefaultFulfillment(orderSettings),
    [orderSettings],
  );

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
  const [clearPromptOpen, setClearPromptOpen] = useState(false);
  const [addressSheetOpen, setAddressSheetOpen] = useState(false);

  const ordersPaused = orderSettings.ordersPaused === true;

  const isGuestOfRestaurant =
    user?.role === 'user' && user.restaurantId === restaurantId;

  const guestAddressesStatus = useGuestAddressesStore(
    (s) => s.byRestaurant[restaurantId]?.status ?? 'idle',
  );
  const guestAddressesCount = useGuestAddressesStore(
    (s) => s.byRestaurant[restaurantId]?.addresses.length ?? 0,
  );
  const selectedGuestAddressId = useGuestAddressesStore(
    (s) => s.byRestaurant[restaurantId]?.selectedId ?? null,
  );
  const deliveryAddressesLoading =
    isGuestOfRestaurant &&
    Boolean(accessToken) &&
    (guestAddressesStatus === 'loading' || guestAddressesStatus === 'idle');

  const deliveryUsesSavedAddresses =
    isGuestOfRestaurant &&
    Boolean(accessToken) &&
    guestAddressesStatus === 'ready' &&
    guestAddressesCount > 0;

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
    if (!clearPromptOpen) {
      return;
    }
    const timer = window.setTimeout(() => setClearPromptOpen(false), 5000);
    return () => window.clearTimeout(timer);
  }, [clearPromptOpen]);

  useEffect(() => {
    if (!enabledFulfillment.some((o) => o.key === fulfillment)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clamp to enabled fulfillment
      setFulfillment(defaultFulfillment);
      syncDraft({ fulfillment: defaultFulfillment });
    }
  }, [enabledFulfillment, fulfillment, defaultFulfillment, syncDraft]);

  useEffect(() => {
    let cancelled = false;
    const retryDelaysMs = [0, 500, 1000, 2000, 4000, 8000, 8000];

    const load = async () => {
      for (let attempt = 0; attempt < retryDelaysMs.length; attempt += 1) {
        const delay = retryDelaysMs[attempt];
        if (delay > 0) {
          await new Promise((resolve) => {
            window.setTimeout(resolve, delay);
          });
        }
        if (cancelled) {
          return;
        }
        try {
          const rows = await fetchRestaurantLocations(restaurantId);
          if (cancelled) {
            return;
          }
          setLocations(rows);
          const fallback = rows[0]?.id ?? null;
          setLocationId((current) => current ?? fallback);
          if (!getCheckoutDraft(restaurantId).locationId && fallback) {
            syncDraft({ locationId: fallback });
          }
          return;
        } catch (error) {
          const rateLimited = error instanceof ApiError && error.status === 429;
          const lastAttempt = attempt === retryDelaysMs.length - 1;
          if (!rateLimited || lastAttempt) {
            if (!cancelled) {
              setLocations([]);
            }
            return;
          }
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [restaurantId, syncDraft, getCheckoutDraft]);

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
        deliveryUsesSavedAddresses,
        selectedGuestAddressId,
        deliveryAddressesLoading,
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
      deliveryUsesSavedAddresses,
      selectedGuestAddressId,
      deliveryAddressesLoading,
    ],
  );

  const canSubmit = checkoutValidation.canSubmit;

  const canContinueToStep2 =
    authHydrated && items.length > 0 && !ordersPaused && successOrderNumber === null;

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
      const usesSavedAddresses =
        fulfillment === 'fulfillmentDelivery' &&
        isGuestOfRestaurant &&
        selectCheckoutUsesSavedAddresses(restaurantId);

      const payload = buildCreatePreOrderPayload({
        fulfillment,
        payment,
        items,
        customerName: draft.customerName,
        customerPhone: draft.phone,
        locationId,
        deliveryAddress:
          fulfillment === 'fulfillmentDelivery' && !usesSavedAddresses
            ? draft.deliveryAddress
            : null,
        addressId:
          fulfillment === 'fulfillmentDelivery' && usesSavedAddresses
            ? selectCheckoutSelectedAddressId(restaurantId)
            : null,
        saveAddress:
          fulfillment === 'fulfillmentDelivery' &&
          !usesSavedAddresses &&
          draft.saveDeliveryAddress,
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
      if (accessToken && fulfillment === 'fulfillmentDelivery') {
        void useGuestAddressesStore.getState().loadAddresses(restaurantId, accessToken);
      }
      clearCart();
    } catch (err) {
      setError(getPreOrderErrorMessage(err));
      if (err instanceof ApiError && err.code === 'phone_required') {
        setShowValidationHints(true);
        expandRows(['contacts']);
        window.setTimeout(() => {
          document.getElementById('cart-customer-phone')?.focus();
        }, 0);
      }
      if (isItemUnavailableError(err) && items.length === 1) {
        setError(
          `${getPreOrderErrorMessage(err)} Вернитесь в корзину и уберите позицию.`,
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleClearCartConfirmed() {
    if (items.length === 0) {
      return;
    }
    clearCart();
    setCartStep(1);
    setError(null);
    setClearPromptOpen(false);
  }

  const fieldErrors = showValidationHints ? checkoutValidation.fieldErrors : {};

  const step2 = cartStep === 2 && successOrderNumber === null;
  const basketStep = !step2 && successOrderNumber === null;
  const modalTitle = step2 ? getStep2Title(fulfillment) : 'Корзина';
  const titleId = 'restaurant-cart-modal-title';

  const footer =
    successOrderNumber === null ? (
      <CartCheckoutBar totalAmount={totalAmount}>
        {step2 ? (
          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            loading={submitting}
            disabled={submitting}
            onClick={() => void handleSubmit()}
            testId="cart-submit"
            className="restaurant-cart-modal__submit"
          >
            {submitting ? 'Оформление…' : checkoutValidation.ctaLabel}
          </Button>
        ) : (
          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            disabled={!canContinueToStep2}
            onClick={handleGoToCheckout}
            testId="cart-go-to-checkout"
            className="restaurant-cart-modal__submit"
          >
            Оформить заказ
          </Button>
        )}
      </CartCheckoutBar>
    ) : undefined;

  return (
    <Modal
        open
        onClose={onClose}
        title={modalTitle}
        titleId={titleId}
        size="md"
        rootTestId="restaurant-cart-modal"
        testId="cart-modal-panel"
        closeTestId="cart-close"
        headerTestId="cart-header-bar"
        titleTestId="cart-header-title"
        modalClassName="ui-modal--cart-sheet"
        panelClassName={`restaurant-cart-modal__panel${
          step2 ? ' restaurant-cart-modal__panel--checkout' : ''
        }`}
        wrap={(node) => <RestaurantStylingPortalRoot>{node}</RestaurantStylingPortalRoot>}
        headerStart={
          step2 ? (
            <IconButton
              label="Назад к корзине"
              variant="ghost"
              size="md"
              onClick={() => setCartStep(1)}
              testId="cart-back-to-step-1"
            >
              <IconBack />
            </IconButton>
          ) : null
        }
        footer={footer}
      >
        <div
          className={
            basketStep
              ? 'restaurant-cart-modal__body restaurant-cart-modal__body--basket'
              : 'restaurant-cart-modal__body'
          }
          data-testid="cart-modal-body"
          data-cart-step={cartStep}
        >
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
                  onClose={onClose}
                />
              ) : step2 ? (
                <Stack gap={4} className="restaurant-cart-modal__checkout" testId="cart-checkout-step">
                  <CartCheckoutSection testId="cart-contacts-section">
                    <Field label="Имя" htmlFor="cart-customer-name" required>
                      <Input
                        autoComplete="name"
                        maxLength={CUSTOMER_NAME_MAX}
                        value={draft.customerName}
                        onChange={(e) => syncDraft({ customerName: e.target.value })}
                        placeholder="Как к вам обращаться"
                        testId="cart-customer-name"
                      />
                    </Field>
                    <Field label="Телефон" htmlFor="cart-customer-phone" required>
                      <PhoneInput
                        id="cart-customer-phone"
                        value={draft.phone}
                        onChange={(value) => syncDraft({ phone: value })}
                        data-testid="cart-customer-phone"
                      />
                    </Field>
                    {fieldErrors.contacts && (
                      <p className="restaurant-cart-modal__inline-error" role="alert">
                        {fieldErrors.contacts}
                      </p>
                    )}
                  </CartCheckoutSection>

                  {fulfillment === 'fulfillmentDelivery' &&
                    (isGuestOfRestaurant && accessToken ? (
                      <>
                        <CartCheckoutGuestAddressLoader
                          restaurantId={restaurantId}
                          accessToken={accessToken}
                        />
                        {!deliveryUsesSavedAddresses && !deliveryAddressesLoading && (
                          <CartCheckoutDeliveryAddressInline
                            draft={draft}
                            onDraftChange={syncDraft}
                            addressError={fieldErrors.address}
                            addressExtraExpanded={Boolean(expandedRows.addressExtra)}
                            onToggleAddressExtra={() =>
                              setExpandedRows((prev) => toggleRowKey(prev, 'addressExtra'))
                            }
                          />
                        )}
                      </>
                    ) : (
                      <CartCheckoutDeliveryAddressInline
                        draft={draft}
                        onDraftChange={syncDraft}
                        addressError={fieldErrors.address}
                        addressExtraExpanded={Boolean(expandedRows.addressExtra)}
                        onToggleAddressExtra={() =>
                          setExpandedRows((prev) => toggleRowKey(prev, 'addressExtra'))
                        }
                      />
                    ))}

                  <div className="cart-checkout-rows" data-testid="cart-checkout-rows">
                    {fulfillment === 'fulfillmentDelivery' &&
                      isGuestOfRestaurant &&
                      accessToken &&
                      deliveryAddressesLoading && <CartCheckoutSavedAddressRowSkeleton />}
                    {fulfillment === 'fulfillmentDelivery' &&
                      isGuestOfRestaurant &&
                      accessToken &&
                      deliveryUsesSavedAddresses && (
                        <CartCheckoutSavedAddressRow
                          restaurantId={restaurantId}
                          addressError={fieldErrors.address}
                          onOpenSheet={() => setAddressSheetOpen(true)}
                        />
                      )}
                    {needsVenue && multipleLocations && (
                      <CartDetailRow
                        label="Точка"
                        grouped
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

                    <CartCheckoutFieldSection
                      title="Время"
                      error={fieldErrors.time}
                      testId="cart-time-row"
                    >
                      <RequestedTimePicker
                        mode={draft.requestedAtMode}
                        slotIso={draft.requestedAtSlotIso}
                        onModeChange={(mode) => syncDraft({ requestedAtMode: mode })}
                        onSlotChange={(iso) => syncDraft({ requestedAtSlotIso: iso })}
                      />
                    </CartCheckoutFieldSection>

                    {enabledPayments.length > 1 ? (
                      <CartCheckoutFieldSection title="Оплата" testId="cart-payment-row">
                        <PaymentSelector
                          settings={orderSettings}
                          value={payment ?? enabledPayments[0].key}
                          onChange={setPayment}
                        />
                      </CartCheckoutFieldSection>
                    ) : (
                      <CartCheckoutFieldSection title="Оплата" testId="cart-payment-row">
                        <p className="cart-checkout-field-section__summary">{paymentSummary}</p>
                      </CartCheckoutFieldSection>
                    )}

                    <CartDetailRow
                      label="Комментарий"
                      grouped
                      value={draft.comment.trim() ? 'Добавлен' : 'Не указан'}
                      expanded={Boolean(expandedRows.comment)}
                      onToggle={() => setExpandedRows((prev) => toggleRowKey(prev, 'comment'))}
                      error={fieldErrors.comment}
                      testId="cart-comment-row"
                    >
                    <Field
                      label="Комментарий к заказу"
                      htmlFor="cart-comment"
                      hint={`${draft.comment.length}/${COMMENT_MAX}`}
                    >
                      <Textarea
                        rows={3}
                        maxLength={COMMENT_MAX}
                        value={draft.comment}
                        onChange={(e) => syncDraft({ comment: e.target.value })}
                        placeholder="Пожелания к заказу"
                        testId="cart-comment"
                      />
                    </Field>
                  </CartDetailRow>

                  {showSomeoneElseOption && (
                    <CartCheckoutFieldSection
                      title="Другому человеку"
                      error={fieldErrors.recipient}
                      testId="cart-recipient-row"
                    >
                      <Stack gap={3}>
                        <Checkbox
                          label="Доставка другому человеку"
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
                          testId="cart-recipient-checkbox"
                        />
                        {draft.orderForSomeoneElse && (
                          <Stack gap={3}>
                            <Field label="Имя получателя" htmlFor="cart-recipient-name" required>
                              <Input
                                autoComplete="off"
                                value={draft.recipientName}
                                onChange={(e) => syncDraft({ recipientName: e.target.value })}
                                placeholder="Имя получателя"
                              />
                            </Field>
                            <Field label="Телефон получателя" htmlFor="cart-recipient-phone" required>
                              <PhoneInput
                                id="cart-recipient-phone"
                                value={draft.recipientPhone}
                                onChange={(value) => syncDraft({ recipientPhone: value })}
                                autoComplete="off"
                              />
                            </Field>
                          </Stack>
                        )}
                      </Stack>
                    </CartCheckoutFieldSection>
                  )}
                  </div>

                  {fulfillment === 'fulfillmentDineIn' && bookingEnabled && (
                    <p className="restaurant-cart-modal__cross-sell restaurant-cart-modal__cross-sell--row">
                      <a href={paths.booking} className="restaurant-cart-modal__cross-sell-link">
                        Забронировать стол
                      </a>
                    </p>
                  )}

                  {error && <p className="restaurant-cart-modal__error">{error}</p>}
                </Stack>
              ) : (
                <>
                  <CartBasketBody
                    items={items}
                    orderSettings={orderSettings}
                    fulfillment={fulfillment}
                    onFulfillmentChange={(value) => {
                      setFulfillment(value);
                      syncDraft({ fulfillment: value });
                    }}
                    onDecrement={(line) => updateLineQuantity(line.id, line.quantity - 1)}
                    onIncrement={(line) => updateLineQuantity(line.id, line.quantity + 1)}
                    clearPromptOpen={clearPromptOpen}
                    onAskClear={() => setClearPromptOpen(true)}
                    onCancelClear={() => setClearPromptOpen(false)}
                    onConfirmClear={handleClearCartConfirmed}
                  />
                  {error && <p className="restaurant-cart-modal__error">{error}</p>}
                </>
              )}
        </div>
        {isGuestOfRestaurant && accessToken && deliveryUsesSavedAddresses && (
          <CartCheckoutGuestAddressSheet
            open={addressSheetOpen}
            onClose={() => setAddressSheetOpen(false)}
            restaurantId={restaurantId}
            accessToken={accessToken}
          />
        )}
      </Modal>
  );
}
