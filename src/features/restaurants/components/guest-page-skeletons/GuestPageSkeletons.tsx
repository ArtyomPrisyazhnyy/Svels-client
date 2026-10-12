import { Skeleton, SkeletonList } from '@/shared/ui/Skeleton/Skeleton';
import { Stack } from '@/shared/ui/Stack/Stack';
import '@/features/restaurants/styles/guest-orders-page.scss';
import '@/features/restaurants/styles/restaurant-favorites-page.scss';
import '@/features/restaurants/styles/restaurant-guest-account-page.scss';
import '@/features/restaurants/styles/restaurant-menu.scss';
import '@/views/restaurant-guest-booking.scss';
import './guest-page-skeletons.scss';

function GuestPageTitleSkeleton({ testId }: { testId: string }) {
  return (
    <header className="ui-page-title ui-page-title--venue guest-page-skeleton__title" data-testid={testId}>
      <Skeleton variant="rect" height={28} width="55%" radius="var(--radius-sm)" />
    </header>
  );
}

export function GuestAccountPageSkeleton() {
  return (
    <div
      className="venue-subpage restaurant-guest-account"
      data-testid="guest-account-skeleton"
    >
      <main className="venue-subpage__main restaurant-guest-account__main">
        <Stack gap={4} className="venue-subpage__stack">
          <GuestPageTitleSkeleton testId="guest-account-skeleton-title" />
          <section className="restaurant-guest-account__profile-card guest-page-skeleton__card">
            <Skeleton variant="text" height={22} width="70%" />
            <Skeleton variant="text" height={16} width="45%" />
            <Skeleton variant="text" lines={2} />
            <Skeleton variant="rect" height={40} width={96} radius="var(--rs-btn-radius, 12px)" />
          </section>
          <section className="restaurant-guest-account__section guest-page-skeleton__card">
            <Skeleton variant="text" height={18} width="35%" />
            <div className="guest-page-skeleton__action-links">
              <Skeleton variant="rect" height={48} radius="var(--rs-btn-radius, 12px)" />
              <Skeleton variant="rect" height={48} radius="var(--rs-btn-radius, 12px)" />
            </div>
          </section>
          <section className="restaurant-guest-account__section guest-page-skeleton__card">
            <Skeleton variant="text" height={18} width="40%" />
            <SkeletonList rows={2} testId="guest-account-skeleton-bookings" />
          </section>
        </Stack>
      </main>
    </div>
  );
}

export function GuestOrdersListSkeleton({ testId = 'guest-orders-list-skeleton' }: { testId?: string }) {
  return (
    <div className="guest-page-skeleton__order-rows" data-testid={testId}>
      {Array.from({ length: 3 }, (_, index) => (
        <Skeleton key={index} variant="rect" height={88} radius="14px" />
      ))}
    </div>
  );
}

export function GuestAccountBookingsSkeleton() {
  return <SkeletonList rows={2} testId="guest-account-bookings-skeleton" />;
}

export function GuestPreOrderPageSkeleton() {
  return (
    <div className="venue-subpage guest-orders-page" data-testid="guest-preorder-skeleton">
      <main className="venue-subpage__main guest-orders-page__main">
        <Stack gap={4} className="venue-subpage__stack">
          <GuestPageTitleSkeleton testId="guest-preorder-skeleton-title" />
          <GuestOrdersListSkeleton testId="guest-preorder-skeleton-list" />
        </Stack>
      </main>
    </div>
  );
}

export function GuestBookingSlotsSkeleton({ testId = 'guest-booking-slots-skeleton' }: { testId?: string }) {
  return (
    <div className="guest-booking__slots guest-page-skeleton__slots" data-testid={testId}>
      {Array.from({ length: 12 }, (_, index) => (
        <Skeleton key={index} variant="rect" height={40} radius="10px" />
      ))}
    </div>
  );
}

export function GuestBookingPageSkeleton() {
  return (
    <div className="venue-subpage guest-booking" data-testid="guest-booking-skeleton">
      <main className="venue-subpage__main guest-booking__main">
        <Stack gap={4} className="venue-subpage__stack">
          <GuestPageTitleSkeleton testId="guest-booking-skeleton-title" />
          <section className="guest-booking__panel guest-page-skeleton__card">
            <Skeleton variant="text" height={18} width="30%" />
            <div className="guest-booking__row guest-page-skeleton__booking-fields">
              <Skeleton variant="rect" height={44} radius="10px" />
              <Skeleton variant="rect" height={44} radius="10px" />
            </div>
          </section>
          <section className="guest-booking__panel guest-page-skeleton__card">
            <Skeleton variant="text" height={18} width="25%" />
            <div className="guest-booking__slots guest-page-skeleton__slots">
              {Array.from({ length: 12 }, (_, index) => (
                <Skeleton key={index} variant="rect" height={40} radius="10px" />
              ))}
            </div>
          </section>
          <section className="guest-booking__panel guest-page-skeleton__card">
            <Skeleton variant="rect" height={88} radius="10px" />
          </section>
          <Skeleton variant="rect" height={48} width="100%" radius="var(--rs-btn-radius, 12px)" />
        </Stack>
      </main>
    </div>
  );
}

export function GuestFavoritesPageSkeleton() {
  return (
    <div className="venue-subpage restaurant-favorites-page" data-testid="guest-favorites-skeleton">
      <main className="venue-subpage__main restaurant-favorites-page__main">
        <Stack gap={4} className="venue-subpage__stack">
          <GuestPageTitleSkeleton testId="guest-favorites-skeleton-title" />
          <div className="restaurant-menu__grid guest-page-skeleton__product-grid">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton
                key={index}
                variant="rect"
                height={200}
                radius="var(--radius-md)"
                testId={`guest-favorites-skeleton-card-${index}`}
              />
            ))}
          </div>
        </Stack>
      </main>
    </div>
  );
}
