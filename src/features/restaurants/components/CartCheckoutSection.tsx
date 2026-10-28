'use client';

import type { ReactNode } from 'react';
import { Stack, type StackGap } from '@/shared/ui';
import '../styles/cart-checkout-section.scss';

interface CartCheckoutSectionProps {
  children: ReactNode;
  testId?: string;
  gap?: StackGap;
  className?: string;
}

export function CartCheckoutSection({
  children,
  testId,
  gap = 3,
  className,
}: CartCheckoutSectionProps) {
  const sectionClass = className
    ? `cart-checkout-section ${className}`
    : 'cart-checkout-section';

  return (
    <Stack gap={gap} as="section" className={sectionClass} testId={testId}>
      {children}
    </Stack>
  );
}
