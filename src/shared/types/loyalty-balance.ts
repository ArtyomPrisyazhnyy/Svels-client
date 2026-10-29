import type { LoyaltyReward } from './loyalty-settings';

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
}
