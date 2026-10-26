'use client';

import type { ReactNode } from 'react';
import { IconChevron } from '@/shared/ui/icons/icons';
import { cn } from '@/shared/ui/utils/cn';
import './CollapsibleRow.scss';

export interface CollapsibleRowProps {
  label: string;
  value?: string;
  expanded: boolean;
  onToggle: () => void;
  children?: ReactNode;
  error?: string | null;
  testId?: string;
  /** Summary stays visible when row opens an external surface (sheet). */
  navigate?: boolean;
  valueEllipsis?: boolean;
  className?: string;
}

export function CollapsibleRow({
  label,
  value = '',
  expanded,
  onToggle,
  children,
  error,
  testId,
  navigate = false,
  valueEllipsis = false,
  className,
}: CollapsibleRowProps) {
  const hasValue = value.trim().length > 0;
  const showValue = hasValue && (!expanded || navigate);

  return (
    <div
      className={cn(
        'ui-collapsible-row',
        expanded && !navigate && 'ui-collapsible-row--expanded',
        error && 'ui-collapsible-row--error',
        className,
      )}
      data-testid={testId}
    >
      <button
        type="button"
        className="ui-collapsible-row__trigger"
        onClick={onToggle}
        aria-expanded={navigate ? false : expanded}
      >
        <span className="ui-collapsible-row__label">{label}</span>
        <span
          className={cn(
            'ui-collapsible-row__value',
            !showValue && 'ui-collapsible-row__value--hidden',
            valueEllipsis && 'ui-collapsible-row__value--ellipsis',
          )}
        >
          {value}
        </span>
        <span className="ui-collapsible-row__chevron" aria-hidden>
          <IconChevron />
        </span>
      </button>
      {error && (
        <p className="ui-collapsible-row__error" role="alert">
          {error}
        </p>
      )}
      {expanded && !navigate && children && (
        <div className="ui-collapsible-row__content">{children}</div>
      )}
    </div>
  );
}
