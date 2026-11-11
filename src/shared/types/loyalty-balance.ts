import type { LoyaltyReward } from './loyalty-settings';

export type LoyaltyStreakStatus = 'none' | 'active' | 'expiring';

export interface LoyaltyLevelSnapshot {
  id: string;
  name: string;
  requiredVisits: number;
}

export interface LoyaltyNextLevelSnapshot extends LoyaltyLevelSnapshot {
  visitsLeft: number;
}

export interface LoyaltyBalance {
  restaurantId: string;
  userId: string;
  enabled: boolean;
  rewardsEnabled: boolean;
  visits: number;
  totalVisits: number;
  lastVisitAt: string | null;
  expiresAt: string | null;
  currentLevel: LoyaltyLevelSnapshot | null;
  nextLevel: LoyaltyNextLevelSnapshot | null;
  availableRewards: LoyaltyReward[];
  /** ISO; начало текущей серии (опционально для совместимости). */
  streakStartedAt?: string | null;
  /** Дней в текущей серии; 0 если серии нет. */
  streakDays?: number;
  longestStreak?: number;
  status?: LoyaltyStreakStatus;
}
