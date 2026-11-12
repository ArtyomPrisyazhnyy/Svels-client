'use client';

import { VenueHeaderAction } from '@/shared/ui/VenueHeader/VenueHeaderAction';
import { cn } from '@/shared/ui/utils/cn';
import '../styles/restaurant-profile-button.scss';

interface RestaurantGuestProfileButtonProps {
  authenticated?: boolean;
  onClick: () => void;
}

function ProfileIcon() {
  return (
    <svg
      className="restaurant-profile-button__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c0-3.3 2.9-6 7-6s7 2.7 7 6" />
    </svg>
  );
}

export function RestaurantGuestProfileButton({
  authenticated = false,
  onClick,
}: RestaurantGuestProfileButtonProps) {
  const label = authenticated ? 'Личный кабинет' : 'Войти';

  return (
    <VenueHeaderAction
      className={cn(
        'restaurant-profile-button',
        authenticated && 'restaurant-profile-button--authenticated',
      )}
      onClick={onClick}
      label={label}
      testId="guest-profile-button"
    >
      <ProfileIcon />
    </VenueHeaderAction>
  );
}
