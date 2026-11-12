'use client';

import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react';
import { cn } from '@/shared/ui/utils/cn';
import './IconButton.scss';

export type IconButtonVariant = 'ghost' | 'surface';
export type IconButtonSize = 'sm' | 'md';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  children: ReactNode;
  testId?: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, variant = 'ghost', size = 'md', children, className, testId, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn('ui-icon-btn', `ui-icon-btn--${variant}`, `ui-icon-btn--${size}`, className)}
      aria-label={label}
      data-testid={testId}
      {...rest}
    >
      {children}
    </button>
  );
});
