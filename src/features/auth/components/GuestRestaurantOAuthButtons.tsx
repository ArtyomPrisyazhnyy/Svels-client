'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  loginGuestWithAppleOAuth,
  loginGuestWithGoogleOAuth,
} from '../api/restaurant-guest-auth.api';
import { useGuestOAuthProviders } from '../hooks/useGuestOAuthProviders';
import { formatGuestOAuthError } from '../utils/format-guest-oauth-error.util';
import { initAppleSignIn, isAppleSignInCancelError } from '../utils/apple-sign-in.util';
import { loadGoogleIdentityServices, requestGoogleIdToken } from '../utils/google-identity.util';
import { useAuthStore } from '@/store/auth.store';
import { useFavoritesStore } from '@/store/favorites.store';
import { useRestaurantStylingOptional } from '@/features/restaurants/context/RestaurantStylingContext';
import { Button } from '@/shared/ui/Button/Button';
import { AppleMarkIcon } from './icons/AppleMarkIcon';
import { GoogleMarkIcon } from './icons/GoogleMarkIcon';
import '../styles/guest-oauth.scss';

type OAuthProvider = 'apple' | 'google';

interface GuestRestaurantOAuthButtonsProps {
  restaurantId: string;
  onSuccess: () => void;
  onError: (message: string) => void;
  onClearError: () => void;
}

export function GuestRestaurantOAuthButtons({
  restaurantId,
  onSuccess,
  onError,
  onClearError,
}: GuestRestaurantOAuthButtonsProps) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const mergeFavorites = useFavoritesStore((s) => s.mergeAfterLogin);
  const { styling } = useRestaurantStylingOptional();
  const favoritesEnabled = styling.favoritesEnabled !== false;

  const { providers, hasEnabledProvider } = useGuestOAuthProviders(restaurantId, true);
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null);
  const appleInitialized = useRef(false);

  useEffect(() => {
    if (!providers.google.enabled || !providers.google.clientId) {
      return;
    }
    void loadGoogleIdentityServices().catch(() => {
      /* script load errors surface on click */
    });
  }, [providers.google.enabled, providers.google.clientId]);

  useEffect(() => {
    if (!providers.apple.enabled || !providers.apple.serviceId || !providers.apple.redirectUri) {
      appleInitialized.current = false;
      return;
    }

    void initAppleSignIn({
      clientId: providers.apple.serviceId,
      scope: 'name email',
      redirectURI: providers.apple.redirectUri,
      usePopup: true,
    })
      .then(() => {
        appleInitialized.current = true;
      })
      .catch(() => {
        appleInitialized.current = false;
      });
  }, [
    providers.apple.enabled,
    providers.apple.serviceId,
    providers.apple.redirectUri,
  ]);

  const completeLogin = useCallback(
    async (provider: OAuthProvider, idToken: string, firstName?: string, lastName?: string) => {
      const response =
        provider === 'google'
          ? await loginGuestWithGoogleOAuth(restaurantId, { idToken })
          : await loginGuestWithAppleOAuth(restaurantId, {
              idToken,
              firstName,
              lastName,
            });

      setAuth(response.accessToken, response.user);
      if (favoritesEnabled) {
        void mergeFavorites(restaurantId);
      }
      onSuccess();
    },
    [favoritesEnabled, mergeFavorites, onSuccess, restaurantId, setAuth],
  );

  async function handleGoogleClick() {
    if (loadingProvider || !providers.google.enabled || !providers.google.clientId) {
      return;
    }

    setLoadingProvider('google');
    onClearError();

    try {
      const idToken = await requestGoogleIdToken(providers.google.clientId);
      if (!idToken) {
        return;
      }
      await completeLogin('google', idToken);
    } catch (err) {
      onError(formatGuestOAuthError(err));
    } finally {
      setLoadingProvider(null);
    }
  }

  async function handleAppleClick() {
    if (loadingProvider || !providers.apple.enabled || !window.AppleID?.auth) {
      return;
    }

    if (!appleInitialized.current) {
      try {
        await initAppleSignIn({
          clientId: providers.apple.serviceId,
          scope: 'name email',
          redirectURI: providers.apple.redirectUri,
          usePopup: true,
        });
        appleInitialized.current = true;
      } catch {
        onError(formatGuestOAuthError(new Error('apple_unavailable')));
        return;
      }
    }

    setLoadingProvider('apple');
    onClearError();

    try {
      const result = await window.AppleID.auth.signIn();
      const idToken = result.authorization?.id_token;
      if (!idToken) {
        return;
      }
      const firstName = result.user?.name?.firstName;
      const lastName = result.user?.name?.lastName;
      await completeLogin('apple', idToken, firstName, lastName);
    } catch (err) {
      if (isAppleSignInCancelError(err)) {
        return;
      }
      onError(formatGuestOAuthError(err));
    } finally {
      setLoadingProvider(null);
    }
  }

  if (!hasEnabledProvider) {
    return null;
  }

  return (
    <div className="guest-oauth" data-testid="guest-oauth-section">
      <div className="guest-oauth__divider" role="presentation" data-testid="guest-oauth-divider">
        <span>или</span>
      </div>
      <div className="guest-oauth__buttons">
        {providers.apple.enabled ? (
          <Button
            type="button"
            variant="primary"
            size="md"
            fullWidth
            className="guest-oauth__btn guest-oauth__btn--apple"
            loading={loadingProvider === 'apple'}
            disabled={loadingProvider !== null && loadingProvider !== 'apple'}
            iconStart={<AppleMarkIcon />}
            onClick={handleAppleClick}
            testId="guest-oauth-apple"
          >
            Войти через Apple
          </Button>
        ) : null}
        {providers.google.enabled ? (
          <Button
            type="button"
            variant="secondary"
            size="md"
            fullWidth
            className="guest-oauth__btn guest-oauth__btn--google"
            loading={loadingProvider === 'google'}
            disabled={loadingProvider !== null && loadingProvider !== 'google'}
            iconStart={<GoogleMarkIcon />}
            onClick={handleGoogleClick}
            testId="guest-oauth-google"
          >
            Войти через Google
          </Button>
        ) : null}
      </div>
    </div>
  );
}
