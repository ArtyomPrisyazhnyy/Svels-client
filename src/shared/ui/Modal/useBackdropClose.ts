import {
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  useRef,
} from 'react';

export function useBackdropClose(onClose: () => void) {
  const pointerDownOnBackdropRef = useRef(false);

  const onBackdropPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    pointerDownOnBackdropRef.current = event.target === event.currentTarget;
  };

  const onBackdropClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (
      event.target === event.currentTarget &&
      pointerDownOnBackdropRef.current &&
      event.button === 0
    ) {
      onClose();
    }
    pointerDownOnBackdropRef.current = false;
  };

  return { onBackdropPointerDown, onBackdropClick };
}
