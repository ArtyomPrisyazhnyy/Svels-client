'use client';

import { type SelectHTMLAttributes, forwardRef } from 'react';
import { IconChevron } from '@/shared/ui/icons/icons';
import { cn } from '@/shared/ui/utils/cn';
import '../Input/Input.scss';
import './Select.scss';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  testId?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, testId, children, ...rest },
  ref,
) {
  return (
    <div className="ui-select-wrap">
      <select ref={ref} className={cn('ui-select', className)} data-testid={testId} {...rest}>
        {children}
      </select>
      <span className="ui-select__chevron" aria-hidden>
        <IconChevron />
      </span>
    </div>
  );
});
