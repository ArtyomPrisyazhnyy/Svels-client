import { useLayoutEffect } from 'react';

let lockCount = 0;
let savedScrollY = 0;
let releaseLock: (() => void) | null = null;

function lockScroll(): void {
  if (lockCount === 0) {
    savedScrollY = window.scrollY;

    const body = document.body;
    const frozenWidth = `${body.getBoundingClientRect().width}px`;

    const saved = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    body.style.position = 'fixed';
    body.style.top = `-${savedScrollY}px`;
    body.style.left = '0';
    body.style.width = frozenWidth;
    body.style.overflow = 'hidden';

    releaseLock = () => {
      body.style.position = saved.position;
      body.style.top = saved.top;
      body.style.left = saved.left;
      body.style.width = saved.width;
      body.style.overflow = saved.overflow;
      window.scrollTo(0, savedScrollY);
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

/**
 * Блокирует прокрутку: фиксирует body на текущей позиции с замороженной шириной.
 * Scrollbar исчезает сам (html перестаёт переполняться), контент не сдвигается.
 */
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
