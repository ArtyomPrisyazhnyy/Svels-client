'use client';

import type { ReactNode } from 'react';
import { getFontStack } from '@/features/restaurants/utils/restaurant-styling.util';
import type { RestaurantCurrencyDisplay, RestaurantStyling, UpdateRestaurantStylingPayload } from '@/shared/types/restaurant-styling';
import {
  MAGAZINE_CARD_LAYOUT_OPTIONS,
  RESTAURANT_BUTTON_SHAPE_OPTIONS,
  RESTAURANT_BUTTON_VARIANT_OPTIONS,
  RESTAURANT_CARD_STYLE_OPTIONS,
  RESTAURANT_COLOR_THEME_OPTIONS,
  RESTAURANT_CURRENCY_OPTIONS,
  RESTAURANT_FONT_OPTIONS,
  RESTAURANT_FOOTER_ACCENT_OPTIONS,
  RESTAURANT_FOOTER_LAYOUT_OPTIONS,
  RESTAURANT_HEADER_STYLE_OPTIONS,
  RESTAURANT_SWITCHER_STYLE_OPTIONS,
  type RestaurantCardStyle,
} from '@/shared/types/restaurant-styling';
import { Checkbox, SegmentedControl } from '@/shared/ui';

interface StylingControlsProps {
  value: RestaurantStyling;
  onChange: (patch: UpdateRestaurantStylingPayload) => void;
}

function Group({
  title,
  hint,
  children,
  wide = false,
  testId,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
  wide?: boolean;
  testId?: string;
}) {
  return (
    <section className={wide ? 'styling-group styling-group--wide' : 'styling-group'} data-testid={testId}>
      <header className="styling-group__head">
        <h3 className="styling-group__title">{title}</h3>
        {hint ? <p className="styling-group__hint">{hint}</p> : null}
      </header>
      {children}
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="styling-field">
      <p className="styling-field__label">{label}</p>
      {children}
      {hint ? <p className="styling-field__hint">{hint}</p> : null}
    </div>
  );
}

function PriceSample({ display }: { display: RestaurantCurrencyDisplay }) {
  const text = display === 'byn' ? ' BYN' : display === 'r' ? ' р' : display === 'rub' ? ' руб' : null;
  return (
    <span className="byn-price styling-price-sample">
      <span className="byn-price__amount">7,50</span>
      {text === null ? (
        <span className="nbrb-icon byn-sign" aria-label="белорусский рубль">
          BYN
        </span>
      ) : (
        <span className="currency-text">{text}</span>
      )}
    </span>
  );
}

function CardMock({
  style,
  magazine,
}: {
  style: RestaurantCardStyle;
  magazine: RestaurantStyling['magazineCardLayout'];
}) {
  const magazineClass =
    style === 'magazine' && magazine === 'media_left' ? ' styling-card-mock--magazine-flip' : '';
  return (
    <span className={`styling-card-mock styling-card-mock--${style}${magazineClass}`} aria-hidden="true">
      <span className="styling-card-mock__media" />
      <span className="styling-card-mock__copy">
        <span className="styling-card-mock__line" />
        <span className="styling-card-mock__line styling-card-mock__line--short" />
      </span>
    </span>
  );
}

