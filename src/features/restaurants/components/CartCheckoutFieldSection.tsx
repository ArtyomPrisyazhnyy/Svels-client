'use client';

import type { ReactNode } from 'react';
import '../styles/cart-checkout-section.scss';

interface CartCheckoutFieldSectionProps {
  title: string;
  children: ReactNode;
  error?: string | null;
  testId?: string;
}

/** Always-visible checkout block (time, payment) inside `.cart-checkout-rows`. */
export function CartCheckoutFieldSection({
  title,
  children,
  error,
  testId,
}: CartCheckoutFieldSectionProps) {
  return (
    <section
      className={`cart-checkout-field-section${error ? ' cart-checkout-field-section--error' : ''}`}
      data-testid={testId}
    >
      <h3 className="cart-checkout-field-section__title">{title}</h3>
      {error && (
        <p className="cart-checkout-field-section__error" role="alert">
          {error}
        </p>
      )}
      <div className="cart-checkout-field-section__body">{children}</div>
    </section>
  );
}
