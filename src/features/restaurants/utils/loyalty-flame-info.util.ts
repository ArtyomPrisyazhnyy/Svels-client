import type { LoyaltyBalance, LoyaltyStreakStatus } from '../../../shared/types/loyalty-balance.ts';
import {
  type FlameLevel,
  type LoyaltyReward,
  type LoyaltySettings,
} from '../../../shared/types/loyalty-settings.ts';
import { formatShortDateMinsk } from '../../../shared/utils/dateMinsk.ts';

export interface LoyaltyFlameInfoSection {
  title: string;
  body: string;
}

export type LoyaltyFlameTier = 1 | 2 | 3 | 4 | 5;

export type LoyaltyFlameHeaderVisual = 'off' | 'base' | LoyaltyFlameTier;

export interface LoyaltyFlameLevelRow {
  levelId: string;
  label: string;
  perks: string | null;
  isCurrent: boolean;
  tier: LoyaltyFlameTier;
}

export interface LoyaltyFlameInfoModel {
  sections: LoyaltyFlameInfoSection[];
  levelRows: LoyaltyFlameLevelRow[] | null;
  levelsFooter: string | null;
  streakHero: LoyaltyFlameStreakHero | null;
}

export interface LoyaltyFlameStreakHero {
  streakDays: number;
  startedLabel: string | null;
  expiresLabel: string | null;
  recordLabel: string;
  nextLevelLabel: string | null;
  expiring: boolean;
}

function pluralDays(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return `${count} день`;
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} дня`;
  }
  return `${count} дней`;
}

/** После «серия»: «1 день», «2 дня», «5 дней». */
export function pluralStreakDays(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return `${count} день`;
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} дня`;
  }
  return `${count} дней`;
}

export function loyaltyFlameButtonAriaLabel(streakDays: number): string {
  if (streakDays < 1) {
    return 'Огонёк лояльности';
  }
  return `Огонёк, серия ${pluralStreakDays(streakDays)}`;
}

export function resolveLoyaltyStreakStatus(balance: LoyaltyBalance | null): LoyaltyStreakStatus {
  if (balance?.status) {
    return balance.status;
  }
  if (!balance || balance.visits <= 0) {
    return 'none';
  }
  return 'active';
}

export function resolveLoyaltyStreakDays(balance: LoyaltyBalance | null): number {
  if (balance?.streakDays != null) {
    return balance.streakDays;
  }
  const status = resolveLoyaltyStreakStatus(balance);
  if (status === 'none') {
    return 0;
  }
  return balance?.visits ?? 0;
}

export function resolveLoyaltyLongestStreak(balance: LoyaltyBalance | null): number {
  if (balance?.longestStreak != null) {
    return balance.longestStreak;
  }
  return resolveLoyaltyStreakDays(balance);
}

function balanceHasActiveStreak(balance: LoyaltyBalance | null): boolean {
  const status = resolveLoyaltyStreakStatus(balance);
  return status === 'active' || status === 'expiring';
}