export function StylingControls({ value, onChange }: StylingControlsProps) {
  const theme = RESTAURANT_COLOR_THEME_OPTIONS.find((option) => option.value === value.colorTheme);
  const card = RESTAURANT_CARD_STYLE_OPTIONS.find((option) => option.value === value.cardStyle);
  const variant = RESTAURANT_BUTTON_VARIANT_OPTIONS.find((option) => option.value === value.buttonVariant);
  const currency = RESTAURANT_CURRENCY_OPTIONS.find((option) => option.value === value.currencyDisplay);

  return (
    <>
      <Group title="Тема" hint={theme?.description} wide testId="styling-group-theme">
        <div className="styling-picks styling-picks--themes" role="radiogroup" aria-label="Тема">
          {RESTAURANT_COLOR_THEME_OPTIONS.map((option) => {
            const active = value.colorTheme === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={active}
                className={active ? 'styling-pick styling-pick--active' : 'styling-pick'}
                data-testid={`styling-theme-${option.value}`}
                onClick={() => onChange({ colorTheme: option.value })}
              >
                <span className="styling-swatches" aria-hidden="true">
                  {option.swatches.map((color) => (
                    <span key={color} className="styling-swatch" style={{ backgroundColor: color }} />
                  ))}
                </span>
                <span className="styling-pick__label">{option.label}</span>
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Шрифт" hint="Название блюда показано выбранным шрифтом." wide testId="styling-group-font">
        <div className="styling-picks styling-picks--fonts" role="radiogroup" aria-label="Шрифт">
          {RESTAURANT_FONT_OPTIONS.map((option) => {
            const active = value.fontFamily === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={active}
                className={active ? 'styling-pick styling-pick--active' : 'styling-pick'}
                data-testid={`styling-font-${option.value}`}
                onClick={() => onChange({ fontFamily: option.value })}
              >
                <span className="styling-font-sample" style={{ fontFamily: getFontStack(option.value) }}>
                  Капучино
                </span>
                <span className="styling-pick__label">{option.label}</span>
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Карточка товара" hint={card?.description} wide testId="styling-group-card">
        <div className="styling-picks styling-picks--cards" role="radiogroup" aria-label="Карточка товара">
          {RESTAURANT_CARD_STYLE_OPTIONS.map((option) => {
            const active = value.cardStyle === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={active}
                className={active ? 'styling-pick styling-pick--active' : 'styling-pick'}
                data-testid={`styling-card-${option.value}`}
                onClick={() => onChange({ cardStyle: option.value })}
              >
                <CardMock style={option.value} magazine={value.magazineCardLayout} />
                <span className="styling-pick__label">{option.label}</span>
              </button>
            );
          })}
        </div>
        {value.cardStyle === 'magazine' ? (
          <Field label="Компоновка">
            <SegmentedControl
              options={MAGAZINE_CARD_LAYOUT_OPTIONS.map((option) => ({
                value: option.value,
                label: option.value === 'content_left' ? 'Текст слева' : 'Фото слева',
              }))}
              value={value.magazineCardLayout}
              onChange={(magazineCardLayout) => onChange({ magazineCardLayout })}
              ariaLabel="Компоновка журнальной карточки"
              size="md"
              fullWidth
              testId="styling-magazine-layout"
            />
          </Field>
        ) : null}
      </Group>

      <Group title="Цвета" hint={variant?.description} testId="styling-group-colors">
        <Field label="Кнопки">
          <SegmentedControl
            options={RESTAURANT_BUTTON_VARIANT_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            value={value.buttonVariant}
            onChange={(buttonVariant) => onChange({ buttonVariant })}
            ariaLabel="Стиль кнопок"
            size="md"
            fullWidth
            testId="styling-button-variant"
          />
        </Field>
        <Field label="Форма">
          <SegmentedControl
            options={RESTAURANT_BUTTON_SHAPE_OPTIONS.map((option) => ({
              value: option.value,
              label: option.value === 'rounded' ? 'Скругление' : 'Капсула',
            }))}
            value={value.buttonShape}
            onChange={(buttonShape) => onChange({ buttonShape })}
            ariaLabel="Форма кнопок"
            size="md"
            fullWidth
            testId="styling-button-shape"
          />
        </Field>
      </Group>

      <Group title="Переключатель" testId="styling-group-switcher">
        <SegmentedControl
          options={RESTAURANT_SWITCHER_STYLE_OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
          value={value.switcherStyle}
          onChange={(switcherStyle) => onChange({ switcherStyle })}
          ariaLabel="Переключатель получения заказа"
          size="md"
          fullWidth
          testId="styling-switcher"
        />
        <p className="styling-field__hint">
          {RESTAURANT_SWITCHER_STYLE_OPTIONS.find((option) => option.value === value.switcherStyle)?.description}
        </p>
      </Group>

      <Group title="Шапка и подвал" testId="styling-group-chrome">
        <Field label="Шапка">
          <SegmentedControl
            options={RESTAURANT_HEADER_STYLE_OPTIONS.map((option) => ({
              value: option.value,
              label: option.value === 'bordered' ? 'Линия' : option.label,
            }))}
            value={value.headerStyle}
            onChange={(headerStyle) => onChange({ headerStyle })}
            ariaLabel="Стиль шапки"
            size="md"
            fullWidth
            testId="styling-header"
          />
        </Field>
        <Field label="Подвал">
          <SegmentedControl
            options={RESTAURANT_FOOTER_LAYOUT_OPTIONS.map((option) => ({
              value: option.value,
              label: option.value === 'centered' ? 'Центр' : option.value === 'minimal' ? 'Мини' : option.label,
            }))}
            value={value.footerLayout}
            onChange={(footerLayout) => onChange({ footerLayout })}
            ariaLabel="Компоновка подвала"
            size="md"
            fullWidth
            testId="styling-footer-layout"
          />
        </Field>
        <Field label="Акцент подвала">
          <SegmentedControl
            options={RESTAURANT_FOOTER_ACCENT_OPTIONS.map((option) => ({
              value: option.value,
              label: option.value === 'tinted' ? 'Тон' : option.value === 'top-border' ? 'Полоса' : option.label,
            }))}
            value={value.footerAccent}
            onChange={(footerAccent) => onChange({ footerAccent })}
            ariaLabel="Акцент подвала"
            size="md"
            fullWidth
            testId="styling-footer-accent"
          />
        </Field>
      </Group>

      <Group title="Валюта" hint={currency?.description} testId="styling-group-currency">
        <PriceSample display={value.currencyDisplay} />
        <SegmentedControl
          options={RESTAURANT_CURRENCY_OPTIONS.map((option) => ({
            value: option.value,
            label: option.value === 'byn_glyph' ? 'Знак' : option.label,
          }))}
          value={value.currencyDisplay}
          onChange={(currencyDisplay) => onChange({ currencyDisplay })}
          ariaLabel="Отображение валюты"
          size="md"
          fullWidth
          testId="styling-currency"
        />
      </Group>

      <Group title="Разделы" testId="styling-group-sections">
        <div className="styling-check">
          <Checkbox
            label="Кнопки категорий меню"
            checked={value.menuCategoryNavEnabled}
            onChange={(event) => onChange({ menuCategoryNavEnabled: event.target.checked })}
            testId="styling-category-nav"
          />
          <p className="styling-field__hint">Горизонтальный переход к разделам меню.</p>
        </div>
        <div className="styling-check">
          <Checkbox
            label="Избранное"
            checked={value.favoritesEnabled !== false}
            onChange={(event) => onChange({ favoritesEnabled: event.target.checked })}
            testId="styling-favorites"
          />
          <p className="styling-field__hint">Сердечки на карточках и вкладка в приложении.</p>
        </div>
      </Group>
    </>
  );
}
