import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import { Stack } from '@/shared/ui/Stack/Stack';
import { cn } from '@/shared/ui/utils/cn';
import './Field.scss';

export interface FieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  testId?: string;
  children: ReactNode;
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  className,
  testId,
  children,
}: FieldProps) {
  const hintId = hint ? `${htmlFor}-hint` : undefined;
  const errorId = error ? `${htmlFor}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  let control = children;
  if (isValidElement(children)) {
    const child = children as ReactElement<Record<string, unknown>>;
    const existingDescribedBy = child.props['aria-describedby'];
    const mergedDescribedBy =
      [
        typeof existingDescribedBy === 'string' ? existingDescribedBy : undefined,
        errorId,
        hintId,
      ]
        .filter(Boolean)
        .join(' ') || undefined;
    control = cloneElement(child, {
      id: child.props.id ?? htmlFor,
      'aria-describedby': mergedDescribedBy,
      'aria-invalid': error ? true : undefined,
    });
  }

  return (
    <Stack gap={2} className={cn('ui-field', className)} testId={testId}>
      <label className="ui-field__label" htmlFor={htmlFor}>
        {label}
        {required ? (
          <span className="ui-field__required" aria-hidden>
            {' '}
            *
          </span>
        ) : null}
      </label>
      <div className="ui-field__control" data-invalid={error ? 'true' : undefined}>
        {control}
      </div>
      {hint && !error ? (
        <p id={hintId} className="ui-field__hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="ui-field__error" role="alert" aria-live="assertive">
          {error}
        </p>
      ) : null}
    </Stack>
  );
}
