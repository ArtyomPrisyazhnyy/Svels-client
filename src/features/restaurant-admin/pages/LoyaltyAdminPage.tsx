'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { v7 as uuidv7 } from 'uuid';
import { ApiError } from '../../../shared/api/api-client';
import {
  FLAME_EXPIRE_DAY_PRESETS,
  LOYALTY_REWARD_TYPE_LABELS,
  type FlameLevel,
  type LoyaltyReward,
  type LoyaltyRewardType,
  type LoyaltySettings,
} from '../../../shared/types/loyalty-settings';
import type { MenuItem, MenuResponse } from '../../../shared/types/menu';
import { useAuthStore } from '../../../store/auth.store';
import { revalidateRestaurantPublicPage } from '@/features/restaurants/actions/revalidate-restaurant-public-page.action';
import { fetchMenu } from '../api/menu.api';
import {
  fetchLoyaltySettings,
  updateLoyaltySettings,
} from '../api/loyalty-settings.api';
import '../styles/loyalty-admin.scss';

function createEmptyReward(): LoyaltyReward {
  return {
    id: uuidv7(),
    type: 'percent_discount',
    title: '',
    description: null,
    percentOff: 10,
    amountOff: null,
    menuItemId: null,
    minOrderAmount: null,
  };
}

function createEmptyLevel(index: number, previousVisits: number): FlameLevel {
  return {
    id: uuidv7(),
    name: `Уровень ${index}`,
    requiredVisits: Math.max(1, previousVisits + (index === 1 ? 1 : 2)),
    rewards: [],
  };
}

function flattenMenuItems(menu: MenuResponse): MenuItem[] {
  return menu.categories.flatMap((category) => category.items);
}

/** Пустая строка в number-полях — чтобы можно было стереть цифру при вводе. */
type EditableFlameLevel = Omit<FlameLevel, 'requiredVisits'> & {
  requiredVisits: number | '';
};

type EditableLoyaltySettings = Omit<LoyaltySettings, 'flameLevels' | 'flameExpireDays'> & {
  flameExpireDays: number | '';
  flameLevels: EditableFlameLevel[];
};

function toEditableDraft(settings: LoyaltySettings): EditableLoyaltySettings {
  return {
    ...settings,
    flameExpireDays: settings.flameExpireDays,
    flameLevels: settings.flameLevels.map((level) => ({ ...level })),
  };
}

