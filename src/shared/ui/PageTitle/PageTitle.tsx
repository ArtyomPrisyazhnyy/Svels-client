import { type ReactNode } from 'react';
import { cn } from '@/shared/ui/utils/cn';
import './PageTitle.scss';

export interface PageTitleProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
  testId?: string;
}

export function PageTitle({ title, subtitle, actions, className, testId }: PageTitleProps) {
  return (
    <header className={cn('ui-page-title', className)} data-testid={testId}>
      <div className="ui-page-title__text">
        <h1 className="ui-page-title__heading">{title}</h1>
        {subtitle ? <p className="ui-page-title__subtitle">{subtitle}</p> : null}
      </div>
      {actions ? <div className="ui-page-title__actions">{actions}</div> : null}
    </header>
  );
}
