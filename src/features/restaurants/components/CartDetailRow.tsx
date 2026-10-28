'use client';

import type { ReactNode } from 'react';
import { CollapsibleRow } from '@/shared/ui/CollapsibleRow/CollapsibleRow';
import '../styles/cart-detail-row.scss';

interface CartDetailRowProps {
  label: string;
  value: string;
  expanded: boolean;
  onToggle: () => void;
  children?: ReactNode;
  error?: string | null;
  testId?: string;
  /** Inside `.cart-checkout-rows` — no outer card border */
  grouped?: boolean;
  /** Opens external UI (sheet) — no expand panel */
  navigate?: boolean;
  valueEllipsis?: boolean;
}

export function CartDetailRow({
  label,
  value,
  expanded,
  onToggle,
  children,
  error,
  testId,
  grouped = false,
  navigate = false,
  valueEllipsis = false,
}: CartDetailRowProps) {
  const rowClass = [
    'cart-detail-row',
    error ? 'cart-detail-row--error' : '',
    expanded && !navigate ? 'cart-detail-row--expanded' : '',
    grouped ? 'cart-detail-row--grouped' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <CollapsibleRow
      label={label}
      value={value}
      expanded={expanded}
      onToggle={onToggle}
      error={error}
      testId={testId}
      navigate={navigate}
      valueEllipsis={valueEllipsis}
      className={rowClass}
    >
      {children}
    </CollapsibleRow>
  );
}
