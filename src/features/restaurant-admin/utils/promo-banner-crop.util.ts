export interface CropTransform {
  zoom: number;
  offsetX: number;
  offsetY: number;
}

export interface CropViewportSize {
  width: number;
  height: number;
}

export const PROMO_BANNER_CROP_MAX_WIDTH = 2400;

export function getMinCoverZoom(
  imageWidth: number,
  imageHeight: number,
  viewport: CropViewportSize,
): number {
  if (imageWidth <= 0 || imageHeight <= 0 || viewport.width <= 0 || viewport.height <= 0) {
    return 1;
  }

  return Math.max(viewport.width / imageWidth, viewport.height / imageHeight);
}

export function clampCropTransform(
  transform: CropTransform,
  imageWidth: number,
  imageHeight: number,
  viewport: CropViewportSize,
): CropTransform {
  const zoom = Math.max(getMinCoverZoom(imageWidth, imageHeight, viewport), transform.zoom);
  const scaledWidth = imageWidth * zoom;
  const scaledHeight = imageHeight * zoom;

  const minOffsetX = viewport.width - scaledWidth;
  const minOffsetY = viewport.height - scaledHeight;
  const maxOffsetX = 0;
  const maxOffsetY = 0;

  return {
    zoom,
    offsetX: Math.min(maxOffsetX, Math.max(minOffsetX, transform.offsetX)),
    offsetY: Math.min(maxOffsetY, Math.max(minOffsetY, transform.offsetY)),
  };
}

export function createInitialCropTransform(
  imageWidth: number,
  imageHeight: number,
  viewport: CropViewportSize,
): CropTransform {
  const zoom = getMinCoverZoom(imageWidth, imageHeight, viewport);
  const scaledWidth = imageWidth * zoom;
  const scaledHeight = imageHeight * zoom;

  return {
    zoom,
    offsetX: (viewport.width - scaledWidth) / 2,
    offsetY: (viewport.height - scaledHeight) / 2,
  };
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Не удалось загрузить изображение для обрезки'));
    image.src = src;
  });
}

export async function cropImageToCanvas(
  imageSrc: string,
  viewport: CropViewportSize,
  transform: CropTransform,
): Promise<HTMLCanvasElement> {
  const image = await loadImageElement(imageSrc);
  const zoom = transform.zoom;
  const cropX = (0 - transform.offsetX) / zoom;
  const cropY = (0 - transform.offsetY) / zoom;
  const cropWidth = viewport.width / zoom;
  const cropHeight = viewport.height / zoom;

  const outputWidth = Math.min(
    PROMO_BANNER_CROP_MAX_WIDTH,
    Math.max(1, Math.round(cropWidth)),
  );
  const outputHeight = Math.max(1, Math.round((outputWidth * cropHeight) / cropWidth));

  const canvas = document.createElement('canvas');
  canvas.width = outputWidth;
  canvas.height = outputHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas недоступен');
  }

  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    outputWidth,
    outputHeight,
  );

  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Не удалось сохранить обрезку'));
          return;
        }
        resolve(blob);
      },
      type,
      quality,
    );
  });
}

export async function exportCroppedImageFile(
  imageSrc: string,
  viewport: CropViewportSize,
  transform: CropTransform,
  sourceFileName: string,
): Promise<File> {
  const canvas = await cropImageToCanvas(imageSrc, viewport, transform);
  const baseName = sourceFileName.replace(/\.[^.]+$/, '') || 'promo-banner';

  try {
    const webpBlob = await canvasToBlob(canvas, 'image/webp', 0.92);
    return new File([webpBlob], `${baseName}-cropped.webp`, { type: 'image/webp' });
  } catch {
    const jpegBlob = await canvasToBlob(canvas, 'image/jpeg', 0.9);
    return new File([jpegBlob], `${baseName}-cropped.jpg`, { type: 'image/jpeg' });
  }
}
