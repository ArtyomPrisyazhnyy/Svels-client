'use client';

import { useState } from 'react';
import {
  Button,
  Checkbox,
  Cluster,
  Field,
  Input,
  Modal,
  ModalPreview,
  PageTitle,
  SegmentedControl,
  Select,
  Sheet,
  SheetPreview,
  Skeleton,
  SkeletonList,
  Stack,
  Textarea,
} from '@/shared/ui';
import { IconButton } from '@/shared/ui/IconButton/IconButton';
import './ui-primitives-board.scss';

const SEGMENTED_LONG = [
  { value: 'asap', label: 'Как можно скорее' },
  { value: 'scheduled', label: 'Ко времени' },
] as const;

const SEGMENTED_THREE = [
  { value: 'a', label: 'Самовывоз' },
  { value: 'b', label: 'Доставка' },
  { value: 'c', label: 'В зале' },
] as const;

function ModalRerenderEscapeDemo() {
  const [open, setOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [tick, setTick] = useState(0);

  return (
    <>
      <Button testId="ui-rerender-modal-open" variant="secondary" onClick={() => setOpen(true)}>
        Rerender + sheet stack
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Rerender test" testId="ui-rerender-modal">
        <Stack gap={3}>
          <p data-testid="ui-rerender-tick">tick={tick}</p>
          <Button testId="ui-rerender-sheet-open" onClick={() => setSheetOpen(true)}>
            Открыть sheet
          </Button>
          <Button testId="ui-rerender-bump" variant="ghost" onClick={() => setTick((value) => value + 1)}>
            Bump parent
          </Button>
          <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Sheet inside modal" testId="ui-rerender-sheet">
            <p>Вложенный sheet</p>
          </Sheet>
        </Stack>
      </Modal>
    </>
  );
}

export function UiPrimitivesBoard() {
  const [segSm, setSegSm] = useState('asap');
  const [segMd, setSegMd] = useState('asap');
  const [segThree, setSegThree] = useState('a');
  const [segPill, setSegPill] = useState('asap');
  const [segSegmented, setSegSegmented] = useState('asap');
  const [segTabs, setSegTabs] = useState('asap');
  const [modalOpen, setModalOpen] = useState(false);
  const [nestedModalOpen, setNestedModalOpen] = useState(false);
  const [nestedSheetOpen, setNestedSheetOpen] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  return (
    <div className="ui-primitives-board" data-testid="ui-primitives-board">
      <PageTitle title="UI primitives" subtitle="Shared components for guest UI" />

      <section className="ui-primitives-board__section" data-testid="ui-board-modal">
        <h2 className="ui-primitives-board__section-title">Modal</h2>
        <ModalPreview title="Заголовок модалки" footer={<Button fullWidth>Готово</Button>}>
          <p>Тело модального окна с прокруткой и отступами от краёв.</p>
        </ModalPreview>
        <ModalPreview
          title="Корзина"
          headerEnd={
            <Button variant="ghost" size="sm" type="button">
              Очистить
            </Button>
          }
          testId="ui-modal-header-preview"
        >
          <p>Заголовок с действием справа.</p>
        </ModalPreview>
        <div className="ui-primitives-board__actions">
          <Button testId="ui-open-modal" onClick={() => setModalOpen(true)}>
            Открыть модалку
          </Button>
          <Button variant="secondary" onClick={() => setNestedModalOpen(true)}>
            Вложенная модалка + sheet
          </Button>
          <ModalRerenderEscapeDemo />
        </div>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Живая модалка" testId="ui-live-modal">
          <p data-testid="ui-live-modal-body">Клик по фону, Escape или × закрывают окно.</p>
        </Modal>
        <Modal
          open={nestedModalOpen}
          onClose={() => setNestedModalOpen(false)}
          title="Внешняя модалка"
          testId="ui-nested-modal"
        >
          <Stack gap={3}>
            <p>Escape закрывает только верхний слой.</p>
            <Button onClick={() => setNestedSheetOpen(true)}>Открыть sheet</Button>
          </Stack>
        </Modal>
        <Sheet open={nestedSheetOpen} onClose={() => setNestedSheetOpen(false)} title="Вложенный sheet" testId="ui-nested-sheet">
          <p>Верхний оверлей</p>
        </Sheet>
      </section>

      <section className="ui-primitives-board__section" data-testid="ui-board-sheet">
        <h2 className="ui-primitives-board__section-title">Sheet</h2>
        <SheetPreview title="Нижний лист" footer={<Button fullWidth variant="primary">Выбрать</Button>}>
          <p>Список адресов или вариантов выбора.</p>
        </SheetPreview>
      </section>

      <section className="ui-primitives-board__section" data-testid="ui-board-segmented">
        <h2 className="ui-primitives-board__section-title">Segmented control</h2>
        <Stack gap={4}>
          <SegmentedControl
            options={[...SEGMENTED_LONG]}
            value={segSm}
            onChange={setSegSm}
            ariaLabel="Размер sm"
            size="sm"
            fullWidth
            testId="ui-seg-sm"
          />
          <SegmentedControl
            options={[...SEGMENTED_LONG]}
            value={segMd}
            onChange={setSegMd}
            ariaLabel="Размер md"
            size="md"
            fullWidth
            testId="ui-seg-md"
          />
          <SegmentedControl
            options={[...SEGMENTED_THREE]}
            value={segThree}
            onChange={setSegThree}
            ariaLabel="Три опции"
            size="md"
            fullWidth
            testId="ui-seg-three"
          />
          {(['pill', 'segmented', 'tabs'] as const).map((style) => (
            <div key={style} className="ui-primitives-board__switcher-preview">
              <p className="ui-primitives-board__switcher-label">{style}</p>
              <SegmentedControl
                options={[...SEGMENTED_LONG]}
                value={style === 'pill' ? segPill : style === 'segmented' ? segSegmented : segTabs}
                onChange={
                  style === 'pill'
                    ? setSegPill
                    : style === 'segmented'
                      ? setSegSegmented
                      : setSegTabs
                }
                ariaLabel={`Стиль ${style}`}
                switcherStyle={style}
                size="md"
                fullWidth
                testId={`ui-seg-style-${style}`}
              />
            </div>
          ))}
        </Stack>
      </section>

      <section className="ui-primitives-board__section" data-testid="ui-board-buttons">
        <h2 className="ui-primitives-board__section-title">Buttons</h2>
        <Stack gap={4}>
          {(['primary', 'secondary', 'ghost', 'danger', 'link'] as const).map((variant) => (
            <Cluster key={variant} gap={2}>
              {(['sm', 'md', 'lg'] as const).map((size) => (
                <Button key={size} variant={variant} size={size} testId={`ui-btn-${variant}-${size}`}>
                  {variant} {size}
                </Button>
              ))}
              <Button variant={variant} disabled>Disabled</Button>
            </Cluster>
          ))}
          <Button
            loading={loadingBtn}
            testId="ui-btn-loading"
            onClick={() => {
              setLoadingBtn(true);
              window.setTimeout(() => setLoadingBtn(false), 1200);
            }}
          >
            Сохранить
          </Button>
          <IconButton label="Настройки" testId="ui-icon-btn">⚙</IconButton>
        </Stack>
      </section>

      <section className="ui-primitives-board__section" data-testid="ui-board-fields">
        <h2 className="ui-primitives-board__section-title">Fields</h2>
        <Stack gap={4}>
          <Field label="Имя" htmlFor="ui-name" hint="Как в заказе">
            <Input id="ui-name" placeholder="Иван" testId="ui-field-name" />
          </Field>
          <Field label="Телефон" htmlFor="ui-phone" required>
            <Input id="ui-phone" defaultValue="+375 29 000-00-01" testId="ui-field-phone" />
          </Field>
          <Field label="Комментарий" htmlFor="ui-comment" error="Слишком коротко">
            <Textarea id="ui-comment" defaultValue="Ок" testId="ui-field-error" />
          </Field>
          <Field label="Оплата" htmlFor="ui-pay">
            <Select id="ui-pay" testId="ui-field-select" defaultValue="card">
              <option value="card">Картой</option>
              <option value="cash">Наличными</option>
            </Select>
          </Field>
          <Checkbox label="Согласен с условиями" testId="ui-field-checkbox" />
        </Stack>
      </section>

      <section className="ui-primitives-board__section" data-testid="ui-board-stack">
        <h2 className="ui-primitives-board__section-title">Stack / Cluster</h2>
        <Stack gap={3}>
          <Cluster gap={2}>
            <span className="ui-primitives-board__chip">Тег 1</span>
            <span className="ui-primitives-board__chip">Тег 2</span>
            <span className="ui-primitives-board__chip">Тег 3</span>
          </Cluster>
          <Stack gap={2} direction="row" align="center">
            <span className="ui-primitives-board__chip">Ряд</span>
            <span className="ui-primitives-board__chip">С gap</span>
          </Stack>
        </Stack>
      </section>

      <section className="ui-primitives-board__section" data-testid="ui-board-skeleton">
        <h2 className="ui-primitives-board__section-title">Skeleton</h2>
        <Stack gap={4}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="rect" height={80} />
          <SkeletonList rows={2} testId="ui-skeleton-list" />
        </Stack>
      </section>

      <section className="ui-primitives-board__section" data-testid="ui-board-pagetitle">
        <h2 className="ui-primitives-board__section-title">Page title</h2>
        <PageTitle
          title="Меню ресторана"
          subtitle="Доставка и самовывоз"
          actions={<Button size="sm">Поделиться</Button>}
          testId="ui-page-title-demo"
        />
      </section>
    </div>
  );
}
