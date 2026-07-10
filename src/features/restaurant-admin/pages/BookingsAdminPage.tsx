'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../../shared/api/api-client';
import { useAuthStore } from '../../../store/auth.store';
import {
  fetchRestaurantBookings,
  updateBookingStatus,
} from '../api/bookings.api';
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_OPTIONS,
  type Booking,
  type BookingStatus,
} from '../../../shared/types/booking';
import '../styles/bookings-admin.scss';

const STATUS_BADGE: Record<BookingStatus, string> = {
  pending: 'bookings-admin__badge--pending',
  confirmed: 'bookings-admin__badge--confirmed',
  cancelled: 'bookings-admin__badge--cancelled',
  completed: 'bookings-admin__badge--completed',
};

export default function BookingsAdminPage() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const restaurantId = user?.restaurantId;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!restaurantId || !accessToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setBookings(await fetchRestaurantBookings(restaurantId, accessToken));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось загрузить брони');
    } finally {
      setLoading(false);
    }
  }, [restaurantId, accessToken]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleStatusChange(bookingId: string, status: BookingStatus) {
    if (!restaurantId || !accessToken) return;
    try {
      const updated = await updateBookingStatus(restaurantId, accessToken, bookingId, status);
      setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось обновить статус');
    }
  }

  if (!restaurantId) {
    return (
      <p className="bookings-admin__notice">
        Заявка ещё на модерации или ресторан не привязан к аккаунту.
      </p>
    );
  }

  return (
    <div className="bookings-admin">
      <header className="bookings-admin__header">
        <h2>Брони</h2>
        <p className="bookings-admin__intro">
          Подтверждайте, отменяйте и завершайте брони гостей.
        </p>
      </header>

      {error && <p className="bookings-admin__error">{error}</p>}

      {loading ? (
        <p className="bookings-admin__empty">Загрузка…</p>
      ) : bookings.length === 0 ? (
        <p className="bookings-admin__empty">Пока нет бронирований.</p>
      ) : (
        <div className="bookings-admin__table-wrap">
          <table className="bookings-admin__table">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Время</th>
                <th>Гостей</th>
                <th>Стол</th>
                <th>Комментарий</th>
                <th>Статус</th>
                <th>Действие</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.bookingDate}</td>
                  <td>{booking.bookingTime.slice(0, 5)}</td>
                  <td>{booking.guestCount}</td>
                  <td>{booking.tableId ? 'Назначен' : '—'}</td>
                  <td className="bookings-admin__notes">{booking.notes ?? '—'}</td>
                  <td>
                    <span
                      className={`bookings-admin__badge ${STATUS_BADGE[booking.status]}`}
                    >
                      {BOOKING_STATUS_LABELS[booking.status]}
                    </span>
                  </td>
                  <td>
                    <select
                      className="bookings-admin__select"
                      value={booking.status}
                      onChange={(e) =>
                        void handleStatusChange(booking.id, e.target.value as BookingStatus)
                      }
                    >
                      {BOOKING_STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {BOOKING_STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
