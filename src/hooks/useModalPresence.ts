import { useCallback, useEffect, useRef, useState } from 'react';
import { useScrollLock } from '@/hooks/useScrollLock';

interface UseModalPresenceResult {
  mounted: boolean;
  isActive: boolean;
  handleClose: () => void;
}

/**
 * Общая логика появления/закрытия модалок:
 * - scroll-lock на время жизни;
 * - корректная отмена rAF при unmount (без «воскрешения» active);
 * - один close-таймер без гонок при двойном клике.
 */
export function useModalPresence(
  onClose: () => void,
  animationMs = 200,
): UseModalPresenceResult {
  const [mounted, setMounted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const closingRef = useRef(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useScrollLock(mounted);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    let cancelled = false;
    let outerFrame = 0;
    let innerFrame = 0;

    outerFrame = requestAnimationFrame(() => {
      innerFrame = requestAnimationFrame(() => {
        if (!cancelled && !closingRef.current) {
          setIsActive(true);
        }
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(outerFrame);
      cancelAnimationFrame(innerFrame);
    };
  }, [mounted]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const handleClose = useCallback(() => {
    if (closingRef.current) {
      return;
    }

    closingRef.current = true;
    setIsActive(false);

    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = setTimeout(() => {
      onClose();
    }, animationMs);
  }, [animationMs, onClose]);

  return { mounted, isActive, handleClose };
}
