'use client';

import { type ReactNode, type RefObject, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useModalPresence } from '@/hooks/useModalPresence';
import { useOverlayRegistration } from '@/shared/ui/Modal/useOverlayRegistration';
import { ModalPanel, type OverlaySize } from '@/shared/ui/Modal/ModalPanel';
import { useBackdropClose } from '@/shared/ui/Modal/useBackdropClose';
import { useFocusTrap } from '@/shared/ui/Modal/useFocusTrap';
import { cn } from '@/shared/ui/utils/cn';
import './Modal.scss';

const MODAL_ANIMATION_MS = 200;

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  titleId?: string;
  size?: OverlaySize;
  footer?: ReactNode;
  closeLabel?: string;
  initialFocusRef?: RefObject<HTMLElement | null>;
  headerStart?: ReactNode;
  headerEnd?: ReactNode;
  testId?: string;
  rootTestId?: string;
  closeTestId?: string;
  panelClassName?: string;
  headerTestId?: string;
  titleTestId?: string;
  modalClassName?: string;
  /** Wraps the portaled tree so venue tokens / focus styles apply outside the page shell. */
  wrap?: (node: ReactNode) => ReactNode;
  children: ReactNode;
}

function ModalInner({
  onClose,
  title,
  titleId,
  size,
  footer,
  closeLabel,
  initialFocusRef,
  headerStart,
  headerEnd,
  testId,
  rootTestId,
  closeTestId,
  panelClassName,
  headerTestId,
  titleTestId,
  modalClassName,
  wrap,
  children,
}: Omit<ModalProps, 'open'>) {
  const { mounted, isActive, handleClose } = useModalPresence(onClose, MODAL_ANIMATION_MS);
  const panelRef = useRef<HTMLDivElement>(null);
  const { onBackdropPointerDown, onBackdropClick } = useBackdropClose(handleClose);

  useFocusTrap(panelRef, isActive, initialFocusRef);
  useOverlayRegistration(handleClose);

  if (!mounted) {
    return null;
  }

  const backdropClass = cn('ui-modal__backdrop', isActive && 'ui-modal__backdrop--active');

  const tree = (
    <>
      <button
        type="button"
        className={backdropClass}
        aria-label={closeLabel ?? 'Закрыть'}
        tabIndex={-1}
        onPointerDown={onBackdropPointerDown}
        onClick={onBackdropClick}
      />
      <div
        className={cn('ui-modal', modalClassName)}
        data-testid={rootTestId ?? (testId ? `${testId}-root` : undefined)}
      >
        <ModalPanel
          ref={panelRef}
          variant="modal"
          title={title}
          titleId={titleId}
          size={size}
          footer={footer}
          closeLabel={closeLabel}
          headerStart={headerStart}
          headerEnd={headerEnd}
          onRequestClose={handleClose}
          active={isActive}
          testId={testId}
          closeTestId={closeTestId}
          panelClassName={panelClassName}
          headerTestId={headerTestId}
          titleTestId={titleTestId}
        >
          {children}
        </ModalPanel>
      </div>
    </>
  );

  return createPortal(wrap ? wrap(tree) : tree, document.body);
}

export function Modal({ open, onClose, ...rest }: ModalProps) {
  if (!open) {
    return null;
  }

  return <ModalInner onClose={onClose} {...rest} />;
}
