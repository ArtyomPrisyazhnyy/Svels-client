'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const SOUND_URL = '/sounds/new-order.mp3';
const STORAGE_KEY = 'orders-admin-sound-enabled';

export function useNewOrderSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [enabled, setEnabled] = useState(
    () => typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY) === '1',
  );
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio(SOUND_URL);
    audioRef.current.preload = 'auto';
  }, []);

  const armSound = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    try {
      audio.volume = 0.01;
      await audio.play();
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 1;
      setArmed(true);
      setEnabled(true);
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      setArmed(false);
    }
  }, []);

  const disableSound = useCallback(() => {
    setEnabled(false);
    setArmed(false);
    window.localStorage.setItem(STORAGE_KEY, '0');
  }, []);

  const playNewOrderSound = useCallback(() => {
    if (!enabled || !armed) {
      return;
    }
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    audio.currentTime = 0;
    void audio.play().catch(() => {
      setArmed(false);
    });
  }, [enabled, armed]);

  return {
    soundEnabled: enabled,
    soundArmed: armed,
    armSound,
    disableSound,
    playNewOrderSound,
  };
}
