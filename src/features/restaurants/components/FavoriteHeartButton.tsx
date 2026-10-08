'use client';

import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react';
import '../styles/favorite-heart-button.scss';

export type FavoriteHeartVariant = 'overlay' | 'plain';

interface FavoriteHeartButtonProps {
  active: boolean;
  onClick: (event: MouseEvent) => void;
  className?: string;
  variant?: FavoriteHeartVariant;
}

const HEART_PATH =
  'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z';

function HeartIcon({ active, plain }: { active: boolean; plain: boolean }) {
  const showOuter = !plain || active;

  return (
    <svg viewBox="0 0 24 24" aria-hidden className="favorite-heart-button__icon">
      {showOuter ? (
        <path
          className="favorite-heart-button__shape favorite-heart-button__shape--outer"
          d={HEART_PATH}
        />
      ) : null}
      <path
        className={[
          'favorite-heart-button__shape',
          'favorite-heart-button__shape--inner',
          active ? 'favorite-heart-button__shape--inner-active' : '',
          plain && !active ? 'favorite-heart-button__shape--inner-plain' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        d={HEART_PATH}
      />
    </svg>
  );
}

export function FavoriteHeartButton({
  active,
  onClick,
  className = '',
  variant = 'overlay',
}: FavoriteHeartButtonProps) {
  const plain = variant === 'plain';
  const prevActive = useRef(active);
  const [motion, setMotion] = useState<'like' | 'unlike' | null>(null);

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    event.stopPropagation();
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    onClick(event);
  }

  useEffect(() => {
    if (prevActive.current === active) {
      return;
    }
    setMotion(active ? 'like' : 'unlike');
    prevActive.current = active;
    const timer = window.setTimeout(() => setMotion(null), 620);
    return () => window.clearTimeout(timer);
  }, [active]);

  return (
    <button
      type="button"
      className={[
        'favorite-heart-button',
        `favorite-heart-button--${variant}`,
        active ? 'favorite-heart-button--active' : '',
        motion === 'like' ? 'favorite-heart-button--pulse-like' : '',
        motion === 'unlike' ? 'favorite-heart-button--pulse-unlike' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      aria-label={active ? 'Убрать из избранного' : 'В избранное'}
      aria-pressed={active}
      data-testid="favorite-heart-button"
      data-favorite-heart=""
    >
      {motion === 'like' ? (
        <>
          <span className="favorite-heart-button__ring" aria-hidden />
          <span
            className="favorite-heart-button__ring favorite-heart-button__ring--delay"
            aria-hidden
          />
        </>
      ) : null}
      <HeartIcon active={active} plain={plain} />
    </button>
  );
}
