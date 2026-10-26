'use client';

import { useState } from 'react';
import { RestaurantStylingShell } from '@/features/restaurants/context/RestaurantStylingContext';
import { FulfillmentSelector } from '@/features/restaurants/components/FulfillmentSelector';
import { MenuCategoryNav } from '@/features/restaurants/components/MenuCategoryNav';
import { MenuProductCard } from '@/features/restaurants/components/MenuProductCard';
import type { FulfillmentKey } from '@/shared/types/order-settings';
import type { RestaurantStyling } from '@/shared/types/restaurant-styling';
import { SegmentedControl } from '@/shared/ui';
import { PREVIEW_MENU_CATEGORIES, PREVIEW_MENU_ITEM, PREVIEW_ORDER_SETTINGS } from './preview-data';
import '@/features/restaurants/styles/restaurant-public.scss';
import '@/features/restaurants/styles/restaurant-menu.scss';
import '@/features/restaurants/styles/restaurant-profile-button.scss';

type PreviewSurface = 'site' | 'app';

interface StylingPreviewProps {
  styling: RestaurantStyling;
  mode: PreviewSurface;
  fulfillment: FulfillmentKey;
  onFulfillmentChange: (value: FulfillmentKey) => void;
  testId?: string;
}

function PreviewPage({
  styling,
  mode,
  fulfillment,
  onFulfillmentChange,
  testId,
}: StylingPreviewProps) {
  return (
    <RestaurantStylingShell
      styling={styling}
      className="styling-preview"
      enableScrollToTop={false}
    >
      <div data-testid={testId} data-preview-font={styling.fontFamily}>
        <header className="glass-header glass-header--tenant">
          <div className="glass-header__brand">
            <span className="glass-header__brand-name">Bistro Lotos</span>
          </div>
          <div className="glass-header__actions">
            <span className="restaurant-profile-button" aria-hidden="true">
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

        {styling.menuCategoryNavEnabled ? (
          <MenuCategoryNav categories={PREVIEW_MENU_CATEGORIES} />
        ) : null}

        <div className="restaurant-menu__grid">
          <MenuProductCard item={PREVIEW_MENU_ITEM} onSelect={() => {}} />
        </div>

        <FulfillmentSelector
          settings={PREVIEW_ORDER_SETTINGS}
          value={fulfillment}
          onChange={onFulfillmentChange}
        />

        <div className="restaurant-public__actions">
          <button type="button" className="restaurant-public__btn">
            Забронировать стол
          </button>
          <button type="button" className="restaurant-public__btn restaurant-public__btn--secondary">
            Предзаказ
          </button>
        </div>

        <footer className="restaurant-public__footer">
          <div className="restaurant-public__footer-inner">
            <div className="restaurant-public__footer-brand">
              <div className="restaurant-public__footer-brand-text">
                <span className="restaurant-public__footer-name">Bistro Lotos</span>
                <p className="restaurant-public__footer-tagline">Чайная мастерская в центре города</p>
              </div>
            </div>
            <nav className="restaurant-public__footer-col" aria-label="Навигация превью">
              <span className="restaurant-public__footer-label">Навигация</span>
              <span className="restaurant-public__footer-link">Бронирование</span>
              <span className="restaurant-public__footer-link">Предзаказ</span>
            </nav>
          </div>
          <div className="restaurant-public__footer-bottom">
            <span>Bistro Lotos</span>
            <span className="restaurant-public__footer-credit">Работает на Svels</span>
          </div>
        </footer>

        {mode === 'app' ? (
          <div className="styling-app-tabs" aria-hidden="true">
            <span className="styling-app-tabs__item styling-app-tabs__item--active">Меню</span>
            {styling.favoritesEnabled !== false ? (
              <span className="styling-app-tabs__item">Избранное</span>
            ) : null}
            <span className="styling-app-tabs__item">Профиль</span>
          </div>
        ) : null}
      </div>
    </RestaurantStylingShell>
  );
}

export function StylingDevice({
  styling,
  mode,
  fulfillment,
  onFulfillmentChange,
  testId,
}: StylingPreviewProps) {
  const screen = (
    <div className="styling-device__screen">
      <PreviewPage
        styling={styling}
        mode={mode}
        fulfillment={fulfillment}
        onFulfillmentChange={onFulfillmentChange}
        testId={testId}
      />
    </div>
  );

  return (
    <figure className={`styling-device styling-device--${mode}`}>
      <figcaption className="styling-device__caption">{mode === 'site' ? 'Сайт' : 'Приложение'}</figcaption>
      {mode === 'site' ? (
        <div className="styling-device__frame">
          <div className="styling-site__chrome" aria-hidden="true">
            <span className="styling-site__dots">
              <span className="styling-site__dot" />
              <span className="styling-site__dot" />
              <span className="styling-site__dot" />
            </span>
            <span className="styling-site__url">bistro.svels.by</span>
          </div>
          {screen}
        </div>
      ) : (
        <div className="styling-device__bezel">{screen}</div>
      )}
    </figure>
  );
}

export function StylingPreviewPair(props: Omit<StylingPreviewProps, 'mode' | 'testId'>) {
  return (
    <div className="styling-preview-pair">
      <StylingDevice {...props} mode="site" testId="styling-preview-site" />
      <StylingDevice {...props} mode="app" testId="styling-preview-app" />
    </div>
  );
}

export function StylingPreviewStage(props: Omit<StylingPreviewProps, 'mode' | 'testId'>) {
  const [surface, setSurface] = useState<PreviewSurface>('site');

  return (
    <div className="styling-preview-stage">
      <SegmentedControl
        options={[
          { value: 'site', label: 'Сайт' },
          { value: 'app', label: 'Приложение' },
        ]}
        value={surface}
        onChange={setSurface}
        ariaLabel="Вид превью"
        size="md"
        fullWidth
        testId="styling-preview-surface"
      />
      <div className="styling-preview__scroll">
        <StylingDevice {...props} mode={surface} testId="styling-preview" />
      </div>
    </div>
  );
}
