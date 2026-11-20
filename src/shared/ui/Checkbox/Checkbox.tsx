'use client';

import { type InputHTMLAttributes, type ReactNode, forwardRef, useId } from 'react';
import { cn } from '@/shared/ui/utils/cn';
import './Checkbox.scss';

const CHECK_PATH =
  'M6.2 10.8L3.4 8l.95-.95 1.85 1.85 4.45-4.45.95.95-5.4 5.4z';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  testId?: string;
  inputTestId?: string;
  /** Vertical alignment of the box relative to multi-line labels. */
  align?: 'start' | 'center';
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, className, testId, inputTestId, align = 'center', id, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? rest.name ?? autoId;

  return (
    <label
      className={cn('ui-checkbox', align === 'start' && 'ui-checkbox--align-start', className)}
      data-testid={testId}
    >
      <input
        ref={ref}
        type="checkbox"
        className="ui-checkbox__input"
        id={inputId}
        data-testid={inputTestId}
        {...rest}
      />
      <span className="ui-checkbox__box" aria-hidden="true">
        <span className="ui-checkbox__box-surface">
          <svg
            className="ui-checkbox__check"
            viewBox="0 0 16 16"
            width="12"
            height="12"
            aria-hidden="true"
            focusable="false"
          >
            <path d={CHECK_PATH} fill="currentColor" />
          </svg>
        </span>
      </span>
      <span className="ui-checkbox__label">{label}</span>
    </label>
  );
});
