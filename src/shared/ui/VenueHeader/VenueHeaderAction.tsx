'use client';

import Link from 'next/link';
import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@/shared/ui/utils/cn';
import './VenueHeaderAction.scss';

type VenueHeaderActionBaseProps = {
  label: string;
  testId?: string;
  wide?: boolean;
  className?: string;
  children: ReactNode;
  title?: string;
};

type VenueHeaderActionAsButton = VenueHeaderActionBaseProps & {
  href?: undefined;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label' | 'className'>;

type VenueHeaderActionAsLink = VenueHeaderActionBaseProps & {
  href: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'aria-label' | 'className' | 'href'>;

export type VenueHeaderActionProps = VenueHeaderActionAsButton | VenueHeaderActionAsLink;

function actionClassName(wide: boolean | undefined, className: string | undefined): string {
  return cn('venue-header-action', wide && 'venue-header-action--wide', className);
}

export function VenueHeaderAction(props: VenueHeaderActionProps) {
  const { label, testId, wide, className, children, title, href, ...rest } = props;
  const classes = actionClassName(wide, className);

  if (href !== undefined) {
    const linkRest = rest as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'aria-label' | 'className' | 'href'>;
    return (
      <Link
        href={href}
        className={classes}
        aria-label={label}
        title={title ?? label}
        data-testid={testId}
        {...linkRest}
      >
        {children}
      </Link>
    );
  }

  const buttonRest = rest as Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label' | 'className'>;
  return (
    <button
      type="button"
      className={classes}
      aria-label={label}
      title={title ?? label}
      data-testid={testId}
      {...buttonRest}
    >
      {children}
    </button>
  );
}