/** Именительный: «4 визита подряд». */
export function pluralVisits(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return `${count} визит`;
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} визита`;
  }
  return `${count} визитов`;
}

/** После «от» / «после»: «от 3 визитов», «после 1 визита». */
export function visitsAfterPreposition(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return `${count} визита`;
  }
  return `${count} визитов`;
}

function pluralLevelsTotal(count: number): string {
  if (count === 1) {
    return '1 уровень';
  }
  if (count >= 2 && count <= 4) {
    return `${count} уровня`;
  }
  return `${count} уровней`;
}

export function formatLoyaltyRewardSummary(reward: LoyaltyReward): string {
  const title = reward.title.trim();
  if (title.length > 0) {
    return title;
  }

  switch (reward.type) {
    case 'percent_discount':
      return reward.percentOff != null ? `Скидка ${reward.percentOff}%` : 'Скидка %';
    case 'fixed_discount':
      return reward.amountOff != null ? `Скидка ${reward.amountOff}` : 'Скидка суммой';
    case 'free_menu_item':
      return 'Бесплатная позиция из меню';
    case 'custom':
      return reward.description?.trim() || 'Бонус';
    default:
      return 'Бонус';
  }
}

function sortedLevels(settings: LoyaltySettings): FlameLevel[] {
  return [...settings.flameLevels].sort((a, b) => a.requiredVisits - b.requiredVisits);
}

/**
 * Порядковый номер уровня в настройках (1-based). 0 — уровень ещё не достигнут.
 */
export function resolveGuestFlameLevelOrdinal(
  balance: LoyaltyBalance | null,
  settings: LoyaltySettings,
): number {
  if (!balance?.currentLevel) {
    return 0;
  }
  const levels = sortedLevels(settings);
  const index = levels.findIndex((level) => level.id === balance.currentLevel?.id);
  return index >= 0 ? index + 1 : 0;
}

/** Визуальный tier для стилей --flame-tier-N: 0 до первого уровня, 1..5, 6+ → 5. */
export function resolveLoyaltyFlameTier(levelOrdinal: number): 0 | LoyaltyFlameTier {
  if (levelOrdinal < 1) {
    return 0;
  }
  if (levelOrdinal > 5) {
    return 5;
  }
  return levelOrdinal as LoyaltyFlameTier;
}

export function resolveLoyaltyFlameHeaderVisual(
  balance: LoyaltyBalance | null,
  settings: LoyaltySettings,
  isGuestOfRestaurant: boolean,
): LoyaltyFlameHeaderVisual {
  if (!isGuestOfRestaurant || !balanceHasActiveStreak(balance)) {
    return 'off';
  }
  const tier = resolveLoyaltyFlameTier(resolveGuestFlameLevelOrdinal(balance, settings));
  if (tier === 0) {
    return 'base';
  }
  return tier;
}

function formatLevelPerks(level: FlameLevel, rewardsEnabled: boolean): string | null {
  if (!rewardsEnabled) {
    return null;
  }
  if (level.rewards.length === 0) {
    return 'Без наград';
  }
  return level.rewards.map(formatLoyaltyRewardSummary).join('; ');
}

function buildStreakHero(
  balance: LoyaltyBalance | null,
  isGuestOfRestaurant: boolean,
): LoyaltyFlameStreakHero | null {
  if (!isGuestOfRestaurant || !balance) {
    return null;
  }
  const streakDays = resolveLoyaltyStreakDays(balance);
  const status = resolveLoyaltyStreakStatus(balance);
  if (status === 'none' || streakDays < 1) {
    return null;
  }

  const startedLabel = balance.streakStartedAt
    ? `серия с ${formatShortDateMinsk(balance.streakStartedAt)}`
    : null;
  const expiresLabel = balance.expiresAt
    ? `сгорит ${formatShortDateMinsk(balance.expiresAt)}`
    : null;

  const record = resolveLoyaltyLongestStreak(balance);
  const recordLabel =
    record > streakDays
      ? `Рекорд — ${pluralStreakDays(record)}`
      : record === streakDays && record > 0
        ? `Рекорд — ${pluralStreakDays(record)}`
        : `Рекорд — ${pluralStreakDays(Math.max(record, streakDays))}`;

  let nextLevelLabel: string | null = null;
  if (balance.nextLevel) {
    const left = balance.nextLevel.visitsLeft;
    nextLevelLabel = `До «${balance.nextLevel.name}» — ${visitsAfterPreposition(left)} подряд`;
  }

  return {
    streakDays,
    startedLabel,
    expiresLabel,
    recordLabel,
    nextLevelLabel,
    expiring: status === 'expiring',
  };
}

export function buildLoyaltyFlameInfoModel(
  settings: LoyaltySettings,
  balance: LoyaltyBalance | null,
  isGuestOfRestaurant: boolean,
): LoyaltyFlameInfoModel {
  const levels = sortedLevels(settings);
  const expireDays = settings.flameExpireDays;
  const expirePhrase = pluralDays(expireDays);

  const sections: LoyaltyFlameInfoSection[] = [
    {
      title: 'Что это',
      body:
        'Огонёк — серия ваших визитов в заведение. Визит засчитывается, когда заказ выдан.',
    },
    {
      title: 'Когда загорается',
      body:
        'После первого выданного заказа серия начинается. Каждый следующий выданный заказ, пока огонёк горит, добавляет +1 к серии.',
    },
    {
      title: 'Когда гаснет',
      body: `Огонёк гаснет, если не заходить больше ${expirePhrase}.`,
    },
  ];

  let levelsFooter: string | null = null;
  let levelRows: LoyaltyFlameLevelRow[] | null = null;

  if (levels.length === 0) {
    sections.push({
      title: 'Уровни',
      body: 'Заведение пока не настроило уровни огонька.',
    });
  } else {
    const totalPhrase = pluralLevelsTotal(levels.length);
    const firstThreshold = levels[0]?.requiredVisits ?? 1;
    let currentBody: string;

    if (!isGuestOfRestaurant) {
      currentBody = `Всего ${totalPhrase}. Войдите, чтобы увидеть свой уровень.`;
    } else if (!balance) {
      currentBody = `Всего ${totalPhrase}. Загружаем ваш статус…`;
    } else if (balance.visits === 0 && resolveLoyaltyStreakStatus(balance) === 'none') {
      currentBody = `Всего ${totalPhrase}. Серия сейчас не идёт. Уровень откроется после ${visitsAfterPreposition(firstThreshold)} подряд.`;
    } else if (balance.currentLevel) {
      currentBody = `Всего ${totalPhrase}. Сейчас ${pluralVisits(balance.visits)} подряд, ваш уровень — «${balance.currentLevel.name}».`;
    } else {
      currentBody = `Всего ${totalPhrase}. Сейчас ${pluralVisits(balance.visits)} подряд, базовый уровень ещё не открыт.`;
    }

    sections.push({
      title: 'Ваш уровень',
      body: currentBody,
    });

    if (!settings.flameRewardsEnabled) {
      levelsFooter =
        'Автоматические награды за уровни отключены — огонёк показывает только статус серии.';
    }

    levelRows = levels.map((level, index) => ({
      levelId: level.id,
      label: `«${level.name}» — от ${visitsAfterPreposition(level.requiredVisits)} подряд`,
      perks: formatLevelPerks(level, settings.flameRewardsEnabled),
      isCurrent: balance?.currentLevel?.id === level.id,
      tier: resolveLoyaltyFlameTier(index + 1) as LoyaltyFlameTier,
    }));
  }

  return { sections, levelRows, levelsFooter, streakHero: buildStreakHero(balance, isGuestOfRestaurant) };
}

export function isLoyaltyFlameLit(
  balance: LoyaltyBalance | null,
  isGuestOfRestaurant: boolean,
): boolean {
  return isGuestOfRestaurant && balanceHasActiveStreak(balance);
}
