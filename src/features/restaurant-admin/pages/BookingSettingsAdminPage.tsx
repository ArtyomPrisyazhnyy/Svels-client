'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../../shared/api/api-client';
import type {
  BookingSettings,
  UpdateBookingSettingsPayload,
} from '../../../shared/types/booking-settings';
import {
  BOOKING_MODE_OPTIONS,
  SLOT_MINUTES_OPTIONS,
} from '../../../shared/types/booking-settings';
import { useAuthStore } from '../../../store/auth.store';
import {
  fetchBookingSettings,
  updateBookingSettings,
} from '../api/booking-settings.api';
import { revalidateRestaurantPublicPage } from '@/features/restaurants/actions/revalidate-restaurant-public-page.action';
import '../styles/order-settings-admin.scss';

export default function BookingSettingsAdminPage() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const restaurantId = user?.restaurantId;

  const [settings, setSettings] = useState<BookingSettings | null>(null);
  const [draft, setDraft] = useState<UpdateBookingSettingsPayload>({});
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
      const data = await fetchBookingSettings(restaurantId);
      setSettings(data);
      setDraft({
        bookingEnabled: data.bookingEnabled,
        mode: data.mode,
        slotMinutes: data.slotMinutes,
        maxGuests: data.maxGuests,
        advanceDays: data.advanceDays,
        autoConfirm: data.autoConfirm,
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось загрузить настройки бронирования');
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  function updateDraft(patch: UpdateBookingSettingsPayload) {
    setSuccess(null);
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  async function handleSave() {
    if (!restaurantId || !accessToken) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await updateBookingSettings(restaurantId, accessToken, draft);
      setSettings(updated);
      setDraft({
        bookingEnabled: updated.bookingEnabled,
        mode: updated.mode,
        slotMinutes: updated.slotMinutes,
        maxGuests: updated.maxGuests,
        advanceDays: updated.advanceDays,
        autoConfirm: updated.autoConfirm,
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
    (settings.bookingEnabled !== draft.bookingEnabled ||
      settings.mode !== draft.mode ||
      settings.slotMinutes !== draft.slotMinutes ||
      settings.maxGuests !== draft.maxGuests ||
      settings.advanceDays !== draft.advanceDays ||
      settings.autoConfirm !== draft.autoConfirm);

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
          <h2>Бронирование столов</h2>
          <p className="order-settings-admin__intro">
            Включите бронирование для ресторана. Кофейням и небольшим заведениям бронирование можно оставить выключенным.
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
            <h3>Статус</h3>
            <div className="order-settings-admin__options">
              <label className="order-settings-admin__option">
                <span className="order-settings-admin__option-copy">
                  <strong>Бронирование включено</strong>
                  <span>Гости смогут бронировать стол через страницу заведения.</span>
                </span>
                <input
                  type="checkbox"
                  className="order-settings-admin__toggle"
                  checked={Boolean(draft.bookingEnabled)}
                  disabled={saving}
                  onChange={(e) => updateDraft({ bookingEnabled: e.target.checked })}
                />
              </label>
              <label className="order-settings-admin__option">
                <span className="order-settings-admin__option-copy">
                  <strong>Автоподтверждение</strong>
                  <span>Брони подтверждаются автоматически. Иначе ждут подтверждения в разделе «Брони».</span>
                </span>
                <input
                  type="checkbox"
                  className="order-settings-admin__toggle"
                  checked={Boolean(draft.autoConfirm)}
                  disabled={saving || !draft.bookingEnabled}
                  onChange={(e) => updateDraft({ autoConfirm: e.target.checked })}
                />
              </label>
            </div>
          </section>

          <section className="order-settings-admin__panel">
            <h3>Режим выбора стола</h3>
            <p className="order-settings-admin__hint">
              «Конкретный стол» требует планировки в разделе «Планировка».
            </p>
            <div className="order-settings-admin__options">
              {BOOKING_MODE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`order-settings-admin__option${
                    draft.mode === option.value ? ' order-settings-admin__option--active' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="booking-mode"
                    value={option.value}
                    checked={draft.mode === option.value}
                    disabled={saving || !draft.bookingEnabled}
                    onChange={() => updateDraft({ mode: option.value })}
                  />
                  <span className="order-settings-admin__option-copy">
                    <strong>{option.label}</strong>
                    <span>{option.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section className="order-settings-admin__panel">
            <h3>Параметры слотов</h3>
            <p className="order-settings-admin__hint">
              Доступные времена брони генерируются из графика работы с указанным шагом.
            </p>
            <label className="order-settings-admin__field">
              <span>Шаг слота</span>
              <select
                value={draft.slotMinutes}
                disabled={saving || !draft.bookingEnabled}
                onChange={(e) => updateDraft({ slotMinutes: Number(e.target.value) })}
              >
                {SLOT_MINUTES_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {value} мин
                  </option>
                ))}
              </select>
            </label>
            <label className="order-settings-admin__field">
              <span>Максимум гостей на бронь</span>
              <input
                type="number"
                min={1}
                max={50}
                value={draft.maxGuests}
                disabled={saving || !draft.bookingEnabled}
                onChange={(e) => updateDraft({ maxGuests: Number(e.target.value) })}
              />
            </label>
            <label className="order-settings-admin__field">
              <span>Окно бронирования (дней вперёд)</span>
              <input
                type="number"
                min={1}
                max={90}
                value={draft.advanceDays}
                disabled={saving || !draft.bookingEnabled}
                onChange={(e) => updateDraft({ advanceDays: Number(e.target.value) })}
              />
            </label>
          </section>
        </div>
      )}
    </div>
  );
}
