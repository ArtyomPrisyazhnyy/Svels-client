'use client';

import { type SelectHTMLAttributes, forwardRef } from 'react';
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
    <select ref={ref} className={cn('ui-select', className)} data-testid={testId} {...rest}>
      {children}
    </select>
  );
});
