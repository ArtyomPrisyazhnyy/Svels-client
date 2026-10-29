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

function pluralVisits(count: number): string {
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

  const sections: LoyaltyFlameInfoSection[] = [
    {
      title: 'Что это',
      body:
        'Огонёк показывает вашу серию визитов в это заведение. Визит засчитывается, когда предзаказ переходит в статус «завершён».',
    },
    {
      title: 'Когда загорается',
      body:
        'После первого завершённого заказа серия начинается с 1 визита. Каждый следующий завершённый заказ, пока серия активна, добавляет +1 к счётчику подряд.',
    },
    {
      title: 'Когда гаснет',
      body: `Если с последнего визита прошло больше ${pluralDays(expireDays)}, серия сбрасывается — в интерфейсе это 0 визитов подряд. Ровно на ${pluralDays(expireDays)} после визита серия ещё действует.`,
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
    const total = levels.length;
    let currentBody: string;

    if (!isGuestOfRestaurant) {
      currentBody = `Всего ${total} ${total === 1 ? 'уровень' : total < 5 ? 'уровня' : 'уровней'}. Войдите в личный кабинет, чтобы увидеть свой уровень.`;
    } else if (!balance) {
      currentBody = `Всего ${total} ${total === 1 ? 'уровень' : total < 5 ? 'уровня' : 'уровней'}. Загружаем ваш статус…`;
    } else if (balance.visits === 0) {
      currentBody = `Всего ${total} ${total === 1 ? 'уровень' : total < 5 ? 'уровня' : 'уровней'}. Сейчас серия не идёт (0 визитов подряд). Уровень откроется после ${pluralVisits(levels[0]?.requiredVisits ?? 1)} подряд, пока огонёк активен.`;
    } else if (balance.currentLevel) {
      currentBody = `Всего ${total} ${total === 1 ? 'уровень' : total < 5 ? 'уровня' : 'уровней'}. Ваш уровень: «${balance.currentLevel.name}» (${pluralVisits(balance.visits)} подряд).`;
    } else {
      currentBody = `Всего ${total} ${total === 1 ? 'уровень' : total < 5 ? 'уровня' : 'уровней'}. Сейчас ${pluralVisits(balance.visits)} подряд, базовый уровень ещё не достигнут.`;
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
      label: `«${level.name}» — от ${pluralVisits(level.requiredVisits)} подряд`,
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
