'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import type { RestaurantOrderSettings } from '@/shared/types/order-settings';
import type { LoyaltySettings } from '@/shared/types/loyalty-settings';
import { useAuthStore } from '@/store/auth.store';
import {
  LoyaltyFlameInfoModal,
  RestaurantCartModal,
  RestaurantGuestAuthModal,
} from '../components/lazy-venue-modals';
import { useGuestLoyaltyBalance } from '../hooks/useGuestLoyaltyBalance';
import { isLoyaltyFlameLit } from '../utils/loyalty-flame-info.util';

interface VenueOverlayContextValue {
  openCart: () => void;
  openAuth: () => void;
  openFlameInfo: () => void;
  loyaltyFlameLit: boolean;
}

const VenueOverlayContext = createContext<VenueOverlayContextValue | null>(null);

interface VenueOverlayProviderProps {
  restaurantId: string;
  restaurantName: string;
  orderSettings: RestaurantOrderSettings;
  bookingEnabled: boolean;
  loyaltySettings: LoyaltySettings;
  children: ReactNode;
}

export function VenueOverlayProvider({
  restaurantId,
  restaurantName,
  orderSettings,
  bookingEnabled,
  loyaltySettings,
  children,
}: VenueOverlayProviderProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [flameOpen, setFlameOpen] = useState(false);

  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);
  const isGuestOfRestaurant =
    hydrated && user?.role === 'user' && user.restaurantId === restaurantId;

  const flameEnabled = loyaltySettings.flameDisplayEnabled;
  const { balance, loading, error, refresh } = useGuestLoyaltyBalance(restaurantId, {
    enabled: flameEnabled && isGuestOfRestaurant,
  });

  const loyaltyFlameLit = flameEnabled && isLoyaltyFlameLit(balance, isGuestOfRestaurant);

  const openCart = useCallback(() => setCartOpen(true), []);
  const openAuth = useCallback(() => setAuthOpen(true), []);
  const openFlameInfo = useCallback(() => {
    setFlameOpen(true);
    if (isGuestOfRestaurant) {
      void refresh();
    }
  }, [isGuestOfRestaurant, refresh]);

  const value = useMemo(
    () => ({
      openCart,
      openAuth,
      openFlameInfo,
      loyaltyFlameLit,
    }),
    [openCart, openAuth, openFlameInfo, loyaltyFlameLit],
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
      {flameOpen && flameEnabled ? (
        <LoyaltyFlameInfoModal
          open
          onClose={() => setFlameOpen(false)}
          loyaltySettings={loyaltySettings}
          balance={balance}
          balanceLoading={loading}
          balanceError={error}
          isGuestOfRestaurant={isGuestOfRestaurant}
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
