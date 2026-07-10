'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { RestaurantStylingShell } from '@/features/restaurants/context/RestaurantStylingContext';
import { FulfillmentSelector } from '@/features/restaurants/components/FulfillmentSelector';
import { MenuCategoryNav } from '@/features/restaurants/components/MenuCategoryNav';
import { MenuProductCard } from '@/features/restaurants/components/MenuProductCard';
import { revalidateRestaurantPublicPage } from '@/features/restaurants/actions/revalidate-restaurant-public-page.action';
import { ApiError } from '@/shared/api/api-client';
import type { FulfillmentKey, RestaurantOrderSettings } from '@/shared/types/order-settings';
import type { MenuItem } from '@/shared/types/menu';
import {
  RESTAURANT_BUTTON_SHAPE_OPTIONS,
  RESTAURANT_BUTTON_VARIANT_OPTIONS,
  RESTAURANT_CARD_STYLE_OPTIONS,
  MAGAZINE_CARD_LAYOUT_OPTIONS,
  RESTAURANT_COLOR_THEME_OPTIONS,
  RESTAURANT_CURRENCY_OPTIONS,
  RESTAURANT_FONT_OPTIONS,
  RESTAURANT_FOOTER_ACCENT_OPTIONS,
  RESTAURANT_FOOTER_LAYOUT_OPTIONS,
  RESTAURANT_HEADER_STYLE_OPTIONS,
  RESTAURANT_SWITCHER_STYLE_OPTIONS,
  type RestaurantStyling,
  type UpdateRestaurantStylingPayload,
} from '@/shared/types/restaurant-styling';
import { getFontStack } from '@/features/restaurants/utils/restaurant-styling.util';
import { useAuthStore } from '@/store/auth.store';
import { fetchRestaurantStyling, updateRestaurantStyling } from '../api/styling.api';
import '../styles/styling-admin.scss';
import '@/features/restaurants/styles/restaurant-public.scss';
import '@/features/restaurants/styles/restaurant-menu.scss';
import '@/features/restaurants/styles/restaurant-styling-theme.scss';
import '@/features/restaurants/styles/restaurant-profile-button.scss';

const PREVIEW_ORDER_SETTINGS: RestaurantOrderSettings = {
  restaurantId: 'preview',
  fulfillmentDelivery: true,
  fulfillmentTakeaway: true,
  fulfillmentDineIn: true,
  paymentCash: true,
  paymentCardOnSite: true,
  paymentOnline: true,
  updatedAt: new Date().toISOString(),
};

