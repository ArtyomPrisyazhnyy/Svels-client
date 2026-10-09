'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRestaurantGuestPaths } from '@/shared/routing/restaurant-guest-path';
import { formatPhoneDisplay } from '@/shared/utils/phone.util';
import { markGuestLogoutRedirectPending } from '@/shared/auth/guest-logout-redirect';
import { useAuthStore } from '@/store/auth.store';
import { ApiError } from '@/shared/api/api-client';
import { cancelBooking, fetchMyBookings } from '@/features/restaurants/api/bookings.api';
import { RestaurantStylingShell } from '@/features/restaurants/context/RestaurantStylingContext';
import {
  BOOKING_STATUS_LABELS,
  type Booking,
  type BookingStatus,
} from '@/shared/types/booking';
import type { RestaurantStyling } from '@/shared/types/restaurant-styling';
import '@/features/restaurants/styles/restaurant-guest-account-page.scss';

interface RestaurantGuestAccountPageProps {
  restaurantId: string;
  restaurantName: string;
  styling: RestaurantStyling;
}

const STATUS_BADGE: Record<BookingStatus, string> = {
  pending: 'restaurant-guest-account__booking-badge--pending',
  confirmed: 'restaurant-guest-account__booking-badge--confirmed',
  cancelled: 'restaurant-guest-account__booking-badge--cancelled',
  completed: 'restaurant-guest-account__booking-badge--completed',
};

export function RestaurantGuestAccountPage({
  restaurantId,
  restaurantName,
  styling,
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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch on mount
    void loadBookings();
  }, [loadBookings]);

  function handleLogout() {
    markGuestLogoutRedirectPending();
    logout();
  }

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
    <RestaurantStylingShell styling={styling}>
      <div className="restaurant-guest-account" data-testid="guest-account-page">
        <header
          className="glass-header glass-header--tenant restaurant-guest-account__header"
        >
          <Link
            href={paths.home}
            className="glass-header__link glass-header__link--accent"
          >
            ← {restaurantName}
          </Link>
          <h1 className="glass-header__title">Личный кабинет</h1>
          <button
            type="button"
            className="glass-header__link restaurant-guest-account__logout"
            onClick={handleLogout}
            data-testid="guest-logout-button"
          >
            Выйти
          </button>
        </header>

        <main className="restaurant-guest-account__main">
          <section className="restaurant-guest-account__profile-card">
            <p className="restaurant-guest-account__greeting">
              Здравствуйте, {user.firstName} {user.lastName}
            </p>
            <p className="restaurant-guest-account__contact">
              {user.phone ? formatPhoneDisplay(user.phone) : user.email}
            </p>
            <p className="restaurant-guest-account__hint">
              Аккаунт зарегистрирован в «{restaurantName}».
            </p>
          </section>

          <section className="restaurant-guest-account__section">
            <h2>Действия</h2>
            <div className="restaurant-guest-account__links">
              <Link href={paths.booking}>Бронирование</Link>
              <Link href={paths.preOrder}>Мои заказы</Link>
            </div>
          </section>

          <section className="restaurant-guest-account__section">
            <h2>Мои брони</h2>
            {error && <p className="restaurant-guest-account__hint">{error}</p>}
            {loading ? (
              <p className="restaurant-guest-account__hint">Загрузка…</p>
            ) : bookings.length === 0 ? (
              <p className="restaurant-guest-account__hint">Пока нет бронирований.</p>
            ) : (
              <ul className="restaurant-guest-account__bookings">
                {bookings.map((booking) => (
                  <li key={booking.id} className="restaurant-guest-account__booking">
                    <div className="restaurant-guest-account__booking-info">
                      <strong>
                        {booking.bookingDate} в {booking.bookingTime.slice(0, 5)}
                      </strong>
                      <span>Гостей: {booking.guestCount}</span>
                      <span
                        className={`restaurant-guest-account__booking-badge ${STATUS_BADGE[booking.status]}`}
                      >
                        {BOOKING_STATUS_LABELS[booking.status]}
                      </span>
                    </div>
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <button
                        type="button"
                        className="restaurant-guest-account__booking-cancel"
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
    </RestaurantStylingShell>
  );
}
