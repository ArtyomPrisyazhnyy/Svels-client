'use client';

import '../styles/loyalty-flame-button.scss';

interface LoyaltyFlameHeaderButtonProps {
  lit: boolean;
  onClick: () => void;
}

export function LoyaltyFlameHeaderButton({ lit, onClick }: LoyaltyFlameHeaderButtonProps) {
  return (
    <button
      type="button"
      className={`loyalty-flame-button${lit ? ' loyalty-flame-button--lit' : ''}`}
      onClick={onClick}
      aria-label="Огонёк лояльности"
      title="Огонёк лояльности"
      data-testid="loyalty-flame-button"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
        <path
          fill="currentColor"
          d="M12 2c1.5 3.2-.2 5.2-1.5 6.6C9 10.2 8 11.5 8 14a4 4 0 0 0 8 0c0-2.2-1-4.1-2.2-5.6-.7-.9-1.4-1.8-1.4-3.2 0-.8.2-1.7.6-2.7.3 1.2 1.1 2.1 2.2 2.9C17.1 6.7 19 9.2 19 13a7 7 0 1 1-14 0c0-2.6 1.1-4.7 2.6-6.4C9.2 4.8 10.6 3.4 12 2z"
        />
      </svg>
    </button>
  );
}
