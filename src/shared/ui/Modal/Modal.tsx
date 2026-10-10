'use client';

import { type ReactNode, type RefObject, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useModalPresence } from '@/hooks/useModalPresence';
import { pushOverlay, subscribeEscapeKey } from '@/shared/ui/Modal/modal-stack';
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
  children,
}: Omit<ModalProps, 'open'>) {
  const { mounted, isActive, handleClose } = useModalPresence(onClose, MODAL_ANIMATION_MS);
  const panelRef = useRef<HTMLDivElement>(null);
  const { onBackdropPointerDown, onBackdropClick } = useBackdropClose(handleClose);

  useFocusTrap(panelRef, isActive, initialFocusRef);

  useEffect(() => {
    const pop = pushOverlay(handleClose);
    const unsub = subscribeEscapeKey(handleClose);
    return () => {
      pop();
      unsub();
    };
  }, [handleClose]);

  if (!mounted) {
    return null;
  }

  const backdropClass = cn('ui-modal__backdrop', isActive && 'ui-modal__backdrop--active');

  return createPortal(
    <>
      <button
        type="button"
        className={backdropClass}
        aria-label={closeLabel ?? 'Закрыть'}
        tabIndex={-1}
        onPointerDown={onBackdropPointerDown}
        onClick={onBackdropClick}
      />
      <div className="ui-modal" data-testid={testId ? `${testId}-root` : undefined}>
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
        >
          {children}
        </ModalPanel>
      </div>
    </>,
    document.body,
  );
}

export function Modal({ open, onClose, ...rest }: ModalProps) {
  if (!open) {
    return null;
  }

  return <ModalInner onClose={onClose} {...rest} />;
}
