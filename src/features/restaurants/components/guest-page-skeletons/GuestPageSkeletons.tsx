import '@/shared/ui/Skeleton/Skeleton.scss';
import { Stack } from '@/shared/ui/Stack/Stack';
import '@/shared/ui/PageTitle/PageTitle.scss';
import '@/features/restaurants/styles/guest-orders-page.scss';
import '@/features/restaurants/styles/guest-orders-list.scss';
import '@/features/restaurants/styles/restaurant-favorites-page.scss';
import '@/features/restaurants/styles/restaurant-guest-account-page.scss';
import '@/features/restaurants/styles/guest-addresses.scss';
import '@/features/restaurants/styles/restaurant-menu.scss';
import '@/features/restaurants/styles/menu-product-card.scss';
import '@/views/restaurant-guest-booking.scss';
import './guest-page-skeletons.scss';

function GuestPageTitleSkeleton({ testId }: { testId: string }) {
  return (
    <header className="ui-page-title ui-page-title--venue" data-testid={testId}>
      <div className="ui-page-title__text">
        <h1 className="ui-page-title__heading">
          <span className="ui-skeleton ui-skeleton--text guest-page-skeleton__page-heading" aria-hidden />
        </h1>
      </div>
    </header>
  );
}

export function GuestAccountPageSkeleton() {
  return (
    <main
      className="venue-subpage__main restaurant-guest-account__main"
      data-testid="guest-account-skeleton"
    >
        <Stack gap={4} className="venue-subpage__stack">
          <GuestPageTitleSkeleton testId="guest-account-skeleton-title" />
          <section
            className="restaurant-guest-account__profile-card"
            data-testid="guest-page-first-block"
            aria-hidden
          >
            <p className="restaurant-guest-account__greeting">
              <span className="ui-skeleton guest-page-skeleton__greeting-bar" />
            </p>
            <p className="restaurant-guest-account__contact">
              <span className="ui-skeleton guest-page-skeleton__contact-bar" />
            </p>
            <p className="restaurant-guest-account__hint">
              <span className="ui-skeleton guest-page-skeleton__hint-bar" />
            </p>
            <span className="ui-skeleton guest-page-skeleton__logout-bar" />
          </section>
          <section
            className="restaurant-guest-account__section guest-account-addresses"
            data-testid="guest-account-addresses-skeleton"
            aria-hidden
          >
            <h2>Мои адреса</h2>
            <Stack gap={2}>
              <span className="ui-skeleton guest-page-skeleton__address-row" />
              <span className="ui-skeleton guest-page-skeleton__address-row" />
            </Stack>
          </section>
          <section className="restaurant-guest-account__section" aria-hidden>
            <h2>
              <span className="ui-skeleton guest-page-skeleton__section-title" />
            </h2>
            <div className="restaurant-guest-account__links guest-page-skeleton__action-links">
              <span className="ui-skeleton guest-page-skeleton__action-link" />
              <span className="ui-skeleton guest-page-skeleton__action-link" />
            </div>
          </section>
          <section className="restaurant-guest-account__section" aria-hidden>
            <h2>
              <span className="ui-skeleton guest-page-skeleton__section-title" />
            </h2>
            <GuestAccountBookingsSkeleton />
          </section>
        </Stack>
    </main>
  );
}

export function GuestOrdersListSkeleton({ testId = 'guest-orders-list-skeleton' }: { testId?: string }) {
  return (
    <div className="guest-page-skeleton__order-rows" data-testid={testId} aria-hidden>
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="guest-orders-list__item guest-page-skeleton__order-row">
          <div className="guest-page-skeleton__order-row-head">
            <span className="ui-skeleton guest-page-skeleton__order-row-title" />
            <span className="ui-skeleton guest-page-skeleton__order-row-badge" />
          </div>
          <span className="ui-skeleton guest-page-skeleton__order-row-meta" />
          <span className="ui-skeleton guest-page-skeleton__order-row-date" />
        </div>
      ))}
    </div>
  );
}

