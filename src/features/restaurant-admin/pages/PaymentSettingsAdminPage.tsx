'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/shared/api/api-client';
import type {
  BePaidCheckoutTransactionType,
  RestaurantPaymentSettings,
  UpdateRestaurantPaymentSettingsPayload,
} from '@/shared/types/payment-settings';
import { useAuthStore } from '@/store/auth.store';
import {
  fetchPaymentSettings,
  updatePaymentSettings,
} from '../api/payment-settings.api';
import '../styles/order-settings-admin.scss';

interface DraftState {
  enabled: boolean;
  shopId: string;
  secretKey: string;
  testMode: boolean;
  checkoutTransactionType: BePaidCheckoutTransactionType;
  autoCapture: boolean;
  currency: string;
  clearSecretKey: boolean;
}

const EMPTY_DRAFT: DraftState = {
  enabled: false,
  shopId: '',
  secretKey: '',
  testMode: true,
  checkoutTransactionType: 'authorization',
  autoCapture: false,
  currency: 'BYN',
  clearSecretKey: false,
};

export default function PaymentSettingsAdminPage() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const restaurantId = user?.restaurantId;

  const [settings, setSettings] = useState<RestaurantPaymentSettings | null>(null);
  const [draft, setDraft] = useState<DraftState>(EMPTY_DRAFT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    if (!restaurantId || !accessToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchPaymentSettings(restaurantId, accessToken);
      setSettings(data);
      setDraft({
        enabled: data.enabled,
        shopId: data.shopId ?? '',
        secretKey: '',
        testMode: data.testMode,
        checkoutTransactionType: data.checkoutTransactionType,
        autoCapture: data.autoCapture,
        currency: data.currency,
        clearSecretKey: false,
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось загрузить настройки оплаты');
    } finally {
      setLoading(false);
    }
  }, [restaurantId, accessToken]);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  function updateDraft(patch: Partial<DraftState>) {
    setSuccess(null);
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  async function handleSave() {
    if (!restaurantId || !accessToken || !settings) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload: UpdateRestaurantPaymentSettingsPayload = {
        enabled: draft.enabled,
        shopId: draft.shopId.trim() || null,
        testMode: draft.testMode,
        checkoutTransactionType: draft.checkoutTransactionType,
        autoCapture: draft.autoCapture,
        currency: draft.currency.trim().toUpperCase() || 'BYN',
      };

      if (draft.clearSecretKey) {
        payload.clearSecretKey = true;
      } else if (draft.secretKey.trim()) {
        payload.secretKey = draft.secretKey.trim();
      }

      const updated = await updatePaymentSettings(restaurantId, accessToken, payload);
      setSettings(updated);
      setDraft({
        enabled: updated.enabled,
        shopId: updated.shopId ?? '',
        secretKey: '',
        testMode: updated.testMode,
        checkoutTransactionType: updated.checkoutTransactionType,
        autoCapture: updated.autoCapture,
        currency: updated.currency,
        clearSecretKey: false,
      });
      setSuccess('Настройки оплаты сохранены');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось сохранить настройки');
    } finally {
      setSaving(false);
    }
  }

  const hasChanges =
    settings !== null &&
    (settings.enabled !== draft.enabled ||
      (settings.shopId ?? '') !== draft.shopId.trim() ||
      settings.testMode !== draft.testMode ||
      settings.checkoutTransactionType !== draft.checkoutTransactionType ||
      settings.autoCapture !== draft.autoCapture ||
      settings.currency !== draft.currency.trim().toUpperCase() ||
      draft.secretKey.trim().length > 0 ||
      draft.clearSecretKey);

  if (!restaurantId) {
    return (
      <p className="order-settings-admin__notice">
        Заявка ещё на модерации или ресторан не привязан к аккаунту.
      </p>
    );
  }

  return (
    <div className="order-settings-admin" data-testid="payment-settings-admin">
      <header className="order-settings-admin__header">
        <div>
          <h2>Оплата / bePaid</h2>
          <p className="order-settings-admin__intro">
            Ключи магазина из кабинета bePaid. Secret Key хранится в зашифрованном виде и
            наружу не отдаётся.
          </p>
        </div>
        <button
          type="button"
          className="order-settings-admin__save"
          onClick={() => void handleSave()}
          disabled={saving || loading || !hasChanges}
        >
          {saving ? 'Сохранение…' : 'Сохранить'}
        </button>
      </header>

      {error && <p className="order-settings-admin__error">{error}</p>}
      {success && <p className="order-settings-admin__success">{success}</p>}

      {loading && <p className="order-settings-admin__hint">Загрузка…</p>}

      {!loading && settings && (
        <div className="order-settings-admin__grid">
          <section className="order-settings-admin__panel">
            <h3>Подключение</h3>

            <div className="order-settings-admin__options">
              <label className="order-settings-admin__option">
                <span className="order-settings-admin__option-copy">
                  <strong>Включить онлайн-оплату bePaid</strong>
                  <span>Гости смогут оплачивать предзаказ картой через bePaid.</span>
                </span>
                <input
                  type="checkbox"
                  className="order-settings-admin__toggle"
                  checked={draft.enabled}
                  onChange={(e) => updateDraft({ enabled: e.target.checked })}
                />
              </label>
            </div>

            <label className="order-settings-admin__field">
              <span>Shop ID</span>
              <input
                type="text"
                value={draft.shopId}
                onChange={(e) => updateDraft({ shopId: e.target.value })}
                autoComplete="off"
                placeholder="из merchant.bepaid.by"
              />
            </label>

            <label className="order-settings-admin__field">
              <span>
                Secret Key
                {settings.secretKeyConfigured && !draft.clearSecretKey
                  ? ' (задан — введите новый, чтобы заменить)'
                  : ''}
              </span>
              <input
                type="password"
                value={draft.secretKey}
                onChange={(e) =>
                  updateDraft({ secretKey: e.target.value, clearSecretKey: false })
                }
                autoComplete="new-password"
                placeholder={settings.secretKeyConfigured ? '••••••••' : 'секретный ключ'}
                disabled={draft.clearSecretKey}
              />
            </label>

            {settings.secretKeyConfigured && (
              <div className="order-settings-admin__options">
                <label className="order-settings-admin__option">
                  <span className="order-settings-admin__option-copy">
                    <strong>Удалить сохранённый Secret Key</strong>
                    <span>Ключ будет стёрт из настроек после сохранения.</span>
                  </span>
                  <input
                    type="checkbox"
                    className="order-settings-admin__toggle"
                    checked={draft.clearSecretKey}
                    onChange={(e) =>
                      updateDraft({
                        clearSecretKey: e.target.checked,
                        secretKey: e.target.checked ? '' : draft.secretKey,
                      })
                    }
                  />
                </label>
              </div>
            )}
          </section>

          <section className="order-settings-admin__panel">
            <h3>Режим списания</h3>

            <div className="order-settings-admin__options">
              <label className="order-settings-admin__option">
                <span className="order-settings-admin__option-copy">
                  <strong>Тестовый режим</strong>
                  <span>Песочница bePaid — без реальных денег.</span>
                </span>
                <input
                  type="checkbox"
                  className="order-settings-admin__toggle"
                  checked={draft.testMode}
                  onChange={(e) => updateDraft({ testMode: e.target.checked })}
                />
              </label>
            </div>

            <label className="order-settings-admin__field">
              <span>Тип транзакции при оплате из корзины</span>
              <select
                value={draft.checkoutTransactionType}
                onChange={(e) =>
                  updateDraft({
                    checkoutTransactionType: e.target.value as BePaidCheckoutTransactionType,
                  })
                }
              >
                <option value="authorization">Холд (authorization)</option>
                <option value="payment">Сразу списание (payment)</option>
              </select>
            </label>

            <div className="order-settings-admin__options">
              <label className="order-settings-admin__option">
                <span className="order-settings-admin__option-copy">
                  <strong>Авто-списание после холда</strong>
                  <span>Обычно выключено для бара/кухни: сначала холд, списание после проверки заказа.</span>
                </span>
                <input
                  type="checkbox"
                  className="order-settings-admin__toggle"
                  checked={draft.autoCapture}
                  onChange={(e) => updateDraft({ autoCapture: e.target.checked })}
                  disabled={draft.checkoutTransactionType !== 'authorization'}
                />
              </label>
            </div>

            <label className="order-settings-admin__field">
              <span>Валюта</span>
              <input
                type="text"
                value={draft.currency}
                onChange={(e) => updateDraft({ currency: e.target.value.toUpperCase() })}
                maxLength={3}
              />
            </label>

            <p className="order-settings-admin__hint">
              При холде без авто-списания: деньги резервируются; списание (capture) или отмена
              (void) — после проверки заказа персоналом.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
