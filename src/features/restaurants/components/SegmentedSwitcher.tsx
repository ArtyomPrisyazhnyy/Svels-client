'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import '../styles/fulfillment-selector.scss';

export interface SegmentedSwitcherOption<K extends string> {
  key: K;
  title: string;
}

interface SegmentedSwitcherProps<K extends string> {
  options: SegmentedSwitcherOption<K>[];
  value: K;
  onChange: (value: K) => void;
  ariaLabel: string;
}

interface ThumbMetrics {
  width: number;
  height: number;
  transform: string;
}

export function SegmentedSwitcher<K extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: SegmentedSwitcherProps<K>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [thumb, setThumb] = useState<ThumbMetrics | null>(null);
  const [thumbAnimated, setThumbAnimated] = useState(false);

  const activeIndex = options.findIndex((option) => option.key === value);

  const updateThumb = useCallback(() => {
    const activeEl = optionRefs.current[activeIndex];

    if (!activeEl || activeIndex < 0) {
      setThumb(null);
      return;
    }

    setThumb({
      width: activeEl.offsetWidth,
      height: activeEl.offsetHeight,
      transform: `translate(${activeEl.offsetLeft}px, ${activeEl.offsetTop}px)`,
    });
  }, [activeIndex]);

  useLayoutEffect(() => {
    updateThumb();
  }, [updateThumb, options.length, value]);

  useLayoutEffect(() => {
    setThumbAnimated(false);

    const frameId = requestAnimationFrame(() => {
      setThumbAnimated(true);
    });

    return () => cancelAnimationFrame(frameId);
  }, [options.length]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new ResizeObserver(() => {
      updateThumb();
    });

    observer.observe(container);
    window.addEventListener('resize', updateThumb);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateThumb);
    };
  }, [updateThumb]);

  if (options.length <= 1) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fulfillment-selector"
      role="tablist"
      aria-label={ariaLabel}
    >
      {thumb && (
        <div
          className={`fulfillment-selector__thumb${thumbAnimated ? ' fulfillment-selector__thumb--animated' : ''}`}
          style={thumb}
          aria-hidden
        />
      )}

      {options.map((option, index) => (
        <button
          key={option.key}
          ref={(element) => {
            optionRefs.current[index] = element;
          }}
          type="button"
          role="tab"
          aria-selected={value === option.key}
          className="fulfillment-selector__option"
          onClick={() => onChange(option.key)}
        >
          {option.title}
        </button>
      ))}
    </div>
  );
}
