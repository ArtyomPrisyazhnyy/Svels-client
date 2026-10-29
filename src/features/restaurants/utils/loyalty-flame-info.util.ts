import type { LoyaltyBalance } from '../../../shared/types/loyalty-balance.ts';
import {
  type FlameLevel,
  type LoyaltyReward,
  type LoyaltySettings,
} from '../../../shared/types/loyalty-settings.ts';

export interface LoyaltyFlameInfoSection {
  title: string;
  body: string;
}

export interface LoyaltyFlameLevelRow {
  levelId: string;
  label: string;
  perks: string | null;
  isCurrent: boolean;
}

export interface LoyaltyFlameInfoModel {
  sections: LoyaltyFlameInfoSection[];
  levelRows: LoyaltyFlameLevelRow[] | null;
  levelsFooter: string | null;
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

function formatLevelPerks(level: FlameLevel, rewardsEnabled: boolean): string | null {
  if (!rewardsEnabled) {
    return null;
  }
  if (level.rewards.length === 0) {
    return 'Без наград';
  }
  return level.rewards.map(formatLoyaltyRewardSummary).join('; ');
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
    } else if (balance.visits === 0) {
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

    levelRows = levels.map((level) => ({
      levelId: level.id,
      label: `«${level.name}» — от ${visitsAfterPreposition(level.requiredVisits)} подряд`,
      perks: formatLevelPerks(level, settings.flameRewardsEnabled),
      isCurrent: balance?.currentLevel?.id === level.id,
    }));
  }

  return { sections, levelRows, levelsFooter };
}

export function isLoyaltyFlameLit(
  balance: LoyaltyBalance | null,
  isGuestOfRestaurant: boolean,
): boolean {
  return isGuestOfRestaurant && (balance?.visits ?? 0) > 0;
}
