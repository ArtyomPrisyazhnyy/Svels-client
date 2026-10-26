'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRestaurantGuestPaths } from '@/shared/routing/restaurant-guest-path';
import { formatPhoneDisplay } from '@/shared/utils/phone.util';
import { markGuestLogoutRedirectPending } from '@/shared/auth/guest-logout-redirect';
import { useAuthStore } from '@/store/auth.store';
import { ApiError } from '@/shared/api/api-client';
import { cancelBooking } from '@/features/restaurants/api/bookings.api';
import {
  BOOKING_STATUS_LABELS,
  type BookingStatus,
} from '@/shared/types/booking';
import { PageTitle } from '@/shared/ui/PageTitle/PageTitle';
import { Button } from '@/shared/ui/Button/Button';
import { Stack } from '@/shared/ui/Stack/Stack';
import { GuestAccountAddressesSection } from '@/features/restaurants/components/addresses/GuestAccountAddressesSection';
import { GuestAccountBookingsSkeleton } from '@/features/restaurants/components/guest-page-skeletons/GuestPageSkeletons';
import {
  GuestDataError,
  GuestDataRefreshMark,
} from '@/features/restaurants/guest-data/GuestDataRefreshMark';
import { guestDataPrefetchHandlers, prefetchGuestData } from '@/features/restaurants/guest-data/ensure-guest-data';
import { useGuestBookings } from '@/features/restaurants/hooks/useGuestBookings';
import { guestDataCacheKey } from '@/store/guest-data.logic';
import { useGuestDataStore } from '@/store/guest-data.store';
import '@/features/restaurants/styles/restaurant-guest-account-page.scss';

interface RestaurantGuestAccountPageProps {
  restaurantId: string;
  restaurantName: string;
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
}: RestaurantGuestAccountPageProps) {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const logout = useAuthStore((s) => s.logout);
  const paths = useRestaurantGuestPaths(restaurantId);
  const {
    bookings,
    loading,
    error: fetchError,
    refreshing,
    retrying,
    retry,
  } = useGuestBookings(restaurantId);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    prefetchGuestData(restaurantId, 'both');
  }, [restaurantId]);

  function handleLogout() {
    markGuestLogoutRedirectPending();
    logout();
  }

  async function handleCancel(bookingId: string) {
    if (!accessToken) return;
    try {
      const updated = await cancelBooking(accessToken, bookingId);
      const userId = useAuthStore.getState().user?.id;
      if (!userId) {
        return;
      }
      const key = guestDataCacheKey(userId, restaurantId);
      const current = useGuestDataStore.getState().bookingsByKey[key]?.data ?? [];
      useGuestDataStore.getState().setBookings(
        userId,
        restaurantId,
        current.map((booking) => (booking.id === updated.id ? updated : booking)),
      );
      setCancelError(null);
    } catch (err) {
      setCancelError(err instanceof ApiError ? err.message : 'Не удалось отменить бронь');
    }
  }

  if (!user) {
    return null;
  }

  return (
    <main
      className="venue-subpage__main restaurant-guest-account__main"
      data-testid="guest-account-page"
    >
        <Stack gap={4} className="venue-subpage__stack">
          <PageTitle
            title="Личный кабинет"
            testId="guest-account-page-title"
            className="ui-page-title--venue"
          />

          <section
            className="restaurant-guest-account__profile-card"
            data-testid="guest-page-first-block"
          >
            <p className="restaurant-guest-account__greeting">
              Здравствуйте, {user.firstName} {user.lastName}
            </p>
            <p className="restaurant-guest-account__contact">
              {user.phone ? formatPhoneDisplay(user.phone) : user.email}
            </p>
            <p className="restaurant-guest-account__hint">
              Аккаунт зарегистрирован в «{restaurantName}».
            </p>
            <Button
              variant="ghost"
              testId="guest-logout-button"
              onClick={handleLogout}
              className="restaurant-guest-account__logout"
            >
              Выйти
            </Button>
          </section>

          {accessToken && (
            <GuestAccountAddressesSection
              restaurantId={restaurantId}
              accessToken={accessToken}
            />
          )}

          <section className="restaurant-guest-account__section">
            <h2>Действия</h2>
            <div className="restaurant-guest-account__links">
              <Link href={paths.booking}>Бронирование</Link>
              <Link
                href={paths.preOrder}
                data-testid="guest-account-orders-link"
                {...guestDataPrefetchHandlers(restaurantId, 'orders')}
              >
                Мои заказы
              </Link>
            </div>
          </section>

          <section className="restaurant-guest-account__section guest-data-anchor" data-testid="guest-bookings-section">
            <GuestDataRefreshMark active={refreshing} testId="guest-bookings-refreshing" />
            <h2>Мои брони</h2>
            {cancelError && <p className="restaurant-guest-account__hint">{cancelError}</p>}
            {loading ? (
              <GuestAccountBookingsSkeleton />
            ) : fetchError && bookings.length === 0 ? (
              <GuestDataError
                message={fetchError}
                testId="guest-bookings-error"
                retryTestId="guest-bookings-retry"
                retrying={retrying}
                onRetry={retry}
              />
            ) : bookings.length === 0 ? (
              <p className="restaurant-guest-account__hint" data-testid="guest-bookings-empty">
                Пока нет бронирований.
              </p>
            ) : (
              <ul className="restaurant-guest-account__bookings" data-testid="guest-bookings-list" aria-busy={refreshing || undefined}>
                {bookings.map((booking) => (
                  <li key={booking.id} className="restaurant-guest-account__booking" data-testid={`guest-booking-${booking.id}`}>
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
        </Stack>
    </main>
  );
}
