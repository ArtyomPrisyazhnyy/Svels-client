import { useEffect, useRef } from 'react';
import { pushOverlay, subscribeEscapeKey } from '@/shared/ui/Modal/modal-stack';

/** Register overlay once per mount; always invokes latest onClose via ref. */
export function useOverlayRegistration(onClose: () => void): void {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const close = () => {
      onCloseRef.current();
    };
    const pop = pushOverlay(close);
    const unsub = subscribeEscapeKey(close);
    return () => {
      pop();
      unsub();
    };
  }, []);
}
