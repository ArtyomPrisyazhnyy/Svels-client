'use client';

import { useMemo, useState } from 'react';
import {
  createDefaultRestaurantStyling,
  type RestaurantColorTheme,
  type UpdateRestaurantStylingPayload,
} from '@/shared/types/restaurant-styling';
import { PageTitle, SegmentedControl } from '@/shared/ui';
import { StylingWorkspace, type StylingStatus } from './StylingWorkspace';
import {
  STYLING_LAYOUTS,
  normalizeStyling,
  stylingEquals,
  type StylingLayoutId,
} from './styling-model';
import '../styles/styling-admin.scss';

interface AdminStylingVariantsProps {
  initialLayout: StylingLayoutId;
  initialTheme: RestaurantColorTheme;
}

export function AdminStylingVariants({ initialLayout, initialTheme }: AdminStylingVariantsProps) {
  const initial = useMemo(
    () => normalizeStyling({ ...createDefaultRestaurantStyling('playground'), colorTheme: initialTheme }),
    [initialTheme],
  );
  const [layout, setLayout] = useState(initialLayout);
  const [saved, setSaved] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [status, setStatus] = useState<StylingStatus | null>(null);

  function updateDraft(patch: UpdateRestaurantStylingPayload) {
    setStatus(null);
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  function handleSave() {
    setSaved(draft);
    setStatus({ tone: 'success', message: 'Черновик сохранён локально' });
  }

  return (
    <div className="styling-variants" data-testid="styling-variants">
      <PageTitle
        title="Варианты стилизации"
        subtitle="Три компоновки одной настройки. На заведении включена «Студия». Превью обновляется сразу."
        testId="styling-variants-title"
      />
      <SegmentedControl
        options={STYLING_LAYOUTS.map((option) => ({
          value: option.value,
          label: option.label,
          testId: `styling-layout-${option.value}`,
        }))}
        value={layout}
        onChange={setLayout}
        ariaLabel="Вариант компоновки"
        size="md"
        fullWidth
        testId="styling-layout-switch"
      />
      <StylingWorkspace
        layout={layout}
        value={draft}
        onChange={updateDraft}
        onSave={handleSave}
        saveDisabled={stylingEquals(saved, draft)}
        status={status}
        testId="styling-variant-stage"
      />
    </div>
  );
}
