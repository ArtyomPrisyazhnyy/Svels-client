'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { useScrollLock } from '@/hooks/useScrollLock';
import { SegmentedSwitcher } from './SegmentedSwitcher';
import { RestaurantStylingPortalRoot } from '../context/RestaurantStylingContext';
import '@/features/auth/styles/auth.scss';
import '../styles/restaurant-auth-modal.scss';

const MODAL_ANIMATION_MS = 200;

type AuthTab = 'login' | 'register';

const AUTH_TAB_OPTIONS = [
  { key: 'login' as const, title: 'Вход' },
  { key: 'register' as const, title: 'Регистрация' },
];

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
  const [mounted, setMounted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [tab, setTab] = useState<AuthTab>('login');

  useScrollLock(mounted);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsActive(true));
    });

    return () => cancelAnimationFrame(frame);
  }, [mounted]);

  const handleClose = useCallback(() => {
    setIsActive(false);
    window.setTimeout(onClose, MODAL_ANIMATION_MS);
  }, [onClose]);

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
                Регистрация по номеру телефона действует только для этого заведения.
              </p>
            </header>

            <div className="restaurant-auth-modal__body">
              <div className="restaurant-auth-modal__switcher">
                <SegmentedSwitcher
                  options={AUTH_TAB_OPTIONS}
                  value={tab}
                  onChange={setTab}
                  ariaLabel="Вход или регистрация"
                />
              </div>

              {tab === 'login' ? (
                <LoginForm restaurantId={restaurantId} onSuccess={handleClose} />
              ) : (
                <RegisterForm restaurantId={restaurantId} onSuccess={handleClose} />
              )}
            </div>
          </div>
        </div>
      </>
    </RestaurantStylingPortalRoot>,
    document.body,
  );
}
