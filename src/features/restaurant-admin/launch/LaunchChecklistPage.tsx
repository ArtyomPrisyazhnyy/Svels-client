'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { fetchMenu } from '@/features/restaurant-admin/api/menu.api';
import { fetchOrderSettings } from '@/features/restaurant-admin/api/order-settings.api';
import { fetchPaymentSettings } from '@/features/restaurant-admin/api/payment-settings.api';
import { fetchRestaurant, updateRestaurant } from '@/features/restaurant-admin/api/restaurant.api';
import { fetchSchedules } from '@/features/restaurant-admin/api/schedules.api';
import { fetchRestaurantStyling } from '@/features/restaurant-admin/api/styling.api';
import { fetchTelegramChats } from '@/features/restaurant-admin/api/telegram.api';
import { fetchRestaurantLocations } from '@/features/restaurant-admin/api/locations.api';
import { ApiError } from '@/shared/api/api-client';
import {
  RESTAURANT_CARD_STYLE_OPTIONS,
  RESTAURANT_COLOR_THEME_OPTIONS,
  RESTAURANT_FONT_OPTIONS,
} from '@/shared/types/restaurant-styling';
import { Button, Field, Input, PageTitle, Skeleton, Stack, Textarea } from '@/shared/ui';
import { useAuthStore } from '@/store/auth.store';
import {
  buildLaunchChecklist,
  readAppRequested,
  readPreviewSeen,
  type LaunchChecklistInput,
  type LaunchStep,
} from './launch-checklist';
import { MobileAppRequestForm } from './MobileAppRequestForm';
import './launch-checklist.scss';

const DOMAIN_PATTERN = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

function labelOf<T extends { value: string; label: string }>(
  options: T[],
  value: string | undefined,
): string | null {
  if (!value) return null;
  return options.find((option) => option.value === value)?.label ?? value;
}

function StepCard({ step }: { step: LaunchStep }) {
  return (
    <li
      className="launch-checklist__step"
      data-testid={`launch-step-${step.id}`}
      data-done={step.done ? 'true' : 'false'}
    >
      <div className="launch-checklist__step-top">
        <h2 className="launch-checklist__title">{step.title}</h2>
        <span
          className={`launch-checklist__badge${step.done ? ' launch-checklist__badge--done' : ''}`}
        >
          {step.done ? 'Готово' : step.required ? 'Нужно сделать' : 'По желанию'}
        </span>
      </div>
      <p className="launch-checklist__detail">{step.detail}</p>
      <p className="launch-checklist__hint">{step.hint}</p>
      {step.href ? (
        <div className="launch-checklist__actions">
          <Button href={step.href} variant={step.done ? 'secondary' : 'primary'} testId={`launch-step-${step.id}-cta`}>
            {step.cta}
          </Button>
        </div>
      ) : null}
    </li>
  );
}

