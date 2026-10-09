import type { LandingBenefitCard } from './landing-config';

export function LandingBenefitIcon({ icon }: { icon: LandingBenefitCard['icon'] }) {
  switch (icon) {
    case 'commission':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3v18M7 8h7a3 3 0 1 1 0 6H9a3 3 0 1 0 0 6h10"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'loyalty':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 21s-6.5-4.2-8.5-8.2C1.8 9.4 3.6 6 6.8 6c1.7 0 3.1.9 3.9 2.1C11.5 6.9 12.9 6 14.6 6c3.2 0 5 3.4 3.3 6.8C18.5 16.8 12 21 12 21z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'cart':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M6 6h15l-1.5 9h-11L5 3H2"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="20" r="1.25" fill="currentColor" />
          <circle cx="17" cy="20" r="1.25" fill="currentColor" />
        </svg>
      );
    case 'telegram':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M21 4 3.5 11.2c-.9.4-.9 1.6.1 1.9l4.6 1.5 1.8 5.5c.3.9 1.5.9 1.8 0l2.1-6.2 5.9-5.4c.7-.6.3-1.8-.8-1.5L10.5 14l-2.4-2.5L21 4z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}