export function GuestAccountBookingsSkeleton() {
  return (
    <ul className="restaurant-guest-account__bookings" data-testid="guest-account-bookings-skeleton" aria-hidden>
      {Array.from({ length: 2 }, (_, index) => (
        <li key={index} className="restaurant-guest-account__booking">
          <div className="restaurant-guest-account__booking-info">
            <span className="ui-skeleton guest-page-skeleton__booking-line" />
            <span className="ui-skeleton guest-page-skeleton__booking-line guest-page-skeleton__booking-line--short" />
            <span className="ui-skeleton guest-page-skeleton__booking-badge" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function GuestPreOrderPageSkeleton() {
  return (
    <div className="venue-subpage guest-orders-page" data-testid="guest-preorder-skeleton">
      <main className="venue-subpage__main guest-orders-page__main">
        <Stack gap={4} className="venue-subpage__stack">
          <GuestPageTitleSkeleton testId="guest-preorder-skeleton-title" />
          <div data-testid="guest-page-first-block">
            <GuestOrdersListSkeleton testId="guest-preorder-skeleton-list" />
          </div>
        </Stack>
      </main>
    </div>
  );
}

export function GuestBookingSlotsSkeleton({ testId = 'guest-booking-slots-skeleton' }: { testId?: string }) {
  return (
    <div className="guest-booking__slots" data-testid={testId} aria-hidden>
      {Array.from({ length: 12 }, (_, index) => (
        <span key={index} className="ui-skeleton guest-page-skeleton__slot" />
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
          <section
            className="guest-booking__panel"
            data-testid="guest-page-first-block"
            aria-hidden
          >
            <h2 className="guest-booking__title">
              <span className="ui-skeleton guest-page-skeleton__section-title" />
            </h2>
            <div className="guest-booking__row">
              <label className="guest-booking__field">
                <span className="ui-skeleton guest-page-skeleton__field-label" />
                <span className="ui-skeleton guest-page-skeleton__field-input" />
              </label>
              <label className="guest-booking__field">
                <span className="ui-skeleton guest-page-skeleton__field-label" />
                <span className="ui-skeleton guest-page-skeleton__field-input" />
              </label>
            </div>
          </section>
          <section className="guest-booking__panel" aria-hidden>
            <h2 className="guest-booking__title">
              <span className="ui-skeleton guest-page-skeleton__section-title" />
            </h2>
            <GuestBookingSlotsSkeleton />
          </section>
          <section className="guest-booking__panel" aria-hidden>
            <label className="guest-booking__field">
              <span className="ui-skeleton guest-page-skeleton__field-label" />
              <span className="ui-skeleton guest-page-skeleton__field-textarea" />
            </label>
          </section>
          <span className="ui-skeleton guest-page-skeleton__submit" aria-hidden />
        </Stack>
      </main>
    </div>
  );
}

export function GuestFavoritesPageSkeleton() {
  return (
    <main
      className="venue-menu-frame restaurant-favorites-page__main"
      data-testid="guest-favorites-skeleton"
      data-venue-menu-frame=""
    >
      <Stack gap={4} className="venue-subpage__stack">
        <GuestPageTitleSkeleton testId="guest-favorites-skeleton-title" />
        <div
          className="restaurant-menu__grid guest-page-skeleton__product-grid"
          data-testid="guest-page-first-block"
          aria-hidden
        >
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="menu-product-card guest-page-skeleton__product-card">
              <div className="menu-product-card__media">
                <span className="ui-skeleton guest-page-skeleton__product-media" />
              </div>
              <div className="menu-product-card__body">
                <span className="ui-skeleton guest-page-skeleton__product-title" />
                <span className="ui-skeleton guest-page-skeleton__product-price" />
              </div>
            </div>
          ))}
        </div>
      </Stack>
    </main>
  );
}
