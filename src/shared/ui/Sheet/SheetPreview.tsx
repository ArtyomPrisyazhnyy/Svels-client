import { type ReactNode } from 'react';
import { ModalPanel, type OverlaySize } from '@/shared/ui/Modal/ModalPanel';

export interface SheetPreviewProps {
  title?: string;
  size?: OverlaySize;
  footer?: ReactNode;
  testId?: string;
  children: ReactNode;
}

export function SheetPreview({ title, size, footer, testId, children }: SheetPreviewProps) {
  return (
    <ModalPanel variant="sheet" preview active title={title} size={size} footer={footer} testId={testId}>
      {children}
    </ModalPanel>
  );
}