const PREVIEW_MENU_ITEM_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1f5f9"/><stop offset="1" stop-color="#cbd5e1"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/><g fill="none" stroke="#64748b" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><path d="M155 135 h85 v35 a42 42 0 0 1 -42 42 h-1 a42 42 0 0 1 -42 -42 z"/><path d="M240 145 a24 24 0 0 1 0 36"/></g><g stroke="#94a3b8" stroke-width="6" stroke-linecap="round" fill="none"><path d="M175 108 q-8 -10 0 -20"/><path d="M197 108 q-8 -10 0 -20"/><path d="M219 108 q-8 -10 0 -20"/></g></svg>',
)}`;

const PREVIEW_MENU_ITEM: MenuItem = {
  id: 'preview-item',
  categoryId: 'preview-category',
  name: 'Капучино',
  variantLabel: '350 мл',
  description: 'Классический кофе с нежной молочной пенкой',
  ingredients: null,
  nutrition: null,
  price: 7.5,
  isAvailable: true,
  imageUrl: PREVIEW_MENU_ITEM_IMAGE,
  galleryUrls: [],
  modifierGroups: [],
};

const PREVIEW_MENU_CATEGORIES = [
  { id: 'burgers', name: 'Бургеры' },
  { id: 'rolls', name: 'Роллы' },
  { id: 'drinks', name: 'Напитки' },
];

export default function StylingAdminPage() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const restaurantId = user?.restaurantId;

  const [settings, setSettings] = useState<RestaurantStyling | null>(null);
  const [draft, setDraft] = useState<UpdateRestaurantStylingPayload>({});
  const [previewFulfillment, setPreviewFulfillment] = useState<FulfillmentKey>('fulfillmentTakeaway');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null as string | null);
  const [success, setSuccess] = useState(null as string | null);

  const loadSettings = useCallback(async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchRestaurantStyling(restaurantId);
      setSettings(data);
      setDraft({
        fontFamily: data.fontFamily,
        colorTheme: data.colorTheme,
        currencyDisplay: data.currencyDisplay,
        buttonShape: data.buttonShape,
        buttonVariant: data.buttonVariant,
        switcherStyle: data.switcherStyle,
        cardStyle: data.cardStyle,
        magazineCardLayout: data.magazineCardLayout,
        menuCategoryNavEnabled: data.menuCategoryNavEnabled,
        headerStyle: data.headerStyle,
        footerLayout: data.footerLayout,
        footerAccent: data.footerAccent,
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось загрузить стилизацию');
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const previewStyling = useMemo<RestaurantStyling | null>(() => {
    if (!settings || !restaurantId) {
      return null;
    }

    return {
      ...settings,
      fontFamily: draft.fontFamily ?? settings.fontFamily,
      colorTheme: draft.colorTheme ?? settings.colorTheme,
      currencyDisplay: draft.currencyDisplay ?? settings.currencyDisplay,
      buttonShape: draft.buttonShape ?? settings.buttonShape,
      buttonVariant: draft.buttonVariant ?? settings.buttonVariant,
      switcherStyle: draft.switcherStyle ?? settings.switcherStyle,
      cardStyle: draft.cardStyle ?? settings.cardStyle,
      magazineCardLayout: draft.magazineCardLayout ?? settings.magazineCardLayout,
      menuCategoryNavEnabled: draft.menuCategoryNavEnabled ?? settings.menuCategoryNavEnabled,
      headerStyle: draft.headerStyle ?? settings.headerStyle,
      footerLayout: draft.footerLayout ?? settings.footerLayout,
      footerAccent: draft.footerAccent ?? settings.footerAccent,
    };
  }, [draft, restaurantId, settings]);

  const hasChanges =
    settings !== null &&
    (settings.fontFamily !== draft.fontFamily ||
      settings.colorTheme !== draft.colorTheme ||
      settings.currencyDisplay !== draft.currencyDisplay ||
      settings.buttonShape !== draft.buttonShape ||
      settings.buttonVariant !== draft.buttonVariant ||
      settings.switcherStyle !== draft.switcherStyle ||
      settings.cardStyle !== draft.cardStyle ||
      settings.magazineCardLayout !== draft.magazineCardLayout ||
      settings.menuCategoryNavEnabled !== draft.menuCategoryNavEnabled ||
      settings.headerStyle !== draft.headerStyle ||
      settings.footerLayout !== draft.footerLayout ||
      settings.footerAccent !== draft.footerAccent);

  function updateDraft(patch: UpdateRestaurantStylingPayload) {
    setSuccess(null);
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  async function handleSave() {
    if (!restaurantId || !accessToken) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await updateRestaurantStyling(restaurantId, accessToken, draft);
      setSettings(updated);
      setDraft({
        fontFamily: updated.fontFamily,
        colorTheme: updated.colorTheme,
        currencyDisplay: updated.currencyDisplay,
        buttonShape: updated.buttonShape,
        buttonVariant: updated.buttonVariant,
        switcherStyle: updated.switcherStyle,
        cardStyle: updated.cardStyle,
        magazineCardLayout: updated.magazineCardLayout,
        menuCategoryNavEnabled: updated.menuCategoryNavEnabled,
        headerStyle: updated.headerStyle,
        footerLayout: updated.footerLayout,
        footerAccent: updated.footerAccent,
      });
      setSuccess('Стилизация сохранена');
      await revalidateRestaurantPublicPage(restaurantId);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось сохранить стилизацию');
    } finally {
      setSaving(false);
    }
  }

  if (!restaurantId) {
    return (
      <p className="styling-admin__notice">
        Заявка ещё на модерации или ресторан не привязан к аккаунту.
      </p>
    );
  }

  return (
    <div className="styling-admin">
      <header className="styling-admin__header">
        <div>
          <h2>Стилизация</h2>
          <p className="styling-admin__intro">
            Настройте внешний вид страницы заведения для гостей: шрифт, цвета, кнопки и переключатель
            способа получения заказа.
          </p>
        </div>
        <button
          type="button"
          className="styling-admin__save"
          disabled={saving || loading || !hasChanges}
          onClick={() => void handleSave()}
        >
          {saving ? 'Сохранение…' : 'Сохранить'}
        </button>
      </header>

      {error && <p className="styling-admin__error">{error}</p>}
      {success && <p className="styling-admin__success">{success}</p>}

      {loading ? (
        <p className="styling-admin__empty">Загрузка…</p>
      ) : (
        <div className="styling-admin__layout">
          <div className="styling-admin__controls">
            <section className="styling-admin__panel">
              <h3>Шрифт</h3>
              <div className="styling-admin__options">
                {RESTAURANT_FONT_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`styling-admin__option${
                      draft.fontFamily === option.value ? ' styling-admin__option--active' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="fontFamily"
                      value={option.value}
                      checked={draft.fontFamily === option.value}
                      onChange={() => updateDraft({ fontFamily: option.value })}
                    />
                    <span className="styling-admin__option-title">{option.label}</span>
                    <span
                      className="styling-admin__font-sample"
                      style={{ fontFamily: getFontStack(option.value) }}
                    >
                      {option.sample}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className="styling-admin__panel">
              <h3>Цветовое оформление</h3>
              <div className="styling-admin__options styling-admin__options--themes">
                {RESTAURANT_COLOR_THEME_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`styling-admin__option styling-admin__option--theme${
                      draft.colorTheme === option.value ? ' styling-admin__option--active' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="colorTheme"
                      value={option.value}
                      checked={draft.colorTheme === option.value}
                      onChange={() => updateDraft({ colorTheme: option.value })}
                    />
                    <span className="styling-admin__option-title">{option.label}</span>
                    <span className="styling-admin__option-desc">{option.description}</span>
                    <span className="styling-admin__swatches" aria-hidden="true">
                      {option.swatches.map((color) => (
                        <span key={color} style={{ backgroundColor: color }} />
                      ))}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className="styling-admin__panel">
              <h3>Форма кнопок</h3>
              <div className="styling-admin__options">
                {RESTAURANT_BUTTON_SHAPE_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`styling-admin__option${
                      draft.buttonShape === option.value ? ' styling-admin__option--active' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="buttonShape"
                      value={option.value}
                      checked={draft.buttonShape === option.value}
                      onChange={() => updateDraft({ buttonShape: option.value })}
                    />
                    <span className="styling-admin__option-title">{option.label}</span>
                    <span className="styling-admin__option-desc">{option.description}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="styling-admin__panel">
              <h3>Стиль кнопок</h3>
              <div className="styling-admin__options">
                {RESTAURANT_BUTTON_VARIANT_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`styling-admin__option${
                      draft.buttonVariant === option.value ? ' styling-admin__option--active' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="buttonVariant"
                      value={option.value}
                      checked={draft.buttonVariant === option.value}
                      onChange={() => updateDraft({ buttonVariant: option.value })}
                    />
                    <span className="styling-admin__option-title">{option.label}</span>
                    <span className="styling-admin__option-desc">{option.description}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="styling-admin__panel">
              <h3>Переключатель получения заказа</h3>
              <div className="styling-admin__options styling-admin__options--switcher">
                {RESTAURANT_SWITCHER_STYLE_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`styling-admin__option${
                      draft.switcherStyle === option.value ? ' styling-admin__option--active' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="switcherStyle"
                      value={option.value}
                      checked={draft.switcherStyle === option.value}
                      onChange={() => updateDraft({ switcherStyle: option.value })}
                    />
                    <span className="styling-admin__option-title">{option.label}</span>
                    <span className="styling-admin__option-desc">{option.description}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="styling-admin__panel">
              <h3>Стиль карточек товара</h3>
              <div className="styling-admin__options styling-admin__options--switcher">
                {RESTAURANT_CARD_STYLE_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`styling-admin__option${
                      draft.cardStyle === option.value ? ' styling-admin__option--active' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="cardStyle"
                      value={option.value}
                      checked={draft.cardStyle === option.value}
                      onChange={() =>
                        updateDraft({
                          cardStyle: option.value,
                          ...(option.value === 'magazine' && !draft.magazineCardLayout
                            ? { magazineCardLayout: settings?.magazineCardLayout ?? 'content_left' }
                            : {}),
                        })
                      }
                    />
                    <span className="styling-admin__option-title">{option.label}</span>
                    <span className="styling-admin__option-desc">{option.description}</span>
                  </label>
                ))}
              </div>

              {draft.cardStyle === 'magazine' && (
                <div className="styling-admin__suboptions">
                  <h4 className="styling-admin__suboptions-title">Компоновка журнальной карточки</h4>
                  <div className="styling-admin__options styling-admin__options--switcher">
                    {MAGAZINE_CARD_LAYOUT_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className={`styling-admin__option${
                          draft.magazineCardLayout === option.value
                            ? ' styling-admin__option--active'
                            : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="magazineCardLayout"
                          value={option.value}
                          checked={draft.magazineCardLayout === option.value}
                          onChange={() => updateDraft({ magazineCardLayout: option.value })}
                        />
                        <span className="styling-admin__option-title">{option.label}</span>
                        <span className="styling-admin__option-desc">{option.description}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section className="styling-admin__panel">
              <h3>Навигация по категориям меню</h3>
              <p className="styling-admin__hint">
                Горизонтальные кнопки над меню для быстрого перехода к разделам — как на сайтах
                доставки еды.
              </p>
              <label className="styling-admin__toggle-option">
                <span className="styling-admin__toggle-copy">
                  <strong>Показывать кнопки категорий</strong>
                  <span>
                    Гости смогут нажимать «Бургеры», «Роллы» и т.д. и прокручиваться к нужному
                    разделу меню.
                  </span>
                </span>
                <input
                  type="checkbox"
                  className="styling-admin__toggle"
                  checked={Boolean(draft.menuCategoryNavEnabled)}
                  disabled={saving}
                  onChange={(e) => updateDraft({ menuCategoryNavEnabled: e.target.checked })}
                />
              </label>
            </section>

            <section className="styling-admin__panel">
              <h3>Шапка — стиль фона</h3>
              <div className="styling-admin__options">
                {RESTAURANT_HEADER_STYLE_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`styling-admin__option${
                      draft.headerStyle === option.value ? ' styling-admin__option--active' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="headerStyle"
                      value={option.value}
                      checked={draft.headerStyle === option.value}
                      onChange={() => updateDraft({ headerStyle: option.value })}
                    />
                    <span className="styling-admin__option-title">{option.label}</span>
                    <span className="styling-admin__option-desc">{option.description}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="styling-admin__panel">
              <h3>Подвал — компоновка</h3>
              <div className="styling-admin__options">
                {RESTAURANT_FOOTER_LAYOUT_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`styling-admin__option${
                      draft.footerLayout === option.value ? ' styling-admin__option--active' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="footerLayout"
                      value={option.value}
                      checked={draft.footerLayout === option.value}
                      onChange={() => updateDraft({ footerLayout: option.value })}
                    />
                    <span className="styling-admin__option-title">{option.label}</span>
                    <span className="styling-admin__option-desc">{option.description}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="styling-admin__panel">
              <h3>Подвал — акцент</h3>
              <div className="styling-admin__options">
                {RESTAURANT_FOOTER_ACCENT_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`styling-admin__option${
                      draft.footerAccent === option.value ? ' styling-admin__option--active' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="footerAccent"
                      value={option.value}
                      checked={draft.footerAccent === option.value}
                      onChange={() => updateDraft({ footerAccent: option.value })}
                    />
                    <span className="styling-admin__option-title">{option.label}</span>
                    <span className="styling-admin__option-desc">{option.description}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="styling-admin__panel">
              <h3>Отображение валюты</h3>
              <div className="styling-admin__options">
                {RESTAURANT_CURRENCY_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`styling-admin__option${
                      draft.currencyDisplay === option.value ? ' styling-admin__option--active' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="currencyDisplay"
                      value={option.value}
                      checked={draft.currencyDisplay === option.value}
                      onChange={() => updateDraft({ currencyDisplay: option.value })}
                    />
                    <span className="styling-admin__option-title">{option.label}</span>
                    <span className="styling-admin__option-desc">{option.description}</span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {previewStyling && (
            <section className="styling-admin__preview-panel">
              <h3>Предпросмотр</h3>
              <RestaurantStylingShell styling={previewStyling} className="styling-admin__preview">
                <header className="glass-header">
                  <div className="glass-header__brand">
                    <span className="glass-header__brand-name">Moontea</span>
                  </div>
                  <div className="glass-header__actions">
                    <span className="restaurant-profile-button" aria-hidden>
                      <svg
                        className="restaurant-profile-button__icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M5 20c0-3.3 2.9-6 7-6s7 2.7 7 6" />
                      </svg>
                    </span>
                  </div>
                </header>

                {previewStyling.menuCategoryNavEnabled && (
                  <MenuCategoryNav categories={PREVIEW_MENU_CATEGORIES} />
                )}

                <div className="restaurant-menu__grid styling-admin__preview-grid">
                  <MenuProductCard item={PREVIEW_MENU_ITEM} onSelect={() => {}} />
                </div>

                <div className="styling-admin__preview-switcher">
                  <FulfillmentSelector
                    settings={PREVIEW_ORDER_SETTINGS}
                    value={previewFulfillment}
                    onChange={setPreviewFulfillment}
                  />
                </div>

                <div className="restaurant-public__actions styling-admin__preview-actions">
                  <button type="button" className="restaurant-public__btn">
                    Забронировать стол
                  </button>
                  <button
                    type="button"
                    className="restaurant-public__btn restaurant-public__btn--secondary"
                  >
                    Предзаказ
                  </button>
                </div>

                <footer className="restaurant-public__footer">
                  <div className="restaurant-public__footer-inner">
                    <div className="restaurant-public__footer-brand">
                      <div className="restaurant-public__footer-brand-text">
                        <span className="restaurant-public__footer-name">Moontea</span>
                        <p className="restaurant-public__footer-tagline">
                          Чайная мастерская в самом сердце города
                        </p>
                      </div>
                    </div>
                    <nav className="restaurant-public__footer-col">
                      <span className="restaurant-public__footer-label">Навигация</span>
                      <span className="restaurant-public__footer-link">Бронирование стола</span>
                      <span className="restaurant-public__footer-link">Предзаказ</span>
                      <span className="restaurant-public__footer-link">Личный кабинет</span>
                    </nav>
                  </div>
                  <div className="restaurant-public__footer-bottom">
                    <span>© 2026 Moontea · ул. Примерная, 1</span>
                    <span className="restaurant-public__footer-credit">Работает на Svels</span>
                  </div>
                </footer>
              </RestaurantStylingShell>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
