import { cn } from '@/shared/ui/utils/cn';
import './Skeleton.scss';

export type SkeletonVariant = 'text' | 'rect' | 'circle';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  radius?: string;
  lines?: number;
  className?: string;
  testId?: string;
}

function toCssSize(value?: string | number): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  return typeof value === 'number' ? `${value}px` : value;
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  radius,
  lines = 1,
  className,
  testId,
}: SkeletonProps) {
  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('ui-skeleton-lines', className)} data-testid={testId} aria-hidden>
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className="ui-skeleton ui-skeleton--text"
            style={{
              width: index === lines - 1 ? '72%' : toCssSize(width) ?? '100%',
              height: toCssSize(height) ?? '0.875rem',
              borderRadius: radius,
            }}
          />
        ))}
      </div>
    );
  }

  const defaultHeight =
    variant === 'circle' ? '2.5rem' : variant === 'text' ? '0.875rem' : '4rem';
  const defaultWidth = variant === 'circle' ? '2.5rem' : '100%';
  const defaultRadius =
    variant === 'circle' ? 'var(--radius-pill)' : variant === 'text' ? 'var(--radius-sm)' : 'var(--radius-md)';

  return (
    <div
      className={cn('ui-skeleton', `ui-skeleton--${variant}`, className)}
      style={{
        width: toCssSize(width) ?? defaultWidth,
        height: toCssSize(height) ?? defaultHeight,
        borderRadius: radius ?? defaultRadius,
      }}
      data-testid={testId}
      aria-hidden
    />
  );
}

export interface SkeletonListProps {
  rows?: number;
  testId?: string;
}

export function SkeletonList({ rows = 3, testId }: SkeletonListProps) {
  return (
    <div className="ui-skeleton-list" data-testid={testId} aria-hidden>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="ui-skeleton-list__row">
          <Skeleton variant="circle" width={40} height={40} />
          <div className="ui-skeleton-list__text">
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="80%" />
          </div>
        </div>
      ))}
    </div>
  );
}
