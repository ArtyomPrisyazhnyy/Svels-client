'use client';

import { type TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/shared/ui/utils/cn';
import '../Input/Input.scss';
import './Textarea.scss';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  testId?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, testId, ...rest },
  ref,
) {
  return (
    <textarea ref={ref} className={cn('ui-textarea', className)} data-testid={testId} {...rest} />
  );
});
