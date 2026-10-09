'use client';

import type { ReactNode } from 'react';
import '../styles/cart-detail-row.scss';

interface CartDetailRowProps {
  label: string;
  value: string;
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
  error?: string | null;
  testId?: string;
}

export function CartDetailRow({
  label,
  value,
  expanded,
  onToggle,
  children,
  error,
  testId,
}: CartDetailRowProps) {
  const hasValue = value.trim().length > 0;

  return (
    <div
      className={`cart-detail-row${error ? ' cart-detail-row--error' : ''}${
        expanded ? ' cart-detail-row--expanded' : ''
      }${hasValue ? '' : ' cart-detail-row--no-value'}`}
      data-testid={testId}
    >
      <button
        type="button"
        className="cart-detail-row__trigger"
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <span className="cart-detail-row__label">{label}</span>
        {hasValue ? <span className="cart-detail-row__value">{value}</span> : null}
        <span className="cart-detail-row__chevron" aria-hidden>›</span>
      </button>
      {error && <p className="cart-detail-row__error" role="alert">{error}</p>}
      {expanded && <div className="cart-detail-row__content">{children}</div>}
    </div>
  );
}
