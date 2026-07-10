'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { RestaurantStylingShell } from '@/features/restaurants/context/RestaurantStylingContext';
import { useRestaurantGuestPaths } from '@/shared/routing/restaurant-guest-path';
import { useAuthStore } from '@/store/auth.store';
import {
  fetchBookingAvailability,
  createBooking,
} from '@/features/restaurants/api/bookings.api';
import { FloorPlanViewer } from '@/features/floor-plan/components/FloorPlanViewer';
import type { PublicFloorPlanTable } from '@/shared/types/floor-plan';
import { ApiError } from '@/shared/api/api-client';
import type { BookingSettings } from '@/shared/types/booking-settings';
import type { RestaurantStyling } from '@/shared/types/restaurant-styling';
import type {
  Booking,
  BookingAvailability,
} from '@/shared/types/booking';
import { revalidateRestaurantPublicPage } from '@/features/restaurants/actions/revalidate-restaurant-public-page.action';
import '@/views/restaurant-guest-booking.scss';

interface RestaurantGuestBookingPageProps {
  restaurantId: string;
  restaurantName: string;
  styling: RestaurantStyling;
  bookingSettings: BookingSettings;
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

function maxDateString(advanceDays: number): string {
  return new Date(Date.now() + advanceDays * 86_400_000).toISOString().slice(0, 10);
}

export function RestaurantGuestBookingPage({
  restaurantId,
  restaurantName,
  styling,
  bookingSettings,
}: RestaurantGuestBookingPageProps) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const paths = useRestaurantGuestPaths(restaurantId);

