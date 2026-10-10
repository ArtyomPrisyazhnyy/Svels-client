'use client';

import Link from 'next/link';
import {
  type ButtonHTMLAttributes,
  type ReactNode,
  forwardRef,
} from 'react';
import { cn } from '@/shared/ui/utils/cn';
import './Button.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  href?: string;
  children: ReactNode;
  testId?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    iconStart,
    iconEnd,
    href,
    children,
    className,
    disabled,
    testId,
    type = 'button',
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || loading;
  const classes = cn(
    'ui-btn',
    `ui-btn--${variant}`,
    `ui-btn--${size}`,
    fullWidth && 'ui-btn--full',
    loading && 'ui-btn--loading',
    className,
  );

  const content = (
    <>
      {loading ? <span className="ui-btn__spinner" aria-hidden /> : null}
      {iconStart ? <span className="ui-btn__icon ui-btn__icon--start">{iconStart}</span> : null}
      <span className="ui-btn__label">{children}</span>
      {iconEnd ? <span className="ui-btn__icon ui-btn__icon--end">{iconEnd}</span> : null}
    </>
  );

  if (href && !isDisabled) {
    return (
      <Link href={href} className={classes} data-testid={testId}>
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={isDisabled}
      data-testid={testId}
      aria-busy={loading || undefined}
      {...rest}
    >
      {content}
    </button>
  );
});
