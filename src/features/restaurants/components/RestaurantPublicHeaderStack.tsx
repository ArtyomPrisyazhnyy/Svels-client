'use client';

import { RestaurantPublicHeader } from './RestaurantPublicHeader';

interface RestaurantPublicHeaderStackProps {
  restaurantId: string;
  restaurantName: string;
  logoUrl?: string | null;
  logoWebpUrl?: string | null;
  onOpenCart?: () => void;
  onOpenAuth?: () => void;
  flameDisplayEnabled?: boolean;
  favoritesEnabled?: boolean;
}

export function RestaurantPublicHeaderStack({
  restaurantId,
  restaurantName,
  logoUrl,
  logoWebpUrl,
  onOpenCart,
  onOpenAuth,
  flameDisplayEnabled,
  favoritesEnabled,
}: RestaurantPublicHeaderStackProps) {
  return (
    <div className="restaurant-public__header-stack" data-testid="restaurant-public-header-stack">
      <RestaurantPublicHeader
        restaurantId={restaurantId}
        restaurantName={restaurantName}
        logoUrl={logoUrl}
        logoWebpUrl={logoWebpUrl}
        onOpenCart={onOpenCart}
        onOpenAuth={onOpenAuth}
        flameDisplayEnabled={flameDisplayEnabled}
        favoritesEnabled={favoritesEnabled}
      />
    </div>
  );
}
