import { cn } from '@/shared/ui/utils/cn';

export interface FormLiveErrorProps {
  message: string;
  className?: string;
  testId?: string;
  id?: string;
}

/** Announces form-level errors to assistive tech (aria-live). */
export function FormLiveError({ message, className, testId, id }: FormLiveErrorProps) {
  return (
    <p
      id={id}
      className={cn(className)}
      role="alert"
      aria-live="assertive"
      data-testid={testId}
    >
      {message}
    </p>
  );
}
