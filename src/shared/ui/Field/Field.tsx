import { type ReactNode } from 'react';
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

  return (
    <Stack gap={1} className={cn('ui-field', className)} testId={testId}>
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
        {children}
      </div>
      {hint && !error ? (
        <p id={hintId} className="ui-field__hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="ui-field__error" role="alert">
          {error}
        </p>
      ) : null}
    </Stack>
  );
}
