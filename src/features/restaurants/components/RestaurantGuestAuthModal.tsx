'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { GuestOtpAuthForm } from '@/features/auth/components/GuestOtpAuthForm';
import { useModalPresence } from '@/hooks/useModalPresence';
import { RestaurantStylingPortalRoot } from '../context/RestaurantStylingContext';
import '@/features/auth/styles/auth.scss';
import '../styles/restaurant-auth-modal.scss';

const MODAL_ANIMATION_MS = 200;

interface RestaurantGuestAuthModalProps {
  restaurantId: string;
  restaurantName: string;
  onClose: () => void;
}

export function RestaurantGuestAuthModal({
  restaurantId,
  restaurantName,
  onClose,
}: RestaurantGuestAuthModalProps) {
  const { mounted, isActive, handleClose } = useModalPresence(onClose, MODAL_ANIMATION_MS);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose]);

  if (!mounted) {
    return null;
  }

  const activeClass = isActive ? ' restaurant-auth-modal--active' : '';

  return createPortal(
    <RestaurantStylingPortalRoot>
      <>
        <button
          type="button"
          className={`restaurant-auth-modal__backdrop${activeClass}`}
          onClick={handleClose}
          aria-label="Закрыть"
        />

        <div
          className={`restaurant-auth-modal${activeClass}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="restaurant-auth-modal-title"
        >
          <div className={`restaurant-auth-modal__panel${activeClass}`}>
            <button
              type="button"
              className="restaurant-auth-modal__close"
              onClick={handleClose}
              aria-label="Закрыть"
            >
              ×
            </button>

            <header className="restaurant-auth-modal__header">
              <h2 id="restaurant-auth-modal-title">Вход в {restaurantName}</h2>
              <p className="restaurant-auth-modal__subtitle">
                Код придёт в Telegram или по SMS
              </p>
            </header>

            <div className="restaurant-auth-modal__body">
              <GuestOtpAuthForm restaurantId={restaurantId} onSuccess={handleClose} />
            </div>
          </div>
        </div>
      </>
    </RestaurantStylingPortalRoot>,
    document.body,
  );
}
