'use client';

import { type ReactNode, forwardRef, useId } from 'react';
import { IconButton } from '@/shared/ui/IconButton/IconButton';
import { cn } from '@/shared/ui/utils/cn';
import './Modal.scss';

export type OverlaySize = 'sm' | 'md' | 'lg';

export interface ModalPanelProps {
  title?: string;
  titleId?: string;
  size?: OverlaySize;
  footer?: ReactNode;
  closeLabel?: string;
  headerStart?: ReactNode;
  headerEnd?: ReactNode;
  onRequestClose?: () => void;
  active?: boolean;
  variant: 'modal' | 'sheet';
  preview?: boolean;
  testId?: string;
  children: ReactNode;
}

export const ModalPanel = forwardRef<HTMLDivElement, ModalPanelProps>(function ModalPanel(
  {
    title,
    titleId: titleIdProp,
    size = 'md',
    footer,
    closeLabel = 'Закрыть',
    headerStart,
    headerEnd,
    onRequestClose,
    active = true,
    variant,
    preview = false,
    testId,
    children,
  },
  ref,
) {
  const autoId = useId();
  const titleId = titleIdProp ?? (title ? `modal-title-${autoId}` : undefined);
  const activeClass = active ? ' ui-overlay-panel--active' : '';

  return (
    <div
      ref={ref}
      className={cn(
        'ui-overlay-panel',
        `ui-overlay-panel--${variant}`,
        `ui-overlay-panel--size-${size}`,
        preview && 'ui-overlay-panel--preview',
        activeClass,
      )}
      role="dialog"
      aria-modal={preview ? undefined : 'true'}
      aria-labelledby={title ? titleId : undefined}
      data-testid={testId}
      tabIndex={-1}
    >
      {variant === 'sheet' ? <div className="ui-overlay-panel__handle" aria-hidden /> : null}
      <header className="ui-overlay-panel__header">
        <div className="ui-overlay-panel__header-start">{headerStart}</div>
        {title ? (
          <h2 id={titleId} className="ui-overlay-panel__title">
            {title}
          </h2>
        ) : (
          <div className="ui-overlay-panel__title-spacer" aria-hidden />
        )}
        <div className="ui-overlay-panel__header-end">
          {headerEnd}
          {onRequestClose ? (
            <IconButton
              label={closeLabel}
              size="md"
              variant="ghost"
              className="ui-overlay-panel__close"
              onClick={onRequestClose}
              testId={testId ? `${testId}-close` : undefined}
            >
              ×
            </IconButton>
          ) : null}
        </div>
      </header>
      <div className="ui-overlay-panel__body">{children}</div>
      {footer ? <footer className="ui-overlay-panel__footer">{footer}</footer> : null}
    </div>
  );
});
