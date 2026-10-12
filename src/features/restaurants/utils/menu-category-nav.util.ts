import type { MenuCategoryNavItem } from '../context/MenuCategoryNavContext';

function getCategoryElementId(categoryId: string): string {
  return `menu-category-${categoryId}`;
}

function readVenueNavHeight(): number {
  const venueNav = document.querySelector('[data-testid="venue-home-category-nav"]');
  if (venueNav instanceof HTMLElement) {
    return venueNav.getBoundingClientRect().height;
  }

  return 0;
}

/** Header plus the sticky category nav, so scroll-spy lines up under the chips. */
export function getMenuCategoryHeaderOffset(): number {
  const header =
    document.querySelector('[data-testid="venue-header"]') ??
    document.querySelector('.glass-header');
  if (!(header instanceof HTMLElement)) {
    return 68;
  }

  return header.getBoundingClientRect().height + readVenueNavHeight();
}

function isScrolledToBottom(): boolean {
  const scrollingElement = document.scrollingElement ?? document.documentElement;
  const scrollHeight = scrollingElement.scrollHeight;
  if (scrollHeight <= window.innerHeight + 2) {
    return false;
  }

  return window.innerHeight + window.scrollY >= scrollHeight - 2;
}

/** Последняя категория, чей блок пересёк линию под шапкой (scroll-spy). */
export function resolveActiveMenuCategoryId(
  categories: MenuCategoryNavItem[],
  headerOffset = getMenuCategoryHeaderOffset(),
): string {
  const lastId = categories[categories.length - 1]?.id ?? '';
  if (lastId && isScrolledToBottom()) {
    return lastId;
  }

  const marker = headerOffset + 24;
  let activeId = categories[0]?.id ?? '';

  for (const category of categories) {
    const element = document.getElementById(getCategoryElementId(category.id));
    if (!element) {
      continue;
    }

    if (element.getBoundingClientRect().top <= marker) {
      activeId = category.id;
    }
  }

  return activeId;
}

export function scrollMenuCategoryNavButtonIntoView(
  inner: HTMLElement,
  activeId: string,
): void {
  const activeButton = inner.querySelector(`[data-category-id="${activeId}"]`);
  if (!(activeButton instanceof HTMLElement)) {
    return;
  }

  const buttonLeft = activeButton.offsetLeft;
  const buttonWidth = activeButton.offsetWidth;
  const containerWidth = inner.clientWidth;
  const maxScroll = Math.max(0, inner.scrollWidth - containerWidth);
  const centeredScroll = buttonLeft - (containerWidth - buttonWidth) / 2;
  const scrollTarget = Math.min(maxScroll, Math.max(0, centeredScroll));

  inner.scrollTo({
    left: scrollTarget,
    behavior: 'smooth',
  });
}
