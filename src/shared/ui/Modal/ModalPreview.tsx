import { type ReactNode } from 'react';
import { ModalPanel, type OverlaySize } from '@/shared/ui/Modal/ModalPanel';

export interface ModalPreviewProps {
  title?: string;
  size?: OverlaySize;
  footer?: ReactNode;
  headerStart?: ReactNode;
  headerEnd?: ReactNode;
  testId?: string;
  panelClassName?: string;
  children: ReactNode;
}

export function ModalPreview({
  title,
  size,
  footer,
  headerStart,
  headerEnd,
  testId,
  panelClassName,
  children,
}: ModalPreviewProps) {
  return (
    <ModalPanel
      variant="modal"
      preview
      active
      title={title}
      size={size}
      footer={footer}
      headerStart={headerStart}
      headerEnd={headerEnd}
      testId={testId}
      panelClassName={panelClassName}
    >
      {children}
    </ModalPanel>
  );
}
