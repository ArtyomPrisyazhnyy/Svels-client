import { type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/shared/ui/utils/cn';
import type { StackGap } from '@/shared/ui/Stack/Stack';
import './Cluster.scss';

export interface ClusterProps {
  gap?: StackGap;
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  className?: string;
  testId?: string;
  children: ReactNode;
}

export function Cluster({
  gap = 2,
  align = 'center',
  justify,
  className,
  testId,
  children,
}: ClusterProps) {
  return (
    <div
      className={cn('ui-cluster', className)}
      style={{
        gap: `var(--space-${gap})`,
        alignItems: align,
        justifyContent: justify,
      }}
      data-testid={testId}
    >
      {children}
    </div>
  );
}
