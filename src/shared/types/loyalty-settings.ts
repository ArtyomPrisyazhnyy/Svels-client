export type LoyaltyRewardType =
  | 'percent_discount'
  | 'fixed_discount'
  | 'free_menu_item'
  | 'custom';

export interface LoyaltyReward {
  id: string;
  type: LoyaltyRewardType;
  title: string;
  description: string | null;
  percentOff: number | null;
  amountOff: number | null;
  menuItemId: string | null;
  minOrderAmount: number | null;
}

export interface FlameLevel {
  id: string;
  name: string;
  requiredVisits: number;
  rewards: LoyaltyReward[];
}

export interface OtherLoyaltyProgramStub {
  id: string;
  enabled: boolean;
  name: string;
}

export interface LoyaltySettings {
  restaurantId: string;
  flameDisplayEnabled: boolean;
  flameRewardsEnabled: boolean;
  flameExpireDays: number;
  flameLevels: FlameLevel[];
  otherPrograms: OtherLoyaltyProgramStub[];
  updatedAt: string;
}

export type UpdateLoyaltySettingsPayload = Partial<
  Pick<
    LoyaltySettings,
    | 'flameDisplayEnabled'
    | 'flameRewardsEnabled'
    | 'flameExpireDays'
    | 'flameLevels'
  >
>;

export const DEFAULT_LOYALTY_SETTINGS: Omit<LoyaltySettings, 'restaurantId' | 'updatedAt'> = {
  flameDisplayEnabled: false,
  flameRewardsEnabled: false,
  flameExpireDays: 14,
  flameLevels: [],
  otherPrograms: [],
};

export const LOYALTY_REWARD_TYPE_LABELS: Record<LoyaltyRewardType, string> = {
  percent_discount: 'Скидка %',
  fixed_discount: 'Скидка суммой',
  free_menu_item: 'Бесплатная позиция меню',
  custom: 'Свой бонус (текст)',
};

export const FLAME_EXPIRE_DAY_PRESETS = [7, 14, 21, 30] as const;
