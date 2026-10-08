'use client';

import { useState } from 'react';
import { ContactModal } from './ContactModal';

/**
 * Кнопка «Оставить заявку» в шапке и hero-секции лендинга.
 * Единственный клиентский островок, отвечающий за форму заявки.
 */
export function ContactButton({
  label = 'Оставить заявку',
  variant = 'primary',
  className,
}: {
  label?: string;
  variant?: 'primary' | 'ghost' | 'light';
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={`landing-cta landing-cta--${variant}${className ? ` ${className}` : ''}`}
        onClick={() => setOpen(true)}
        data-testid="landing-cta-contact"
      >
        {label}
      </button>
      {open && <ContactModal onClose={() => setOpen(false)} />}
    </>
  );
}