  const [date, setDate] = useState<string>(todayString());
  const [guests, setGuests] = useState<number>(2);
  const [availability, setAvailability] = useState<BookingAvailability | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [selectedTableDeposit, setSelectedTableDeposit] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [loadingAvail, setLoadingAvail] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);

  const minDate = todayString();
  const maxDate = useMemo(() => maxDateString(bookingSettings.advanceDays), [bookingSettings.advanceDays]);

  const loadAvailability = useCallback(async (selectedDate: string) => {
    if (!bookingSettings.bookingEnabled) return;
    setLoadingAvail(true);
    setError(null);
    try {
      const result = await fetchBookingAvailability(restaurantId, selectedDate);
      setAvailability(result);
      setSelectedSlot(null);
      setSelectedTableId(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось загрузить слоты');
    } finally {
      setLoadingAvail(false);
    }
  }, [bookingSettings.bookingEnabled, restaurantId]);

  useEffect(() => {
    void loadAvailability(date);
  }, [date, loadAvailability]);

  function isSlotEnabled(slot: string): boolean {
    if (!availability) return false;
    if (availability.mode === 'specific_table') {
      return (availability.tables ?? []).some(
        (t) => !t.occupiedSlots.includes(slot) && t.capacity >= guests,
      );
    }
    const seats = availability.seatsBySlot?.[slot];
    return Boolean(seats && seats.remaining >= guests);
  }

  async function handleSubmit() {
    if (!accessToken) {
      setError('Войдите, чтобы забронировать стол');
      return;
    }
    if (!selectedSlot) {
      setError('Выберите время');
      return;
    }
    if (bookingSettings.mode === 'specific_table' && !selectedTableId) {
      setError('Выберите стол на планировке');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const booking = await createBooking(restaurantId, accessToken, {
        bookingDate: date,
        bookingTime: selectedSlot,
        guestCount: guests,
        notes: notes.trim() || undefined,
        ...(selectedTableId ? { tableId: selectedTableId } : {}),
      });
      setSuccessBooking(booking);
      void revalidateRestaurantPublicPage(restaurantId);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось создать бронь');
    } finally {
      setSubmitting(false);
    }
  }

  function handleTableSelect(table: PublicFloorPlanTable, deposit: number) {
    setSelectedTableId(table.id);
    setSelectedTableDeposit(deposit);
  }

  return (
    <RestaurantStylingShell styling={styling}>
      <div className="guest-booking">
        <header className="glass-header glass-header--stacked guest-booking__header">
          <Link
            href={paths.home}
            className="glass-header__link glass-header__link--accent guest-booking__back"
          >
            ← {restaurantName}
          </Link>
          <h1>Бронирование стола</h1>
        </header>

        <main className="guest-booking__main">
          {!bookingSettings.bookingEnabled ? (
            <p className="guest-booking__disabled">
              Бронирование столов в этом заведении недоступно.
            </p>
          ) : successBooking ? (
            <section className="guest-booking__success">
              <h2>Бронь оформлена!</h2>
              <p>
                {successBooking.bookingDate} в {successBooking.bookingTime.slice(0, 5)}, гостей:{' '}
                {successBooking.guestCount}.
                {successBooking.status === 'confirmed'
                  ? ' Бронь подтверждена.'
                  : ' Ожидает подтверждения заведения.'}
              </p>

              <div className="guest-booking__cross-sell">
                <p>Хотите, чтобы заказ был готов к вашему приходу?</p>
                <Link
                  href={`${paths.preOrder}?booking=${successBooking.id}`}
                  className="guest-booking__btn"
                >
                  Оформить предзаказ к столу →
                </Link>
              </div>

              <Link href={paths.account} className="guest-booking__link">
                Перейти в личный кабинет
              </Link>
            </section>
          ) : (
            <>
              <section className="guest-booking__panel">
                <h2 className="guest-booking__title">Параметры</h2>
                <div className="guest-booking__row">
                  <label className="guest-booking__field">
                    <span>Дата</span>
                    <input
                      type="date"
                      value={date}
                      min={minDate}
                      max={maxDate}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </label>
                  <label className="guest-booking__field">
                    <span>Гостей</span>
                    <input
                      type="number"
                      min={1}
                      max={bookingSettings.maxGuests}
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                    />
                  </label>
                </div>
              </section>

              {bookingSettings.mode === 'specific_table' ? (
                <section className="guest-booking__panel guest-booking__panel--viewer">
                  <h2 className="guest-booking__title">Выбор стола на планировке</h2>
                  <p className="guest-booking__muted">
                    Выберите дату, время и свободный стол на интерактивной схеме зала.
                    {selectedTableDeposit > 0 && (
                      <strong> Депозит: {selectedTableDeposit} BYN.</strong>
                    )}
                  </p>
                  <FloorPlanViewer
                    restaurantId={restaurantId}
                    initialDate={date}
                    initialTime={selectedSlot ?? '19:00'}
                    onTableSelect={handleTableSelect}
                    onDateTimeChange={(d, t) => { setDate(d); setSelectedSlot(t); }}
                  />
                </section>
              ) : (
                <section className="guest-booking__panel">
                  <h2 className="guest-booking__title">Время</h2>
                  {loadingAvail ? (
                    <p className="guest-booking__muted">Загрузка слотов…</p>
                  ) : (availability?.slots ?? []).length === 0 ? (
                    <p className="guest-booking__muted">
                      На выбранную дату нет свободных слотов. Возможно, заведение закрыто.
                    </p>
                  ) : (
                    <div className="guest-booking__slots">
                      {(availability?.slots ?? []).map((slot) => {
                        const enabled = isSlotEnabled(slot);
                        return (
                          <button
                            key={slot}
                            type="button"
                            className={`guest-booking__slot${
                              selectedSlot === slot ? ' guest-booking__slot--active' : ''
                            }`}
                            disabled={!enabled}
                            onClick={() => setSelectedSlot(slot)}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </section>
              )}

              <section className="guest-booking__panel">
                <label className="guest-booking__field">
                  <span>Комментарий (необязательно)</span>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Поздорование у окна, детский стульчик и т.д."
                  />
                </label>
              </section>

              {error && <p className="guest-booking__error">{error}</p>}

              <button
                type="button"
                className="guest-booking__btn"
                disabled={submitting || !selectedSlot || (bookingSettings.mode === 'specific_table' && !selectedTableId)}
                onClick={() => void handleSubmit()}
              >
                {submitting
                  ? 'Бронирование…'
                  : selectedTableDeposit > 0
                    ? `Забронировать стол (депозит ${selectedTableDeposit} BYN)`
                    : 'Забронировать стол'}
              </button>
            </>
          )}
        </main>
      </div>
    </RestaurantStylingShell>
  );
}
