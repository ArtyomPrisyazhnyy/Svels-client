'use client';

import type { ReactNode } from 'react';
import { ModalPreview } from '@/shared/ui';

interface CartVariantFrameProps {
  title: string;
  footer?: ReactNode;
  children: ReactNode;
}

export function CartVariantFrame({ title, footer, children }: CartVariantFrameProps) {
  return (
    <ModalPreview
      title={title}
      size="md"
      testId="cart-variant-panel"
      panelClassName="restaurant-cart-modal__panel cart-variant-frame"
      footer={footer}
    >
      <div className="restaurant-cart-modal__body">{children}</div>
    </ModalPreview>
  );
}
