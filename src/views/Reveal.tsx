'use client';

import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from 'react';

/**
 * Лёгкий reveal-on-scroll на IntersectionObserver.
 * Добавляет CSS-класс `is-visible` когда элемент попадает во вьюпорт.
 * Без JS-библиотек анимации — только CSS-переходы, чтобы лендинг
 * оставался моментальным даже на слабом интернете.
 */
type RevealProps<T extends ElementType> = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className' | 'delay'>;

export function Reveal<T extends ElementType = 'div'>({
  children,
  className = '',
  delay = 0,
  as,
  ...rest
}: RevealProps<T>) {
  const Tag = (as ?? 'div') as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      requestAnimationFrame(() => setVisible(true));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0, rootMargin: '80px 0px' },
    );

    observer.observe(node);
    // Large blocks and full-page captures can miss the observer. Never stay faded.
    const fallback = window.setTimeout(() => setVisible(true), 1200);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
