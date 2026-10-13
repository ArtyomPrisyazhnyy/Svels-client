import { BadgePercent, CreditCard, Gift, Send } from 'lucide-react';
import type { LandingBenefitCard } from './landing-config';

const BENEFIT_ICONS = {
  commission: BadgePercent,
  loyalty: Gift,
  cart: CreditCard,
  telegram: Send,
} as const;

export function LandingBenefitIcon({ icon }: { icon: LandingBenefitCard['icon'] }) {
  const Icon = BENEFIT_ICONS[icon];
  return <Icon size={24} strokeWidth={1.75} aria-hidden />;
}
