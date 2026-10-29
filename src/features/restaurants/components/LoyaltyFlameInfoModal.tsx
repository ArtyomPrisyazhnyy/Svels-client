'use client';

import { Stack } from '@/shared/ui';
import { Modal } from '@/shared/ui/Modal/Modal';
import type { LoyaltyBalance } from '@/shared/types/loyalty-balance';
import type { LoyaltySettings } from '@/shared/types/loyalty-settings';
import { RestaurantStylingPortalRoot } from '../context/RestaurantStylingContext';
import { buildLoyaltyFlameInfoModel } from '../utils/loyalty-flame-info.util';
import '../styles/loyalty-flame-info-modal.scss';

interface LoyaltyFlameInfoModalProps {
  open: boolean;
  onClose: () => void;
  loyaltySettings: LoyaltySettings;
  balance: LoyaltyBalance | null;
  balanceLoading: boolean;
  balanceError: string | null;
  isGuestOfRestaurant: boolean;
}

export function LoyaltyFlameInfoModal({
  open,
  onClose,
  loyaltySettings,
  balance,
  balanceLoading,
  balanceError,
  isGuestOfRestaurant,
}: LoyaltyFlameInfoModalProps) {
  const model = buildLoyaltyFlameInfoModel(loyaltySettings, balance, isGuestOfRestaurant);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Огонёк лояльности"
      titleId="loyalty-flame-info-title"
      titleTestId="loyalty-flame-info-title"
      rootTestId="loyalty-flame-info-modal"
      testId="loyalty-flame-info-panel"
      closeTestId="loyalty-flame-info-close"
      panelClassName="loyalty-flame-info-modal__panel"
      size="sm"
      wrap={(node) => <RestaurantStylingPortalRoot>{node}</RestaurantStylingPortalRoot>}
    >
      <Stack gap={4} className="loyalty-flame-info-modal">
        {model.sections.map((section) => (
          <section key={section.title} className="loyalty-flame-info-modal__section">
            <h3 className="loyalty-flame-info-modal__section-title">{section.title}</h3>
            <p className="loyalty-flame-info-modal__section-body">{section.body}</p>
          </section>
        ))}

        {balanceLoading ? (
          <p className="loyalty-flame-info-modal__meta" data-testid="loyalty-flame-info-loading">
            Обновляем ваш статус…
          </p>
        ) : null}

        {balanceError ? (
          <p className="loyalty-flame-info-modal__error" data-testid="loyalty-flame-info-error">
            {balanceError}
          </p>
        ) : null}

        {model.levelRows ? (
          <section className="loyalty-flame-info-modal__section">
            <h3 className="loyalty-flame-info-modal__section-title">Уровни и награды</h3>
            <ul className="loyalty-flame-info-modal__levels" data-testid="loyalty-flame-levels">
              {model.levelRows.map((row) => (
                <li
                  key={row.levelId}
                  className={
                    row.isCurrent
                      ? 'loyalty-flame-info-modal__level loyalty-flame-info-modal__level--current'
                      : 'loyalty-flame-info-modal__level'
                  }
                  data-testid={`loyalty-flame-level-${row.levelId}`}
                >
                  {row.isCurrent ? (
                    <span className="loyalty-flame-info-modal__level-badge">Ваш уровень</span>
                  ) : null}
                  <span className="loyalty-flame-info-modal__level-label">{row.label}</span>
                  {row.perks ? (
                    <span className="loyalty-flame-info-modal__level-perks">{row.perks}</span>
                  ) : null}
                </li>
              ))}
            </ul>
            {model.levelsFooter ? (
              <p className="loyalty-flame-info-modal__meta">{model.levelsFooter}</p>
            ) : null}
          </section>
        ) : null}
      </Stack>
    </Modal>
  );
}
