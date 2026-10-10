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
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      setVisible(true);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };

    // Same geometry as the observer: 12% of the block inside a root
    // shortened by 8% at the bottom. Covers the case when IO never fires.
    const inView = () => {
      const rect = node.getBoundingClientRect();
      if (rect.height <= 0) return false;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const rootBottom = viewportHeight * 0.92;
      const visibleHeight = Math.max(0, Math.min(rect.bottom, rootBottom) - Math.max(rect.top, 0));
      return visibleHeight / rect.height >= 0.12;
    };

    const onScroll = () => {
      if (inView()) show();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(node);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    const frame = requestAnimationFrame(onScroll);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
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