export default function LaunchChecklistPage() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const restaurantId = user?.restaurantId;
  const canEditProfile = user?.role === 'restaurant_admin';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checklistInput, setChecklistInput] = useState<LaunchChecklistInput | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('');
  const [savedDomain, setSavedDomain] = useState('');
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [copyState, setCopyState] = useState<string | null>(null);
  const [appRequested, setAppRequested] = useState(false);
  const [restaurantName, setRestaurantName] = useState('');

  const load = useCallback(async () => {
    if (!restaurantId || !accessToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const [restaurantR, locationsR, schedulesR, menuR, ordersR, stylingR, paymentsR, chatsR] =
      await Promise.allSettled([
        fetchRestaurant(restaurantId),
        fetchRestaurantLocations(restaurantId),
        fetchSchedules(restaurantId),
        fetchMenu(restaurantId),
        fetchOrderSettings(restaurantId),
        fetchRestaurantStyling(restaurantId),
        fetchPaymentSettings(restaurantId, accessToken),
        fetchTelegramChats(restaurantId, accessToken),
      ]);

    if (restaurantR.status === 'rejected') {
      setError('Не удалось загрузить заведение. Обновите страницу. Если повторится — войдите снова.');
      setLoading(false);
      return;
    }

    const restaurant = restaurantR.value;
    const locations = locationsR.status === 'fulfilled' ? locationsR.value : [];
    const schedules = schedulesR.status === 'fulfilled' ? schedulesR.value : [];
    const menu = menuR.status === 'fulfilled' ? menuR.value : { categories: [] };
    const orders = ordersR.status === 'fulfilled' ? ordersR.value : null;
    const styling = stylingR.status === 'fulfilled' ? stylingR.value : null;
    const payments = paymentsR.status === 'fulfilled' ? paymentsR.value : null;
    const chats = chatsR.status === 'fulfilled' ? chatsR.value : [];

    const items = menu.categories.flatMap((category) => category.items);
    const locationSummary =
      locations.length === 0
        ? ''
        : locations
            .map((location) => [location.label, location.city, location.address].filter(Boolean).join(', '))
            .join(' · ');

    setName(restaurant.name);
    setDescription(restaurant.description ?? '');
    setDomain(restaurant.customDomain ?? '');
    setSavedDomain(restaurant.customDomain ?? '');
    setRestaurantName(restaurant.name);
    const requested = readAppRequested(restaurantId);
    setAppRequested(requested);

    setChecklistInput({
      description: restaurant.description,
      locationCount: locations.length,
      locationSummary,
      openDays: schedules.filter((day) => day.isOpen).length,
      categoryCount: menu.categories.length,
      itemCount: items.length,
      itemsWithPhoto: items.filter((item) => Boolean(item.imageUrl)).length,
      fulfillment: {
        delivery: Boolean(orders?.fulfillmentDelivery),
        takeaway: Boolean(orders?.fulfillmentTakeaway),
        dineIn: Boolean(orders?.fulfillmentDineIn),
      },
      payments: {
        cash: Boolean(orders?.paymentCash),
        card: Boolean(orders?.paymentCardOnSite),
        online: Boolean(orders?.paymentOnline),
      },
      bepaidReady: Boolean(payments?.enabled && payments.shopId && payments.secretKeyConfigured),
      themeLabel: labelOf(RESTAURANT_COLOR_THEME_OPTIONS, styling?.colorTheme),
      fontLabel: labelOf(RESTAURANT_FONT_OPTIONS, styling?.fontFamily),
      cardLabel: labelOf(RESTAURANT_CARD_STYLE_OPTIONS, styling?.cardStyle),
      previewSeen: readPreviewSeen(restaurantId),
      telegramLinked: chats.length > 0,
      appRequested: requested,
    });
    setLoading(false);
  }, [accessToken, restaurantId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
    void load();
  }, [load]);

  useEffect(() => {
    if (!restaurantId) return;
    const sync = () => {
      const previewSeen = readPreviewSeen(restaurantId);
      const requested = readAppRequested(restaurantId);
      setAppRequested(requested);
      setChecklistInput((current) =>
        current ? { ...current, previewSeen, appRequested: requested } : current,
      );
    };
    window.addEventListener('focus', sync);
    return () => window.removeEventListener('focus', sync);
  }, [restaurantId]);

  const model = checklistInput ? buildLaunchChecklist(checklistInput) : null;

  const publicPath = restaurantId ? `/restaurants/${restaurantId}` : '';
  const publicUrl = useMemo(() => {
    if (!publicPath || typeof window === 'undefined') return publicPath;
    return `${window.location.origin}${publicPath}`;
  }, [publicPath]);

  async function handleProfileSave(event: FormEvent) {
    event.preventDefault();
    if (!restaurantId || !accessToken) return;

    const nextName = name.trim();
    const nextDescription = description.trim();
    const nextDomain = domain.trim().toLowerCase();

    if (nextName.length < 2) {
      setProfileError('Название — минимум 2 буквы. Так гости увидят вас в шапке сайта.');
      return;
    }
    if (nextDescription.length > 0 && nextDescription.length < 20) {
      setProfileError('Описание короче 20 символов. Допишите, что вы готовите или продаёте — или очистите поле.');
      return;
    }
    if (nextDomain && !DOMAIN_PATTERN.test(nextDomain)) {
      setProfileError('Домен пишите без https:// и без слэша. Пример: cafe.by. Если домена нет — оставьте поле пустым.');
      return;
    }

    setSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(null);

    try {
      await updateRestaurant(restaurantId, accessToken, {
        name: nextName,
        description: nextDescription || null,
        ...(nextDomain !== savedDomain ? { customDomain: nextDomain || null } : {}),
      });
      setProfileSuccess('Сохранили. Обновите предпросмотр, чтобы увидеть текст на сайте.');
      await load();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Не удалось сохранить описание';
      setProfileError(
        message === 'Некорректный домен'
          ? 'Домен не принят. Пишите его так: cafe.by — без https://, www можно, слэш в конце нельзя.'
          : message,
      );
    } finally {
      setSavingProfile(false);
    }
  }

  async function copyLink() {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopyState('Ссылка скопирована. Её можно отправить гостям.');
    } catch {
      setCopyState('Скопировать автоматически не вышло. Выделите ссылку выше и скопируйте вручную.');
    }
  }

  if (!restaurantId) {
    return (
      <p className="launch-checklist__note">
        Заявка ещё на проверке. Панель запуска откроется после того, как команда Svels её одобрит. Войдите тем же email ещё раз.
      </p>
    );
  }

  const percent = model && model.total > 0 ? Math.round((model.done / model.total) * 100) : 0;

  return (
    <div className="launch-checklist" data-testid="launch-checklist">
      <PageTitle
        title="Запуск сайта"
        subtitle="Пройдите обязательные шаги. Пока они не закрыты, гость увидит пустую или сломанную страницу."
        testId="launch-title"
      />

      {error ? <p className="launch-checklist__error">{error}</p> : null}

      {loading || !model ? (
        <Stack gap={3} testId="launch-checklist-loading">
          <Skeleton variant="rect" height={72} />
          <Skeleton variant="rect" height={120} />
          <Skeleton variant="rect" height={120} />
          <Skeleton variant="rect" height={120} />
        </Stack>
      ) : (
        <>
          <section className="launch-checklist__progress" aria-labelledby="launch-progress-label">
            <p id="launch-progress-label" className="launch-checklist__count" data-testid="launch-progress">
              Готово {model.done} из {model.total}
            </p>
            <div
              className="launch-checklist__track"
              role="progressbar"
              aria-valuenow={model.done}
              aria-valuemin={0}
              aria-valuemax={model.total}
              aria-label="Прогресс запуска"
            >
              <div className="launch-checklist__fill" style={{ width: `${percent}%` }} />
            </div>
            <p className="launch-checklist__note">
              {model.ready
                ? 'Обязательное сделано. Сайт уже открыт по ссылке ниже — отдельной кнопки «опубликовать» в Svels нет.'
                : 'Ссылка для гостей уже существует, но отправлять её рано: закройте шаги со статусом «Нужно сделать».'}
            </p>
          </section>

          <section className="launch-checklist__share" data-testid="launch-share">
            <h2 className="launch-checklist__title">Ссылка для гостей</h2>
            <a className="launch-checklist__link" href={publicPath} target="_blank" rel="noopener noreferrer" data-testid="launch-public-link">
              {publicUrl || publicPath}
            </a>
            <p className="launch-checklist__hint">
              {savedDomain
                ? `Свой домен сохранён: ${savedDomain}. Пока гости заходят по ссылке Svels. Чтобы домен открывал сайт, его нужно направить на Svels — если не знаете как, напишите нам.`
                : 'Это адрес на Svels. Свой домен (cafe.by) можно указать в блоке «О заведении», если он уже куплен. Пока домена нет, гости ходят по этой ссылке.'}
            </p>
            <div className="launch-checklist__actions">
              <Button type="button" variant="secondary" onClick={() => void copyLink()} testId="launch-copy-link">
                Скопировать ссылку
              </Button>
              <Button href="/restaurant-admin/preview" variant="ghost" testId="launch-open-preview">
                Предпросмотр
              </Button>
            </div>
            {copyState ? <p className="launch-checklist__success">{copyState}</p> : null}
          </section>

          <ol className="launch-checklist__list">
            {model.required.map((step) =>
              step.id === 'profile' ? (
                <li
                  key={step.id}
                  className="launch-checklist__step"
                  id="venue-profile"
                  data-testid="launch-step-profile"
                  data-done={step.done ? 'true' : 'false'}
                >
                  <div className="launch-checklist__step-top">
                    <h2 className="launch-checklist__title">{step.title}</h2>
                    <span className={`launch-checklist__badge${step.done ? ' launch-checklist__badge--done' : ''}`}>
                      {step.done ? 'Готово' : 'Нужно сделать'}
                    </span>
                  </div>
                  <p className="launch-checklist__detail">{step.detail}</p>
                  {canEditProfile ? (
                    <form onSubmit={(event) => void handleProfileSave(event)}>
                      <Stack gap={3}>
                        <Field label="Название" htmlFor="venue-name" required hint="Как на вывеске. Гости видят его в шапке.">
                          <Input
                            id="venue-name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            testId="venue-name"
                            required
                            minLength={2}
                          />
                        </Field>
                        <Field
                          label="Описание"
                          htmlFor="venue-description"
                          hint={step.hint}
                          error={profileError ?? undefined}
                        >
                          <Textarea
                            id="venue-description"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            rows={3}
                            testId="venue-description"
                          />
                        </Field>
                        <Field
                          label="Свой домен"
                          htmlFor="venue-domain"
                          hint="Необязательно. Только если домен уже куплен. Пример: cafe.by. Без https://."
                        >
                          <Input
                            id="venue-domain"
                            value={domain}
                            onChange={(event) => setDomain(event.target.value)}
                            placeholder="cafe.by"
                            autoComplete="off"
                            testId="venue-domain"
                          />
                        </Field>
                        {profileSuccess ? <p className="launch-checklist__success">{profileSuccess}</p> : null}
                        <div className="launch-checklist__actions">
                          <Button type="submit" loading={savingProfile} testId="venue-profile-save">
                            Сохранить описание
                          </Button>
                          <Button href="/restaurant-admin/branding" variant="secondary">
                            Логотип
                          </Button>
                        </div>
                      </Stack>
                    </form>
                  ) : (
                    <p className="launch-checklist__hint">Название и описание меняет владелец аккаунта.</p>
                  )}
                </li>
              ) : (
                <StepCard key={step.id} step={step} />
              ),
            )}
          </ol>

          <p className="launch-checklist__section-label">Можно сделать позже — сайт без этого откроется</p>
          <ul className="launch-checklist__list">
            {model.optional.map((step) =>
              step.id === 'app' ? (
                <li
                  key={step.id}
                  className="launch-checklist__step"
                  data-testid="launch-step-app"
                  data-done={appRequested ? 'true' : 'false'}
                >
                  <div className="launch-checklist__step-top">
                    <h2 className="launch-checklist__title">{step.title}</h2>
                    <span className={`launch-checklist__badge${appRequested ? ' launch-checklist__badge--done' : ''}`}>
                      {appRequested ? 'Готово' : 'По желанию'}
                    </span>
                  </div>
                  <MobileAppRequestForm
                    restaurantId={restaurantId}
                    restaurantName={restaurantName || name}
                    ownerName={[user?.firstName, user?.lastName].filter(Boolean).join(' ')}
                    requested={appRequested}
                    onRequested={() => {
                      setAppRequested(true);
                      setChecklistInput((current) =>
                        current ? { ...current, appRequested: true } : current,
                      );
                    }}
                  />
                </li>
              ) : (
                <StepCard key={step.id} step={step} />
              ),
            )}
          </ul>
        </>
      )}
    </div>
  );
}

