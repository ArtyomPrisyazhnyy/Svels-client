'use client';

import { type InputHTMLAttributes, forwardRef, useId } from 'react';
import { cn } from '@/shared/ui/utils/cn';
import './Checkbox.scss';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  testId?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, className, testId, id, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? rest.name ?? autoId;

  return (
    <label className={cn('ui-checkbox', className)} data-testid={testId}>
      <input ref={ref} type="checkbox" className="ui-checkbox__input" id={inputId} {...rest} />
      <span className="ui-checkbox__box" aria-hidden />
      <span className="ui-checkbox__label">{label}</span>
    </label>
  );
});
