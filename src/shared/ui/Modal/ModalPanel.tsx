'use client';

import { type CSSProperties, type PointerEvent, type ReactNode, forwardRef, useId, useRef, useState } from 'react';
import { IconClose } from '@/shared/ui/icons/icons';
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
  closeTestId?: string;
  panelClassName?: string;
  headerTestId?: string;
  titleTestId?: string;
  showClose?: boolean;
  /** Drag the top grab zone downward to close. Used by bottom sheets. */
  swipeToClose?: boolean;
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
    closeTestId,
    panelClassName,
    headerTestId,
    titleTestId,
    showClose = true,
    swipeToClose = false,
    children,
  },
  ref,
) {
  const autoId = useId();
  const titleId = titleIdProp ?? (title ? `modal-title-${autoId}` : undefined);
  const activeClass = active ? ' ui-overlay-panel--active' : '';
  const dragOrigin = useRef(0);
  const dragging = useRef(false);
  const dragYRef = useRef(0);
  const [dragY, setDragY] = useState(0);

  function onGrabPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!swipeToClose || event.button !== 0) {
      return;
    }
    dragging.current = true;
    dragOrigin.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onGrabPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragging.current) {
      return;
    }
    const next = Math.max(0, event.clientY - dragOrigin.current);
    dragYRef.current = next;
    setDragY(next);
  }

  function onGrabPointerEnd() {
    if (!dragging.current) {
      return;
    }
    dragging.current = false;
    const distance = dragYRef.current;
    dragYRef.current = 0;
    setDragY(0);
    if (distance > 72) {
      onRequestClose?.();
    }
  }

  const panelStyle: CSSProperties | undefined =
    dragY > 0 ? { transform: `translateY(${dragY}px)`, transition: 'none' } : undefined;

  return (
    <div
      ref={ref}
      style={panelStyle}
      className={cn(
        'ui-overlay-panel',
        `ui-overlay-panel--${variant}`,
        `ui-overlay-panel--size-${size}`,
        preview && 'ui-overlay-panel--preview',
        activeClass,
        panelClassName,
      )}
      role="dialog"
      aria-modal={preview ? undefined : 'true'}
      aria-labelledby={title ? titleId : undefined}
      data-testid={testId}
      tabIndex={-1}
    >
      {variant === 'sheet' ? <div className="ui-overlay-panel__handle" aria-hidden /> : null}
      {swipeToClose ? (
        <div
          className="ui-overlay-panel__grab"
          onPointerDown={onGrabPointerDown}
          onPointerMove={onGrabPointerMove}
          onPointerUp={onGrabPointerEnd}
          onPointerCancel={onGrabPointerEnd}
        />
      ) : null}
      <header className="ui-overlay-panel__header" data-testid={headerTestId}>
        <div className="ui-overlay-panel__header-start">{headerStart}</div>
        {title ? (
          <h2 id={titleId} className="ui-overlay-panel__title" data-testid={titleTestId}>
            {title}
          </h2>
        ) : (
          <div className="ui-overlay-panel__title-spacer" aria-hidden />
        )}
        <div className="ui-overlay-panel__header-end">
          {headerEnd}
          {onRequestClose && showClose ? (
            <IconButton
              label={closeLabel}
              size="md"
              variant="ghost"
              className="ui-overlay-panel__close"
              onClick={onRequestClose}
              testId={closeTestId ?? (testId ? `${testId}-close` : undefined)}
            >
              <IconClose />
            </IconButton>
          ) : null}
        </div>
      </header>
      <div className="ui-overlay-panel__body">{children}</div>
      {footer ? <footer className="ui-overlay-panel__footer">{footer}</footer> : null}
    </div>
  );
});
