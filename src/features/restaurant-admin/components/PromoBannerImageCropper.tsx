'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  clampCropTransform,
  createInitialCropTransform,
  getMinCoverZoom,
  type CropTransform,
} from '../utils/promo-banner-crop.util';
import type { PromoBannerAspectRatio } from '@/shared/types/promo-banner';
import { Field, RangeInput } from '@/shared/ui';
import {
  PROMO_BANNER_MODAL_CROP_ASPECT,
  promoBannerAspectRatioToNumber,
} from '../utils/promo-banner-aspect.util';
import '../styles/promo-banner-image-cropper.scss';

export interface PromoBannerImageCropperProps {
  imageUrl: string;
  sourceFileName: string;
  /** Strip: locked 4:1 / 16:9. Modal: flexible modal viewport. */
  lockedAspectRatio: PromoBannerAspectRatio | 'modal';
  onCancel: () => void;
  onConfirm: (transform: CropTransform, viewport: { width: number; height: number }) => void;
  confirming?: boolean;
}

export function PromoBannerImageCropper({
  imageUrl,
  sourceFileName,
  lockedAspectRatio,
  onCancel,
  onConfirm,
  confirming = false,
}: PromoBannerImageCropperProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [transform, setTransform] = useState<CropTransform>({
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
  });
  const dragRef = useRef<{ startX: number; startY: number; base: CropTransform } | null>(null);

  const aspectValue =
    lockedAspectRatio === 'modal'
      ? PROMO_BANNER_MODAL_CROP_ASPECT
      : promoBannerAspectRatioToNumber(lockedAspectRatio);

  const resetTransform = useCallback(
    (width: number, height: number, viewport: { width: number; height: number }) => {
      setTransform(createInitialCropTransform(width, height, viewport));
    },
    [],
  );

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      setImageSize({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) {
      return;
    }

    const updateSize = () => {
      const rect = node.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(width / aspectValue));
      setViewportSize({ width, height });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(node);
    return () => observer.disconnect();
  }, [aspectValue]);

  useEffect(() => {
    if (
      imageSize.width <= 0 ||
      imageSize.height <= 0 ||
      viewportSize.width <= 0 ||
      viewportSize.height <= 0
    ) {
      return;
    }
    resetTransform(imageSize.width, imageSize.height, viewportSize);
  }, [
    imageSize.width,
    imageSize.height,
    viewportSize.width,
    viewportSize.height,
    lockedAspectRatio,
    resetTransform,
  ]);

  const applyTransform = useCallback(
    (next: CropTransform) => {
      if (viewportSize.width <= 0 || viewportSize.height <= 0) {
        return;
      }
      setTransform(
        clampCropTransform(next, imageSize.width, imageSize.height, viewportSize),
      );
    },
    [imageSize.height, imageSize.width, viewportSize],
  );

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (confirming) {
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      base: transform,
    };
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) {
      return;
    }
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    applyTransform({
      ...drag.base,
      offsetX: drag.base.offsetX + deltaX,
      offsetY: drag.base.offsetY + deltaY,
    });
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragRef.current) {
      event.currentTarget.releasePointerCapture(event.pointerId);
      dragRef.current = null;
    }
  }

  const minZoom =
    imageSize.width > 0 && viewportSize.width > 0
      ? getMinCoverZoom(imageSize.width, imageSize.height, viewportSize)
      : 1;

  const handleZoomChange = (value: number) => {
    const zoom = Math.max(minZoom, value);
    const scaledWidth = imageSize.width * zoom;
    const scaledHeight = imageSize.height * zoom;
    applyTransform({
      zoom,
      offsetX: (viewportSize.width - scaledWidth) / 2,
      offsetY: (viewportSize.height - scaledHeight) / 2,
    });
  };

  const canConfirm =
    viewportSize.width > 0 &&
    viewportSize.height > 0 &&
    imageSize.width > 0 &&
    !confirming;

  return (
    <div className="promo-banner-crop" data-testid="promo-banner-cropper">
      <p className="promo-banner-crop__hint">
        Перетащите изображение и отрегулируйте масштаб. Область обрезки зафиксирована
        {lockedAspectRatio === 'modal'
          ? ' под модальное окно.'
          : lockedAspectRatio === '16_9'
            ? ' в формате 16∶9.'
            : ' в формате 4∶1.'}
      </p>
      <div
        ref={viewportRef}
        className="promo-banner-crop__viewport"
        style={
          viewportSize.height > 0
            ? { height: `${viewportSize.height}px` }
            : undefined
        }
        data-testid="promo-banner-cropper-viewport"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="promo-banner-crop__image"
          src={imageUrl}
          alt=""
          draggable={false}
          style={{
            width: `${imageSize.width}px`,
            height: `${imageSize.height}px`,
            transform: `translate(${transform.offsetX}px, ${transform.offsetY}px) scale(${transform.zoom})`,
            transformOrigin: 'top left',
          }}
        />
      </div>

      <Field label="Масштаб" htmlFor="promo-banner-crop-zoom">
        <RangeInput
          id="promo-banner-crop-zoom"
          min={minZoom}
          max={Math.max(minZoom * 3, minZoom + 0.01)}
          step={0.01}
          value={transform.zoom}
          testId="promo-banner-cropper-zoom"
          disabled={confirming || imageSize.width <= 0}
          onChange={(event) => handleZoomChange(Number.parseFloat(event.target.value))}
        />
      </Field>

      <div className="promo-banners-admin__actions promo-banner-crop__actions">
        <button
          type="button"
          className="promo-banners-admin__cancel"
          disabled={confirming}
          data-testid="promo-banner-cropper-cancel"
          onClick={onCancel}
        >
          Отмена
        </button>
        <button
          type="button"
          className="promo-banners-admin__submit"
          disabled={!canConfirm}
          data-testid="promo-banner-cropper-apply"
          onClick={() => onConfirm(transform, viewportSize)}
        >
          {confirming ? 'Загрузка…' : 'Применить обрезку'}
        </button>
      </div>
      <p className="promo-banner-crop__meta">{sourceFileName}</p>
    </div>
  );
}