function parsePositiveInt(value: string): number | '' {
  if (value.trim() === '') {
    return '';
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : '';
}

export default function LoyaltyAdminPage() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const restaurantId = user?.restaurantId;

  const [settings, setSettings] = useState<LoyaltySettings | null>(null);
  const [draft, setDraft] = useState<EditableLoyaltySettings | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [expireCustom, setExpireCustom] = useState(false);

  const load = useCallback(async () => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [loyalty, menu] = await Promise.all([
        fetchLoyaltySettings(restaurantId),
        fetchMenu(restaurantId).catch((): MenuResponse => ({ categories: [] })),
      ]);
      setSettings(loyalty);
      setDraft(toEditableDraft(loyalty));
      setMenuItems(flattenMenuItems(menu));
      setExpireCustom(
        !(FLAME_EXPIRE_DAY_PRESETS as readonly number[]).includes(loyalty.flameExpireDays),
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось загрузить настройки');
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    void load();
  }, [load]);

  const hasChanges = useMemo(() => {
    if (!settings || !draft) {
      return false;
    }
    return JSON.stringify(toEditableDraft(settings)) !== JSON.stringify(draft);
  }, [settings, draft]);

  function patchDraft(patch: Partial<EditableLoyaltySettings>) {
    setSuccess(null);
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  function updateLevel(levelId: string, patch: Partial<EditableFlameLevel>) {
    if (!draft) return;
    patchDraft({
      flameLevels: draft.flameLevels.map((level) =>
        level.id === levelId ? { ...level, ...patch } : level,
      ),
    });
  }

  function updateReward(levelId: string, rewardId: string, patch: Partial<LoyaltyReward>) {
    if (!draft) return;
    patchDraft({
      flameLevels: draft.flameLevels.map((level) => {
        if (level.id !== levelId) return level;
        return {
          ...level,
          rewards: level.rewards.map((reward) =>
            reward.id === rewardId ? { ...reward, ...patch } : reward,
          ),
        };
      }),
    });
  }

  function addLevel() {
    if (!draft) return;
    const nextIndex = draft.flameLevels.length + 1;
    const lastVisitsRaw = draft.flameLevels.at(-1)?.requiredVisits ?? 0;
    const lastVisits = typeof lastVisitsRaw === 'number' ? lastVisitsRaw : 0;
    patchDraft({
      flameLevels: [...draft.flameLevels, createEmptyLevel(nextIndex, lastVisits)],
    });
  }

  function removeLevel(levelId: string) {
    if (!draft) return;
    patchDraft({
      flameLevels: draft.flameLevels.filter((level) => level.id !== levelId),
    });
  }

  function addReward(levelId: string) {
    if (!draft) return;
    patchDraft({
      flameLevels: draft.flameLevels.map((level) =>
        level.id === levelId
          ? { ...level, rewards: [...level.rewards, createEmptyReward()] }
          : level,
      ),
    });
  }

  function removeReward(levelId: string, rewardId: string) {
    if (!draft) return;
    patchDraft({
      flameLevels: draft.flameLevels.map((level) =>
        level.id === levelId
          ? { ...level, rewards: level.rewards.filter((reward) => reward.id !== rewardId) }
          : level,
      ),
    });
  }

  function handleRewardTypeChange(levelId: string, rewardId: string, type: LoyaltyRewardType) {
    updateReward(levelId, rewardId, {
      type,
      percentOff: type === 'percent_discount' ? 10 : null,
      amountOff: type === 'fixed_discount' ? 3 : null,
      menuItemId: type === 'free_menu_item' ? menuItems[0]?.id ?? null : null,
    });
  }

  async function handleSave() {
    if (!restaurantId || !accessToken || !draft) return;

    if (draft.flameExpireDays === '' || draft.flameExpireDays < 1) {
      setError('Укажите число дней, через которое гаснет огонёк');
      return;
    }

    for (const level of draft.flameLevels) {
      if (level.requiredVisits === '' || level.requiredVisits < 1) {
        setError(`Укажите число визитов для «${level.name || 'уровня'}»`);
        return;
      }
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updated = await updateLoyaltySettings(restaurantId, accessToken, {
        flameDisplayEnabled: draft.flameDisplayEnabled,
        flameRewardsEnabled: draft.flameDisplayEnabled ? draft.flameRewardsEnabled : false,
        flameExpireDays: draft.flameExpireDays,
        flameLevels: draft.flameLevels.map((level) => ({
          ...level,
          requiredVisits: level.requiredVisits as number,
        })),
      });
      setSettings(updated);
      setDraft(toEditableDraft(updated));
      setSuccess('Настройки сохранены');
      await revalidateRestaurantPublicPage(restaurantId);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось сохранить настройки');
    } finally {
      setSaving(false);
    }
  }

  if (!restaurantId) {
    return (
      <p className="loyalty-admin__notice">
        Заявка ещё на модерации или ресторан не привязан к аккаунту.
      </p>
    );
  }

  if (loading || !draft) {
    return <p className="loyalty-admin__empty">Загрузка…</p>;
  }

  return (
    <div className="loyalty-admin">
      <header className="loyalty-admin__header">
        <div>
          <h2>Программа лояльности</h2>
          <p className="loyalty-admin__intro">
            Огонёк показывает гостю серию визитов. Позже сюда же можно будет добавить программы без
            огонька.
          </p>
        </div>
        <button
          type="button"
          className="loyalty-admin__save"
          disabled={saving || !hasChanges}
          onClick={() => void handleSave()}
        >
          {saving ? 'Сохранение…' : 'Сохранить'}
        </button>
      </header>

      {error && <p className="loyalty-admin__error">{error}</p>}
      {success && <p className="loyalty-admin__success">{success}</p>}

      <section className="loyalty-admin__panel">
        <h3>Огонёк на сайте</h3>
        <label className="loyalty-admin__toggle">
          <input
            type="checkbox"
            checked={draft.flameDisplayEnabled}
            onChange={(e) => {
              const enabled = e.target.checked;
              patchDraft({
                flameDisplayEnabled: enabled,
                flameRewardsEnabled: enabled ? draft.flameRewardsEnabled : false,
              });
            }}
          />
          Отображать огонёк гостям на странице заведения
        </label>
      </section>

      {draft.flameDisplayEnabled && (
        <>
          <section className="loyalty-admin__panel">
            <h3>Программы на огоньке</h3>
            <label className="loyalty-admin__toggle">
              <input
                type="checkbox"
                checked={draft.flameRewardsEnabled}
                onChange={(e) => patchDraft({ flameRewardsEnabled: e.target.checked })}
              />
              Давать бонусы при достижении уровней огонька
            </label>
            <p className="loyalty-admin__hint">
              Если выключить — огонёк останется как статус лояльности без автоматических наград.
            </p>
          </section>

          <section className="loyalty-admin__panel">
            <h3>Когда огонёк гаснет</h3>
            <p className="loyalty-admin__hint">
              Если гость столько дней подряд не сделал заказ, серия сбрасывается.
            </p>
            <div className="loyalty-admin__chips">
              {FLAME_EXPIRE_DAY_PRESETS.map((days) => (
                <button
                  key={days}
                  type="button"
                  className={`loyalty-admin__chip${
                    !expireCustom && draft.flameExpireDays === days
                      ? ' loyalty-admin__chip--active'
                      : ''
                  }`}
                  onClick={() => {
                    setExpireCustom(false);
                    patchDraft({ flameExpireDays: days });
                  }}
                >
                  {days} дн.
                </button>
              ))}
              <button
                type="button"
                className={`loyalty-admin__chip${expireCustom ? ' loyalty-admin__chip--active' : ''}`}
                onClick={() => setExpireCustom(true)}
              >
                Свой
              </button>
            </div>
            {expireCustom && (
              <label className="loyalty-admin__field">
                Дней без заказа
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={draft.flameExpireDays}
                  onChange={(e) =>
                    patchDraft({
                      flameExpireDays: parsePositiveInt(e.target.value),
                    })
                  }
                />
              </label>
            )}
          </section>

          <section className="loyalty-admin__panel">
            <div className="loyalty-admin__panel-head">
              <div>
                <h3>Уровни огонька</h3>
                <p className="loyalty-admin__hint">
                  Уровень открывается после N подтверждённых визитов (заказов) подряд, пока огонёк
                  горит.
                </p>
              </div>
              <button type="button" className="loyalty-admin__secondary" onClick={addLevel}>
                + Уровень
              </button>
            </div>

            {draft.flameLevels.length === 0 ? (
              <p className="loyalty-admin__empty">Пока нет уровней — добавьте первый.</p>
            ) : (
              <div className="loyalty-admin__levels">
                {draft.flameLevels.map((level, index) => (
                  <article key={level.id} className="loyalty-admin__level">
                    <div className="loyalty-admin__level-head">
                      <strong>Уровень {index + 1}</strong>
                      <button
                        type="button"
                        className="loyalty-admin__danger"
                        onClick={() => removeLevel(level.id)}
                      >
                        Удалить
                      </button>
                    </div>

                    <div className="loyalty-admin__row">
                      <label className="loyalty-admin__field">
                        Название
                        <input
                          type="text"
                          maxLength={80}
                          value={level.name}
                          onChange={(e) => updateLevel(level.id, { name: e.target.value })}
                        />
                      </label>
                      <label className="loyalty-admin__field">
                        Визитов для уровня
                        <input
                          type="number"
                          min={1}
                          value={level.requiredVisits}
                          onChange={(e) =>
                            updateLevel(level.id, {
                              requiredVisits: parsePositiveInt(e.target.value),
                            })
                          }
                        />
                      </label>
                    </div>

                    {draft.flameRewardsEnabled && (
                      <div className="loyalty-admin__rewards">
                        <div className="loyalty-admin__panel-head">
                          <h4>Награды уровня</h4>
                          <button
                            type="button"
                            className="loyalty-admin__secondary"
                            onClick={() => addReward(level.id)}
                          >
                            + Награда
                          </button>
                        </div>

                        {level.rewards.length === 0 ? (
                          <p className="loyalty-admin__hint">Наград пока нет.</p>
                        ) : (
                          level.rewards.map((reward) => (
                            <div key={reward.id} className="loyalty-admin__reward">
                              <div className="loyalty-admin__row">
                                <label className="loyalty-admin__field">
                                  Тип
                                  <select
                                    value={reward.type}
                                    onChange={(e) =>
                                      handleRewardTypeChange(
                                        level.id,
                                        reward.id,
                                        e.target.value as LoyaltyRewardType,
                                      )
                                    }
                                  >
                                    {(
                                      Object.keys(LOYALTY_REWARD_TYPE_LABELS) as LoyaltyRewardType[]
                                    ).map((type) => (
                                      <option key={type} value={type}>
                                        {LOYALTY_REWARD_TYPE_LABELS[type]}
                                      </option>
                                    ))}
                                  </select>
                                </label>
                                <label className="loyalty-admin__field">
                                  Название для гостя
                                  <input
                                    type="text"
                                    maxLength={120}
                                    placeholder="Например: −10% на заказ"
                                    value={reward.title}
                                    onChange={(e) =>
                                      updateReward(level.id, reward.id, {
                                        title: e.target.value,
                                      })
                                    }
                                  />
                                </label>
                              </div>

                              {reward.type === 'percent_discount' && (
                                <label className="loyalty-admin__field">
                                  Процент скидки
                                  <input
                                    type="number"
                                    min={1}
                                    max={100}
                                    value={reward.percentOff ?? ''}
                                    onChange={(e) =>
                                      updateReward(level.id, reward.id, {
                                        percentOff: Number(e.target.value) || null,
                                      })
                                    }
                                  />
                                </label>
                              )}

                              {reward.type === 'fixed_discount' && (
                                <label className="loyalty-admin__field">
                                  Сумма скидки (BYN)
                                  <input
                                    type="number"
                                    min={0.01}
                                    step={0.01}
                                    value={reward.amountOff ?? ''}
                                    onChange={(e) =>
                                      updateReward(level.id, reward.id, {
                                        amountOff: Number(e.target.value) || null,
                                      })
                                    }
                                  />
                                </label>
                              )}

                              {reward.type === 'free_menu_item' && (
                                <label className="loyalty-admin__field">
                                  Позиция меню
                                  <select
                                    value={reward.menuItemId ?? ''}
                                    onChange={(e) =>
                                      updateReward(level.id, reward.id, {
                                        menuItemId: e.target.value || null,
                                      })
                                    }
                                  >
                                    <option value="">Выберите…</option>
                                    {menuItems.map((item) => (
                                      <option key={item.id} value={item.id}>
                                        {item.name}
                                      </option>
                                    ))}
                                  </select>
                                </label>
                              )}

                              {reward.type === 'custom' && (
                                <label className="loyalty-admin__field">
                                  Описание бонуса
                                  <textarea
                                    rows={2}
                                    maxLength={500}
                                    value={reward.description ?? ''}
                                    onChange={(e) =>
                                      updateReward(level.id, reward.id, {
                                        description: e.target.value || null,
                                      })
                                    }
                                  />
                                </label>
                              )}

                              <label className="loyalty-admin__field">
                                Мин. сумма заказа (необязательно)
                                <input
                                  type="number"
                                  min={0}
                                  step={0.01}
                                  value={reward.minOrderAmount ?? ''}
                                  onChange={(e) =>
                                    updateReward(level.id, reward.id, {
                                      minOrderAmount: e.target.value
                                        ? Number(e.target.value)
                                        : null,
                                    })
                                  }
                                />
                              </label>

                              <button
                                type="button"
                                className="loyalty-admin__danger"
                                onClick={() => removeReward(level.id, reward.id)}
                              >
                                Удалить награду
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      <section className="loyalty-admin__panel loyalty-admin__panel--muted">
        <h3>Другие программы</h3>
        <p className="loyalty-admin__hint">
          Скоро здесь можно будет собирать программы лояльности без огонька (штампы, кэшбэк и т.п.).
        </p>
      </section>
    </div>
  );
}
