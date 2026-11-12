'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ResponsiveImage } from '@/shared/components/ResponsiveImage';
import { IconButton } from '@/shared/ui/IconButton/IconButton';
import { useRestaurantGuestPaths } from '@/shared/routing/restaurant-guest-path';

interface VenueHeaderLeftProps {
  restaurantId: string;
  restaurantName: string;
  logoUrl?: string | null;
  logoWebpUrl?: string | null;
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function VenueHeaderLeft({
  restaurantId,
  restaurantName,
  logoUrl,
  logoWebpUrl,
}: VenueHeaderLeftProps) {
  const pathname = usePathname();
  const router = useRouter();
  const paths = useRestaurantGuestPaths(restaurantId);

  const homePath = paths.home.replace(/\/$/, '');
  const normalizedPath = pathname?.replace(/\/$/, '') ?? '';
  const isVenueHome = normalizedPath === homePath;

  function handleBack() {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(paths.home);
  }

  const brand = (
    <span className="venue-header__brand">
      {logoUrl ? (
        <ResponsiveImage
          className="venue-header__logo"
          src={logoUrl}
          webpSrc={logoWebpUrl}
          alt=""
        />
      ) : null}
      <span className="venue-header__brand-name">{restaurantName}</span>
    </span>
  );

  if (isVenueHome) {
    return (
      <Link href={paths.home} className="venue-header__left" data-testid="venue-header-home-link">
        {brand}
      </Link>
    );
  }

  return (
    <div className="venue-header__left">
      <IconButton
        label="Назад"
        testId="venue-header-back"
        variant="ghost"
        size="md"
        onClick={handleBack}
      >
        <BackIcon />
      </IconButton>
      <Link href={paths.home} className="venue-header__brand" data-testid="venue-header-home-link">
        {logoUrl ? (
          <ResponsiveImage
            className="venue-header__logo"
            src={logoUrl}
            webpSrc={logoWebpUrl}
            alt=""
          />
        ) : null}
        <span className="venue-header__brand-name">{restaurantName}</span>
      </Link>
    </div>
  );
}
