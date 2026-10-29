import { type ReactNode } from 'react';
import { cn } from '@/shared/ui/utils/cn';
import './PageTitle.scss';

export interface PageTitleProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
  testId?: string;
  /** Shell pages already expose an h1. */
  level?: 1 | 2;
}

export function PageTitle({
  title,
  subtitle,
  actions,
  className,
  testId,
  level = 1,
}: PageTitleProps) {
  const Heading = level === 2 ? 'h2' : 'h1';

  return (
    <header className={cn('ui-page-title', className)} data-testid={testId}>
      <div className="ui-page-title__text">
        <Heading className="ui-page-title__heading">{title}</Heading>
        {subtitle ? <p className="ui-page-title__subtitle">{subtitle}</p> : null}
      </div>
      {actions ? <div className="ui-page-title__actions">{actions}</div> : null}
    </header>
  );
}
