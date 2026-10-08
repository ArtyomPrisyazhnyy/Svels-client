export type PricingPeriod = 'month' | 'year';

export interface LandingPlan {
  id: 'site' | 'app';
  name: string;
  description: string;
  monthly: number;
  yearly: number;
}

/** Месячные и годовые цены, которые задал продукт. */
export const LANDING_PLANS: LandingPlan[] = [
  {
    id: 'site',
    name: 'Сайт',
    description: 'Бронирование, меню и страница заведения на своём домене.',
    monthly: 119,
    yearly: 990,
  },
  {
    id: 'app',
    name: 'Мобильное приложение',
    description: 'White-label приложение под ваш бренд в App Store и Google Play.',
    monthly: 149,
    yearly: 1190,
  },
];

export function yearlyMonthlyEquivalent(yearly: number): number {
  return yearly / 12;
}

export function monthlySavings(monthly: number, yearly: number): number {
  return monthly - yearlyMonthlyEquivalent(yearly);
}

export function formatByn(amount: number): string {
  const hasFraction = Math.abs(amount % 1) > 1e-8;
  const [integerPart, fractionPart] = amount.toFixed(hasFraction ? 2 : 0).split('.');
  const grouped = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return fractionPart ? `${grouped},${fractionPart}` : grouped;
}
