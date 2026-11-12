'use client';

import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/shared/ui/utils/cn';
import './RangeInput.scss';

export interface RangeInputProps extends InputHTMLAttributes<HTMLInputElement> {
  testId?: string;
}

export const RangeInput = forwardRef<HTMLInputElement, RangeInputProps>(function RangeInput(
  { className, testId, type = 'range', ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn('ui-range', className)}
      data-testid={testId}
      {...rest}
    />
  );
});
