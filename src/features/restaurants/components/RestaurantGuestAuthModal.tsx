'use client';

import { GuestOtpAuthForm } from '@/features/auth/components/GuestOtpAuthForm';
import { Modal } from '@/shared/ui/Modal/Modal';
import { RestaurantStylingPortalRoot } from '../context/RestaurantStylingContext';
import '@/features/auth/styles/auth.scss';
import '../styles/restaurant-auth-modal.scss';

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
  return (
    <Modal
      open
      onClose={onClose}
      title={`Вход в ${restaurantName}`}
      titleId="restaurant-auth-modal-title"
      titleTestId="restaurant-auth-modal-title"
      rootTestId="restaurant-auth-modal"
      testId="restaurant-auth-modal-panel"
      closeTestId="restaurant-auth-modal-close"
      panelClassName="restaurant-auth-modal__panel"
      size="sm"
      wrap={(node) => <RestaurantStylingPortalRoot>{node}</RestaurantStylingPortalRoot>}
    >
      <p className="restaurant-auth-modal__subtitle">Код придёт в Telegram или по SMS</p>
      <div className="restaurant-auth-modal__body">
        <GuestOtpAuthForm restaurantId={restaurantId} onSuccess={onClose} />
      </div>
    </Modal>
  );
}
