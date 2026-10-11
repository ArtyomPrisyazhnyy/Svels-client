'use client';

import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/shared/ui/utils/cn';
import './Input.scss';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  testId?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, testId, ...rest },
  ref,
) {
  return (
    <input ref={ref} className={cn('ui-input', className)} data-testid={testId} {...rest} />
  );
});
