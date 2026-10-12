'use client';

import { type ReactNode, type RefObject, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useModalPresence } from '@/hooks/useModalPresence';
import { useOverlayRegistration } from '@/shared/ui/Modal/useOverlayRegistration';
import { ModalPanel, type OverlaySize } from '@/shared/ui/Modal/ModalPanel';
import { useBackdropClose } from '@/shared/ui/Modal/useBackdropClose';
import { useFocusTrap } from '@/shared/ui/Modal/useFocusTrap';
import { cn } from '@/shared/ui/utils/cn';
import '@/shared/ui/Modal/Modal.scss';
import './Sheet.scss';

const SHEET_ANIMATION_MS = 200;

export interface SheetProps {
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
  /** Render above an open modal (e.g. sheet opened from cart checkout). */
  stacked?: boolean;
  /** Wraps the portaled tree so venue tokens apply outside the page shell. */
  wrap?: (node: ReactNode) => ReactNode;
  children: ReactNode;
}

function SheetInner({
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
  stacked = false,
  wrap,
  children,
}: Omit<SheetProps, 'open'>) {
  const { mounted, isActive, handleClose } = useModalPresence(onClose, SHEET_ANIMATION_MS);
  const panelRef = useRef<HTMLDivElement>(null);
  const { onBackdropPointerDown, onBackdropClick } = useBackdropClose(handleClose);

  useFocusTrap(panelRef, isActive, initialFocusRef);
  useOverlayRegistration(handleClose);

  if (!mounted) {
    return null;
  }

  const backdropClass = cn(
    'ui-sheet__backdrop',
    stacked && 'ui-sheet__backdrop--stacked',
    isActive && 'ui-sheet__backdrop--active',
  );
  const sheetClass = cn('ui-sheet', stacked && 'ui-sheet--stacked');

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
      <div className={sheetClass} data-testid={testId ? `${testId}-root` : undefined}>
        <ModalPanel
          ref={panelRef}
          variant="sheet"
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
    </>
  );

  return createPortal(wrap ? wrap(tree) : tree, document.body);
}

export function Sheet({ open, onClose, ...rest }: SheetProps) {
  if (!open) {
    return null;
  }

  return <SheetInner onClose={onClose} {...rest} />;
}
