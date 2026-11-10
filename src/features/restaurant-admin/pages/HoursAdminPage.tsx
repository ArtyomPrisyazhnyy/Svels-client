'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/shared/api/api-client';
import { DAY_OF_WEEK_LABELS } from '@/shared/types/schedule';
import { Button, Checkbox, Input, PageTitle, Skeleton, Stack } from '@/shared/ui';
import { useAuthStore } from '@/store/auth.store';
import { createSchedule, fetchSchedules, updateSchedule } from '../api/schedules.api';
import '../styles/hours-admin.scss';

const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const DEFAULT_OPEN = '10:00';
const DEFAULT_CLOSE = '22:00';

interface DayDraft {
  dayOfWeek: number;
  scheduleId: string | null;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

function toHm(value: string): string {
  const match = /^(\d{2}:\d{2})/.exec(value);
  return match?.[1] ?? DEFAULT_OPEN;
}

function draftsFromSchedules(
  schedules: Array<{ id: string; dayOfWeek: number; openTime: string; closeTime: string; isOpen: boolean }>,
): DayDraft[] {
  return DAY_ORDER.map((dayOfWeek) => {
    const found = schedules.find((item) => item.dayOfWeek === dayOfWeek);
    return {
      dayOfWeek,
      scheduleId: found?.id ?? null,
      openTime: toHm(found?.openTime ?? DEFAULT_OPEN),
      closeTime: toHm(found?.closeTime ?? DEFAULT_CLOSE),
      isOpen: found ? found.isOpen : false,
    };
  });
}

export default function HoursAdminPage() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const restaurantId = user?.restaurantId;

  const [days, setDays] = useState<DayDraft[]>(() => draftsFromSchedules([]));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const schedules = await fetchSchedules(restaurantId);
      setDays(draftsFromSchedules(schedules));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось загрузить часы. Обновите страницу.');
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
    void load();
  }, [load]);

  function updateDay(dayOfWeek: number, patch: Partial<DayDraft>) {
    setSuccess(null);
    setDays((current) => current.map((day) => (day.dayOfWeek === dayOfWeek ? { ...day, ...patch } : day)));
  }

  async function persist(nextDays: DayDraft[]) {
    if (!restaurantId || !accessToken) return;

    for (const day of nextDays) {
      if (!day.isOpen) continue;
      if (day.closeTime <= day.openTime) {
        setError(
          `${DAY_OF_WEEK_LABELS[day.dayOfWeek]}: закрытие должно быть позже открытия. Смена через полночь пока не поддерживается — поставьте 23:59.`,
        );
        return;
      }
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      for (const day of nextDays) {
        if (day.scheduleId) {
          await updateSchedule(restaurantId, accessToken, day.scheduleId, {
            openTime: day.openTime,
            closeTime: day.closeTime,
            isOpen: day.isOpen,
          });
        } else if (day.isOpen) {
          await createSchedule(restaurantId, accessToken, {
            dayOfWeek: day.dayOfWeek,
            openTime: day.openTime,
            closeTime: day.closeTime,
            isOpen: true,
          });
        }
      }
      setSuccess('Часы сохранены. Гости и бронирование увидят их на сайте.');
      await load();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? `${err.message}. Проверьте, что время в формате 10:00 и закрытие позже открытия.`
          : 'Не удалось сохранить часы. Проверьте время и попробуйте ещё раз.',
      );
    } finally {
      setSaving(false);
    }
  }

  function applyCafeHours() {
    const next = days.map((day) => ({
      ...day,
      isOpen: true,
      openTime: DEFAULT_OPEN,
      closeTime: DEFAULT_CLOSE,
    }));
    setDays(next);
    void persist(next);
  }

  if (!restaurantId) {
    return (
      <p className="hours-admin__note">
        Заявка ещё на проверке. Часы можно будет задать после одобрения.
      </p>
    );
  }

  const hasOpenDay = days.some((day) => day.isOpen);

  return (
    <div className="hours-admin" data-testid="hours-admin">
      <PageTitle
        title="Часы работы"
        subtitle="Гости смотрят эти часы на сайте. Слоты бронирования тоже считаются отсюда."
        actions={
          <Button type="button" onClick={applyCafeHours} disabled={saving || loading} testId="hours-apply-default">
            Поставить 10:00–22:00
          </Button>
        }
      />

      <p className="hours-admin__note">
        Для кофейни, цветочного или небольшой кухни обычно хватает 10:00–22:00 каждый день. Закройте день, если не работаете.
      </p>

      {error ? <p className="hours-admin__error">{error}</p> : null}
      {success ? <p className="hours-admin__success">{success}</p> : null}

      {loading ? (
        <Stack gap={3}>
          <Skeleton variant="rect" height={72} />
          <Skeleton variant="rect" height={72} />
          <Skeleton variant="rect" height={72} />
        </Stack>
      ) : (
        <form
          className="hours-admin__form"
          onSubmit={(event) => {
            event.preventDefault();
            void persist(days);
          }}
        >
          {!hasOpenDay ? (
            <div className="hours-admin__empty" data-testid="hours-empty">
              <p className="hours-admin__note">Часы не заданы — гости не поймут, когда вы открыты.</p>
              <Button type="button" onClick={applyCafeHours} disabled={saving} testId="hours-empty-cta">
                Поставить 10:00–22:00 на все дни
              </Button>
            </div>
          ) : null}

          <div className="hours-admin__days">
            {days.map((day) => (
              <div key={day.dayOfWeek} className="hours-admin__day">
                <Checkbox
                  label={DAY_OF_WEEK_LABELS[day.dayOfWeek]}
                  checked={day.isOpen}
                  onChange={(event) => updateDay(day.dayOfWeek, { isOpen: event.target.checked })}
                  testId={`hours-open-${day.dayOfWeek}`}
                />
                <label className="hours-admin__time" htmlFor={`hours-open-time-${day.dayOfWeek}`}>
                  Открытие
                  <Input
                    id={`hours-open-time-${day.dayOfWeek}`}
                    type="time"
                    value={day.openTime}
                    disabled={!day.isOpen || saving}
                    onChange={(event) => updateDay(day.dayOfWeek, { openTime: event.target.value })}
                    testId={`hours-open-time-${day.dayOfWeek}`}
                  />
                </label>
                <label className="hours-admin__time" htmlFor={`hours-close-time-${day.dayOfWeek}`}>
                  Закрытие
                  <Input
                    id={`hours-close-time-${day.dayOfWeek}`}
                    type="time"
                    value={day.closeTime}
                    disabled={!day.isOpen || saving}
                    onChange={(event) => updateDay(day.dayOfWeek, { closeTime: event.target.value })}
                    testId={`hours-close-time-${day.dayOfWeek}`}
                  />
                </label>
              </div>
            ))}
          </div>

          <div className="hours-admin__actions">
            <Button type="submit" loading={saving} testId="hours-save">
              Сохранить часы
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
