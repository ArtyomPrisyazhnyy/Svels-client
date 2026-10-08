import { useLayoutEffect } from 'react';

let lockCount = 0;
let releaseLock: (() => void) | null = null;

const SCROLL_KEYS = new Set([
  ' ',
  'ArrowUp',
  'ArrowDown',
  'PageUp',
  'PageDown',
  'Home',
  'End',
]);

function asHtmlElement(target: EventTarget | null): HTMLElement | null {
  if (target instanceof HTMLElement) {
    return target;
  }
  if (target instanceof Node) {
    return target.parentElement;
  }
  return null;
}

function findScrollableAncestor(target: EventTarget | null): HTMLElement | null {
  let node = asHtmlElement(target);

  while (node && node !== document.body && node !== document.documentElement) {
    const overflowY = getComputedStyle(node).overflowY;
    if (
      (overflowY === 'auto' || overflowY === 'scroll') &&
      node.scrollHeight > node.clientHeight
    ) {
      return node;
    }
    node = node.parentElement;
  }

  return null;
}

function isEditableTarget(target: EventTarget | null): boolean {
  const node = asHtmlElement(target);
  if (!node) {
    return false;
  }

  const tag = node.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || node.isContentEditable;
}

function preventScrollChaining(event: WheelEvent, scrollable: HTMLElement): boolean {
  const delta = event.deltaY;
  if (delta === 0) {
    return false;
  }

  const { scrollTop, scrollHeight, clientHeight } = scrollable;
  const atTop = scrollTop <= 0;
  const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

  return (delta < 0 && atTop) || (delta > 0 && atBottom);
}

/**
 * Блокирует фон при открытой модалке, не трогая overflow html/body.
 * overflow:hidden (и тем более position:fixed + top:-scrollY) ломает sticky-шапку:
 * она «отлипает» и уезжает вверх на величину текущего scrollY.
 */
function lockScroll(): void {
  if (lockCount === 0) {
    const html = document.documentElement;
    const savedY = window.scrollY;
    const savedOverscroll = html.style.overscrollBehavior;

    html.style.overscrollBehavior = 'none';

    const onWheel = (event: WheelEvent) => {
      const scrollable = findScrollableAncestor(event.target);
      if (scrollable) {
        if (preventScrollChaining(event, scrollable)) {
          event.preventDefault();
        }
        return;
      }
      event.preventDefault();
    };

    const onTouchMove = (event: TouchEvent) => {
      if (findScrollableAncestor(event.target)) {
        return;
      }
      event.preventDefault();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!SCROLL_KEYS.has(event.key) || isEditableTarget(event.target)) {
        return;
      }
      if (findScrollableAncestor(event.target)) {
        return;
      }
      event.preventDefault();
    };

    const onScroll = () => {
      if (window.scrollY !== savedY) {
        window.scrollTo(0, savedY);
      }
    };

    document.addEventListener('wheel', onWheel, { passive: false });
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onScroll);

    releaseLock = () => {
      document.removeEventListener('wheel', onWheel);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onScroll);
      html.style.overscrollBehavior = savedOverscroll;
    };
  }

  lockCount += 1;
}

function unlockScroll(): void {
  if (lockCount === 0) {
    return;
  }

  lockCount -= 1;

  if (lockCount === 0 && releaseLock) {
    releaseLock();
    releaseLock = null;
  }
}

export function useScrollLock(active: boolean): void {
  useLayoutEffect(() => {
    if (!active) {
      return;
    }

    lockScroll();

    return () => {
      unlockScroll();
    };
  }, [active]);
}
