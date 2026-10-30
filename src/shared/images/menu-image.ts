import { API_URL } from '@/shared/config/env';
import { isOptimizableImageUrl } from '@/shared/images/image-remote';
import { resolveImageUrl } from '@/shared/types/menu';

export {
  MENU_CARD_IMAGE_SIZES,
  MENU_MAGAZINE_IMAGE_SIZES,
  eagerMenuImageCount,
  menuImageFetchPriority,
  menuImageLoading,
} from '@/shared/images/menu-image-loading';

/** Absolute URL the image optimizer can fetch. Relative `/uploads` goes to the API. */
export function toOptimizerImageSrc(src: string | null | undefined): string | null {
  if (!src) {
    return null;
  }
  const resolved = resolveImageUrl(src);
  if (!resolved || resolved.startsWith('data:')) {
    return null;
  }
  const absolute = resolved.startsWith('/uploads/') ? `${API_URL}${resolved}` : resolved;
  if (!absolute.startsWith('http://') && !absolute.startsWith('https://')) {
    return null;
  }
  return isOptimizableImageUrl(absolute) ? absolute : null;
}
