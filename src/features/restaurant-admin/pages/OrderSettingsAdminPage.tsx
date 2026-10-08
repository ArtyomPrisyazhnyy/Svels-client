'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../../shared/api/api-client';
import type {
  RestaurantOrderSettings,
  UpdateRestaurantOrderSettingsPayload,
} from '../../../shared/types/order-settings';
import {
  FULFILLMENT_OPTIONS,
  PAYMENT_OPTIONS,
} from '../../../shared/types/order-settings';
import { useAuthStore } from '../../../store/auth.store';
import { fetchOrderSettings, updateOrderSettings } from '../api/order-settings.api';
import { revalidateRestaurantPublicPage } from '@/features/restaurants/actions/revalidate-restaurant-public-page.action';
import '../styles/order-settings-admin.scss';

type SettingsKey = keyof UpdateRestaurantOrderSettingsPayload;

function SettingsToggle({
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="order-settings-admin__option">
      <span className="order-settings-admin__option-copy">
        <strong>{title}</strong>
        <span>{description}</span>
      </span>
      <input
        type="checkbox"
        className="order-settings-admin__toggle"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

export default function OrderSettingsAdminPage() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const restaurantId = user?.restaurantId;

  const [settings, setSettings] = useState<RestaurantOrderSettings | null>(null);
  const [draft, setDraft] = useState<UpdateRestaurantOrderSettingsPayload>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchOrderSettings(restaurantId);
      setSettings(data);
      setDraft({
        fulfillmentDelivery: data.fulfillmentDelivery,
        fulfillmentTakeaway: data.fulfillmentTakeaway,
        fulfillmentDineIn: data.fulfillmentDineIn,
        paymentCash: data.paymentCash,
        paymentCardOnSite: data.paymentCardOnSite,
        paymentOnline: data.paymentOnline,
        deliveryForSomeoneElse: data.deliveryForSomeoneElse,
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось загрузить настройки');
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  function handleToggle(key: SettingsKey, value: boolean) {
    setSuccess(null);
    setDraft((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'fulfillmentDelivery' && !value) {
        next.deliveryForSomeoneElse = false;
      }
      return next;
    });
  }

  async function handleSave() {
    if (!restaurantId || !accessToken) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await updateOrderSettings(restaurantId, accessToken, draft);
      setSettings(updated);
      setDraft({
        fulfillmentDelivery: updated.fulfillmentDelivery,
        fulfillmentTakeaway: updated.fulfillmentTakeaway,
        fulfillmentDineIn: updated.fulfillmentDineIn,
        paymentCash: updated.paymentCash,
        paymentCardOnSite: updated.paymentCardOnSite,
        paymentOnline: updated.paymentOnline,
        deliveryForSomeoneElse: updated.deliveryForSomeoneElse,
      });
      setSuccess('Настройки сохранены');
      await revalidateRestaurantPublicPage(restaurantId);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось сохранить настройки');
    } finally {
      setSaving(false);
    }
  }

  const hasChanges =
    settings !== null &&
    (settings.fulfillmentDelivery !== draft.fulfillmentDelivery ||
      settings.fulfillmentTakeaway !== draft.fulfillmentTakeaway ||
      settings.fulfillmentDineIn !== draft.fulfillmentDineIn ||
      settings.paymentCash !== draft.paymentCash ||
      settings.paymentCardOnSite !== draft.paymentCardOnSite ||
      settings.paymentOnline !== draft.paymentOnline ||
      settings.deliveryForSomeoneElse !== draft.deliveryForSomeoneElse);

  if (!restaurantId) {
    return (
      <p className="order-settings-admin__notice">
        Заявка ещё на модерации или ресторан не привязан к аккаунту.
      </p>
    );
  }

  return (
    <div className="order-settings-admin">
      <header className="order-settings-admin__header">
        <div>
          <h2>Условия заказа</h2>
          <p className="order-settings-admin__intro">
            Выберите, как гости могут получать предзаказы и чем им разрешено платить.
          </p>
        </div>
        <button
          type="button"
          className="order-settings-admin__save"
          disabled={saving || loading || !hasChanges}
          onClick={() => void handleSave()}
        >
          {saving ? 'Сохранение…' : 'Сохранить'}
        </button>
      </header>

      {error && <p className="order-settings-admin__error">{error}</p>}
      {success && <p className="order-settings-admin__success">{success}</p>}

      {loading ? (
        <p className="order-settings-admin__empty">Загрузка…</p>
      ) : (
        <div className="order-settings-admin__grid">
          <section className="order-settings-admin__panel">
            <h3>Получение заказа</h3>
            <p className="order-settings-admin__hint">
              Должен быть включён хотя бы один вариант.
            </p>
            <div className="order-settings-admin__options">
              {FULFILLMENT_OPTIONS.map((option) => (
                <SettingsToggle
                  key={option.key}
                  title={option.title}
                  description={option.description}
                  checked={Boolean(draft[option.key])}
                  disabled={saving}
                  onChange={(value) => handleToggle(option.key, value)}
                />
              ))}
            </div>
          </section>

          <section className="order-settings-admin__panel">
            <h3>Способы оплаты</h3>
            <p className="order-settings-admin__hint">
              Можно отключить оплату на месте, если боитесь неявок, или оставить только онлайн.
            </p>
            <div className="order-settings-admin__options">
              {PAYMENT_OPTIONS.map((option) => (
                <SettingsToggle
                  key={option.key}
                  title={option.title}
                  description={option.description}
                  checked={Boolean(draft[option.key])}
                  disabled={saving}
                  onChange={(value) => handleToggle(option.key, value)}
                />
              ))}
            </div>
          </section>

          <section className="order-settings-admin__panel order-settings-admin__panel--wide">
            <h3>Доставка другому человеку</h3>
            <p className="order-settings-admin__hint">
              Если включено, в корзине при выборе доставки появится опция указать имя и телефон
              получателя — например, когда гость заказывает цветы или подарок другому человеку.
            </p>
            <div className="order-settings-admin__options">
              <SettingsToggle
                title="Разрешить заказ для другого человека"
                description="Гость сможет отметить «Доставка другому человеку» и заполнить контакты получателя."
                checked={Boolean(draft.deliveryForSomeoneElse)}
                disabled={saving || !draft.fulfillmentDelivery}
                onChange={(value) => handleToggle('deliveryForSomeoneElse', value)}
              />
            </div>
            {!draft.fulfillmentDelivery && (
              <p className="order-settings-admin__hint order-settings-admin__hint--warn">
                Сначала включите способ получения «Доставка».
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
