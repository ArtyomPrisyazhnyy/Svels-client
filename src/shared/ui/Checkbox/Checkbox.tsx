'use client';

import { type InputHTMLAttributes, type ReactNode, forwardRef, useId } from 'react';
import { cn } from '@/shared/ui/utils/cn';
import './Checkbox.scss';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  testId?: string;
  invalid?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, className, testId, id, invalid = false, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? rest.name ?? autoId;

  return (
    <label
      className={cn('ui-checkbox', invalid && 'ui-checkbox--invalid', className)}
      data-testid={testId ? `${testId}-label` : undefined}
    >
      <input
        ref={ref}
        type="checkbox"
        className="ui-checkbox__input"
        id={inputId}
        data-testid={testId}
        {...rest}
      />
      <span className="ui-checkbox__box" aria-hidden />
      <span className="ui-checkbox__label">{label}</span>
    </label>
  );
});
