import type { MenuCategoryNavItem } from '../context/MenuCategoryNavContext';

function getCategoryElementId(categoryId: string): string {
  return `menu-category-${categoryId}`;
}

export function getMenuCategoryHeaderOffset(): number {
  const stack = document.querySelector('.restaurant-public__header-stack');
  if (stack instanceof HTMLElement) {
    return stack.getBoundingClientRect().height;
  }

  const header = document.querySelector('.glass-header');
  if (header instanceof HTMLElement) {
    return header.getBoundingClientRect().height;
  }

  return 68;
}

/** Последняя категория, чей блок пересёк линию под шапкой (scroll-spy). */
export function resolveActiveMenuCategoryId(
  categories: MenuCategoryNavItem[],
  headerOffset = getMenuCategoryHeaderOffset(),
): string {
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
