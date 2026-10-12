'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { RestaurantOrderSettings } from '@/shared/types/order-settings';
import { RestaurantCartModal } from '../components/RestaurantCartModal';
import { RestaurantGuestAuthModal } from '../components/RestaurantGuestAuthModal';

interface VenueOverlayContextValue {
  openCart: () => void;
  openAuth: () => void;
}

const VenueOverlayContext = createContext<VenueOverlayContextValue | null>(null);

interface VenueOverlayProviderProps {
  restaurantId: string;
  restaurantName: string;
  orderSettings: RestaurantOrderSettings;
  bookingEnabled: boolean;
  children: ReactNode;
}

export function VenueOverlayProvider({
  restaurantId,
  restaurantName,
  orderSettings,
  bookingEnabled,
  children,
}: VenueOverlayProviderProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const openCart = useCallback(() => setCartOpen(true), []);
  const openAuth = useCallback(() => setAuthOpen(true), []);

  const value = useMemo(
    () => ({
      openCart,
      openAuth,
    }),
    [openCart, openAuth],
  );

  return (
    <VenueOverlayContext.Provider value={value}>
      {children}
      {authOpen ? (
        <RestaurantGuestAuthModal
          restaurantId={restaurantId}
          restaurantName={restaurantName}
          onClose={() => setAuthOpen(false)}
        />
      ) : null}
      {cartOpen ? (
        <RestaurantCartModal
          restaurantId={restaurantId}
          orderSettings={orderSettings}
          bookingEnabled={bookingEnabled}
          onClose={() => setCartOpen(false)}
          onOpenAuth={() => {
            setCartOpen(false);
            setAuthOpen(true);
          }}
        />
      ) : null}
    </VenueOverlayContext.Provider>
  );
}

export function useVenueOverlay(): VenueOverlayContextValue {
  const context = useContext(VenueOverlayContext);
  if (!context) {
    throw new Error('useVenueOverlay must be used within VenueOverlayProvider');
  }
  return context;
}

export function useVenueOverlayOptional(): VenueOverlayContextValue | null {
  return useContext(VenueOverlayContext);
}
