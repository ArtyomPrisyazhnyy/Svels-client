import { VenueHeaderActions } from './VenueHeaderActions';
import { VenueHeaderLeft } from './VenueHeaderLeft';
import './VenueHeader.scss';

export interface VenueHeaderProps {
  restaurantId: string;
  restaurantName: string;
  logoUrl?: string | null;
  logoWebpUrl?: string | null;
  flameDisplayEnabled?: boolean;
  favoritesEnabled?: boolean;
  enableCart?: boolean;
}

export function VenueHeader({
  restaurantId,
  restaurantName,
  logoUrl,
  logoWebpUrl,
  flameDisplayEnabled,
  favoritesEnabled,
  enableCart = true,
}: VenueHeaderProps) {
  return (
    <header
      className="venue-header glass-header glass-header--tenant"
      data-testid="venue-header"
    >
      <VenueHeaderLeft
        restaurantId={restaurantId}
        restaurantName={restaurantName}
        logoUrl={logoUrl}
        logoWebpUrl={logoWebpUrl}
      />
      <div aria-hidden="true" />
      <VenueHeaderActions
        restaurantId={restaurantId}
        flameDisplayEnabled={flameDisplayEnabled}
        favoritesEnabled={favoritesEnabled}
        enableCart={enableCart}
      />
    </header>
  );
}
