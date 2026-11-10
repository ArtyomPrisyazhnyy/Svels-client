'use client';

import { useEffect, useState } from 'react';
import { RESTAURANT_FONT_CLASSES } from '@/features/restaurants/fonts/restaurant-fonts';
import type { FulfillmentKey } from '@/shared/types/order-settings';
import type { RestaurantStyling, UpdateRestaurantStylingPayload } from '@/shared/types/restaurant-styling';
import { Button, PageTitle, Sheet } from '@/shared/ui';
import { StylingControls } from './StylingControls';
import { StylingPreviewPair, StylingPreviewStage } from './StylingPreview';
import type { StylingLayoutId } from './styling-model';
import '../styles/styling-admin.scss';

export interface StylingStatus {
  tone: 'error' | 'success';
  message: string;
}

interface StylingWorkspaceProps {
  layout: StylingLayoutId;
  value: RestaurantStyling;
  onChange: (patch: UpdateRestaurantStylingPayload) => void;
  onSave?: () => void;
  saving?: boolean;
  saveDisabled?: boolean;
  status?: StylingStatus | null;
  title?: string;
  subtitle?: string;
  testId?: string;
}

export function StylingWorkspace({
  layout,
  value,
  onChange,
  onSave,
  saving = false,
  saveDisabled = false,
  status = null,
  title = 'Стилизация',
  subtitle = 'Шрифт, карточка, цвета и тема. Превью сайта и приложения обновляется сразу.',
  testId = 'styling-admin',
}: StylingWorkspaceProps) {
  const [fulfillment, setFulfillment] = useState<FulfillmentKey>('fulfillmentTakeaway');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [desktopPreview, setDesktopPreview] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const update = () => setDesktopPreview(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const previewProps = {
    styling: value,
    fulfillment,
    onFulfillmentChange: setFulfillment,
  };

  const saveButton = onSave ? (
    <Button
      className="styling-save-desktop"
      disabled={saveDisabled}
      loading={saving}
      onClick={onSave}
      testId="styling-save"
    >
      Сохранить
    </Button>
  ) : null;

  return (
    <div
      className={`styling-workspace styling-workspace--${layout} ${RESTAURANT_FONT_CLASSES}`}
      data-testid={testId}
    >
      <PageTitle level={2} title={title} subtitle={subtitle} actions={saveButton} testId="styling-page-title" />

      {status ? (
        <p className={`styling-status styling-status--${status.tone}`} role={status.tone === 'error' ? 'alert' : 'status'}>
          {status.message}
        </p>
      ) : null}

      <div className="styling-workspace__body">
        {layout !== 'studio' ? <StylingPreviewPair {...previewProps} /> : null}
        <div className="styling-workspace__controls">
          <StylingControls value={value} onChange={onChange} />
        </div>
        {layout === 'studio' && desktopPreview ? (
          <div className="styling-workspace__preview">
            <StylingPreviewStage {...previewProps} />
          </div>
        ) : null}
      </div>

      {layout === 'studio' && onSave ? (
        <div className="styling-mobile-bar">
          <Button variant="secondary" onClick={() => setPreviewOpen(true)} testId="styling-preview-open">
            Предпросмотр
          </Button>
          <Button disabled={saveDisabled} loading={saving} onClick={onSave} testId="styling-save-mobile">
            Сохранить
          </Button>
        </div>
      ) : null}

      {layout === 'studio' && !desktopPreview ? (
        <Sheet
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          title="Предпросмотр"
          size="lg"
          showClose={false}
          presentation="bottom"
          testId="styling-preview-sheet"
        >
          <StylingPreviewStage {...previewProps} />
        </Sheet>
      ) : null}
    </div>
  );
}
