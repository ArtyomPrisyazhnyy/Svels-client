import { type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/shared/ui/utils/cn';
import './Stack.scss';

export type StackGap = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10;

export interface StackProps {
  gap?: StackGap;
  direction?: 'column' | 'row';
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  wrap?: boolean;
  as?: 'div' | 'ul' | 'section';
  className?: string;
  testId?: string;
  children: ReactNode;
}

export function Stack({
  gap = 4,
  direction = 'column',
  align,
  justify,
  wrap = false,
  as: Tag = 'div',
  className,
  testId,
  children,
}: StackProps) {
  const style: CSSProperties = {
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap ? 'wrap' : undefined,
  };

  return (
    <Tag
      className={cn('ui-stack', `ui-stack--${direction}`, className)}
      style={{ ...style, gap: `var(--space-${gap})` }}
      data-testid={testId}
    >
      {children}
    </Tag>
  );
}
