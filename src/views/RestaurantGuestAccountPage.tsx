'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRestaurantGuestPaths } from '@/shared/routing/restaurant-guest-path';
import { formatPhoneDisplay } from '@/shared/utils/phone.util';
import { useAuthStore } from '@/store/auth.store';
import { ApiError } from '@/shared/api/api-client';
import { cancelBooking, fetchMyBookings } from '@/features/restaurants/api/bookings.api';
import {
  BOOKING_STATUS_LABELS,
  type Booking,
  type BookingStatus,
} from '@/shared/types/booking';
import '@/views/home.scss';

interface RestaurantGuestAccountPageProps {
  restaurantId: string;
  restaurantName: string;
}

const STATUS_BADGE: Record<BookingStatus, string> = {
  pending: 'home__booking-badge--pending',
  confirmed: 'home__booking-badge--confirmed',
  cancelled: 'home__booking-badge--cancelled',
  completed: 'home__booking-badge--completed',
};

export function RestaurantGuestAccountPage({
  restaurantId,
  restaurantName,
}: RestaurantGuestAccountPageProps) {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const logout = useAuthStore((s) => s.logout);
  const paths = useRestaurantGuestPaths(restaurantId);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    try {
      setBookings(await fetchMyBookings(accessToken));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось загрузить брони');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  async function handleCancel(bookingId: string) {
    if (!accessToken) return;
    try {
      const updated = await cancelBooking(accessToken, bookingId);
      setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось отменить бронь');
    }
  }

  if (!user) {
    return null;
  }

  return (
    <div className="home">
      <header className="glass-header home__header">
        <Link
          href={paths.home}
          className="glass-header__link glass-header__link--accent home__back"
        >
          ← {restaurantName}
        </Link>
        <h1 className="glass-header__title">Личный кабинет</h1>
        <button type="button" className="glass-header__link home__logout" onClick={logout}>
          Выйти
        </button>
      </header>

      <main className="home__main">
        <p className="home__greeting">
          Здравствуйте, {user.firstName} {user.lastName}
        </p>
        <p className="home__email">
          {user.phone ? formatPhoneDisplay(user.phone) : user.email}
        </p>
        <p className="home__hint">Аккаунт зарегистрирован в «{restaurantName}».</p>

        <section className="home__section">
          <h2>Действия</h2>
          <div className="home__links">
            <Link href={paths.booking}>Бронирование</Link>
            <Link href={paths.preOrder}>Предзаказ</Link>
          </div>
        </section>

        <section className="home__section">
          <h2>Мои брони</h2>
          {error && <p className="home__hint">{error}</p>}
          {loading ? (
            <p className="home__hint">Загрузка…</p>
          ) : bookings.length === 0 ? (
            <p className="home__hint">Пока нет бронирований.</p>
          ) : (
            <ul className="home__bookings">
              {bookings.map((booking) => (
                <li key={booking.id} className="home__booking">
                  <div className="home__booking-info">
                    <strong>
                      {booking.bookingDate} в {booking.bookingTime.slice(0, 5)}
                    </strong>
                    <span>Гостей: {booking.guestCount}</span>
                    <span className={`home__booking-badge ${STATUS_BADGE[booking.status]}`}>
                      {BOOKING_STATUS_LABELS[booking.status]}
                    </span>
                  </div>
                  {(booking.status === 'pending' || booking.status === 'confirmed') && (
                    <button
                      type="button"
                      className="home__booking-cancel"
                      onClick={() => void handleCancel(booking.id)}
                    >
                      Отменить
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
