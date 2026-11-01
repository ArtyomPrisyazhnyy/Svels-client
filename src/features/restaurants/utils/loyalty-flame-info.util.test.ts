import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { LoyaltyBalance } from '../../../shared/types/loyalty-balance.ts';
import type { LoyaltySettings } from '../../../shared/types/loyalty-settings.ts';
import {
  buildLoyaltyFlameInfoModel,
  formatLoyaltyRewardSummary,
  isLoyaltyFlameLit,
  loyaltyFlameButtonAriaLabel,
  pluralStreakDays,
  resolveLoyaltyFlameTier,
  resolveLoyaltyFlameHeaderVisual,
  resolveGuestFlameLevelOrdinal,
  resolveLoyaltyStreakDays,
  resolveLoyaltyStreakStatus,
  visitsAfterPreposition,
} from './loyalty-flame-info.util.ts';

const baseSettings: LoyaltySettings = {
  restaurantId: 'r1',
  flameDisplayEnabled: true,
  flameRewardsEnabled: true,
  flameExpireDays: 14,
  flameLevels: [
    {
      id: 'l1',
      name: 'Искра',
      requiredVisits: 3,
      rewards: [
        {
          id: 'rw1',
          type: 'percent_discount',
          title: 'Скидка 5%',
          description: null,
          percentOff: 5,
          amountOff: null,
          menuItemId: null,
          minOrderAmount: null,
        },
      ],
    },
    {
      id: 'l2',
      name: 'Пламя',
      requiredVisits: 7,
      rewards: [],
    },
  ],
  otherPrograms: [],
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('formatLoyaltyRewardSummary', () => {
  it('prefers explicit title', () => {
    assert.equal(
      formatLoyaltyRewardSummary({
        id: '1',
        type: 'custom',
        title: 'Кофе в подарок',
        description: 'ignored',
        percentOff: null,
        amountOff: null,
        menuItemId: null,
        minOrderAmount: null,
      }),
      'Кофе в подарок',
    );
  });
});

describe('resolveLoyaltyFlameTier', () => {
  it('maps level ordinals including cap at 5', () => {
    assert.equal(resolveLoyaltyFlameTier(0), 0);
    assert.equal(resolveLoyaltyFlameTier(1), 1);
    assert.equal(resolveLoyaltyFlameTier(2), 2);
    assert.equal(resolveLoyaltyFlameTier(3), 3);
    assert.equal(resolveLoyaltyFlameTier(4), 4);
    assert.equal(resolveLoyaltyFlameTier(5), 5);
    assert.equal(resolveLoyaltyFlameTier(7), 5);
  });
});

describe('resolveLoyaltyFlameHeaderVisual', () => {
  it('returns off, base, and level tiers from balance', () => {
    assert.equal(resolveLoyaltyFlameHeaderVisual(null, baseSettings, false), 'off');
    assert.equal(
      resolveLoyaltyFlameHeaderVisual(
        { visits: 0, status: 'none', streakDays: 0 } as LoyaltyBalance,
        baseSettings,
        true,
      ),
      'off',
    );
    assert.equal(
      resolveLoyaltyFlameHeaderVisual({ visits: 2, status: 'active', streakDays: 2 } as LoyaltyBalance, baseSettings, true),
      'base',
    );
    const balance: LoyaltyBalance = {
      restaurantId: 'r1',
      userId: 'u1',
      enabled: true,
      rewardsEnabled: true,
      visits: 4,
      totalVisits: 4,
      lastVisitAt: null,
      expiresAt: null,
      currentLevel: { id: 'l1', name: 'Искра', requiredVisits: 3 },
      nextLevel: null,
      availableRewards: [],
      streakDays: 4,
      status: 'active',
    };
    assert.equal(resolveLoyaltyFlameHeaderVisual(balance, baseSettings, true), 1);
    assert.equal(resolveGuestFlameLevelOrdinal(balance, baseSettings), 1);
  });

  it('prefers streak status when present', () => {
    assert.equal(
      resolveLoyaltyStreakStatus({ status: 'expiring', streakDays: 3 } as LoyaltyBalance),
      'expiring',
    );
    assert.equal(resolveLoyaltyStreakDays({ streakDays: 7 } as LoyaltyBalance), 7);
  });
});

describe('loyaltyFlameButtonAriaLabel', () => {
  it('uses Russian plural for streak days', () => {
    assert.equal(loyaltyFlameButtonAriaLabel(0), 'Огонёк лояльности');
    assert.equal(loyaltyFlameButtonAriaLabel(1), 'Огонёк, серия 1 день');
    assert.equal(loyaltyFlameButtonAriaLabel(3), 'Огонёк, серия 3 дня');
    assert.equal(pluralStreakDays(5), '5 дней');
  });
});

describe('isLoyaltyFlameLit', () => {
  it('is lit only for guest with active series', () => {
    const balance = { visits: 2, status: 'active', streakDays: 2 } as LoyaltyBalance;
    assert.equal(isLoyaltyFlameLit(balance, true), true);
    assert.equal(isLoyaltyFlameLit(balance, false), false);
    assert.equal(
      isLoyaltyFlameLit({ visits: 0, status: 'none', streakDays: 0 } as LoyaltyBalance, true),
      false,
    );
  });
});

describe('visitsAfterPreposition', () => {
  it('uses genitive plural after от/после except 1', () => {
    assert.equal(visitsAfterPreposition(1), '1 визита');
    assert.equal(visitsAfterPreposition(3), '3 визитов');
    assert.equal(visitsAfterPreposition(7), '7 визитов');
    assert.equal(visitsAfterPreposition(21), '21 визита');
  });
});

describe('buildLoyaltyFlameInfoModel', () => {
  it('mentions expire window from settings', () => {
    const model = buildLoyaltyFlameInfoModel(baseSettings, null, false);
    const expire = model.sections.find((s) => s.title === 'Когда гаснет');
    assert.ok(expire?.body.includes('14 дней'));
    assert.ok(expire?.body.includes('не заходить'));
  });

  it('uses visitsAfterPreposition in level labels', () => {
    const model = buildLoyaltyFlameInfoModel(baseSettings, null, true);
    assert.equal(model.levelRows?.[0]?.label, '«Искра» — от 3 визитов подряд');
  });

  it('lists levels with perks when rewards enabled', () => {
    const balance: LoyaltyBalance = {
      restaurantId: 'r1',
      userId: 'u1',
      enabled: true,
      rewardsEnabled: true,
      visits: 4,
      totalVisits: 4,
      lastVisitAt: null,
      expiresAt: '2026-11-15T12:00:00.000Z',
      streakStartedAt: '2026-10-01T08:00:00.000Z',
      streakDays: 4,
      longestStreak: 9,
      status: 'active',
      currentLevel: { id: 'l1', name: 'Искра', requiredVisits: 3 },
      nextLevel: {
        id: 'l2',
        name: 'Пламя',
        requiredVisits: 7,
        visitsLeft: 3,
      },
      availableRewards: [],
    };
    const model = buildLoyaltyFlameInfoModel(baseSettings, balance, true);
    assert.equal(model.levelRows?.length, 2);
    assert.equal(model.levelRows?.[0]?.isCurrent, true);
    assert.equal(model.levelRows?.[1]?.perks, 'Без наград');
    assert.ok(model.streakHero);
    assert.equal(model.streakHero?.streakDays, 4);
    assert.ok(model.streakHero?.startedLabel?.includes('серия с'));
    assert.ok(model.streakHero?.expiresLabel?.includes('сгорит'));
  });
});
