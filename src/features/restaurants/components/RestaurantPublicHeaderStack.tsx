'use client';

import { RestaurantPublicHeader } from './RestaurantPublicHeader';

interface RestaurantPublicHeaderStackProps {
  restaurantId: string;
  restaurantName: string;
  logoUrl?: string | null;
  onOpenCart?: () => void;
  onOpenAuth?: () => void;
}

export function RestaurantPublicHeaderStack({
  restaurantId,
  restaurantName,
  logoUrl,
  onOpenCart,
  onOpenAuth,
}: RestaurantPublicHeaderStackProps) {
  return (
    <div className="restaurant-public__header-stack">
      <RestaurantPublicHeader
        restaurantId={restaurantId}
        restaurantName={restaurantName}
        logoUrl={logoUrl}
        onOpenCart={onOpenCart}
        onOpenAuth={onOpenAuth}
      />
    </div>
  );
}
