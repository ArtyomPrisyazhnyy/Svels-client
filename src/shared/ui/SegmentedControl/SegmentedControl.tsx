'use client';

import { type KeyboardEvent, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/shared/ui/utils/cn';
import './SegmentedControl.scss';

export interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
  disabled?: boolean;
  testId?: string;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  className?: string;
  testId?: string;
}

interface ThumbMetrics {
  width: number;
  height: number;
  transform: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = 'md',
  fullWidth = false,
  className,
  testId,
}: SegmentedControlProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [thumb, setThumb] = useState<ThumbMetrics | null>(null);
  const [thumbAnimated, setThumbAnimated] = useState(false);

  const activeIndex = options.findIndex((option) => option.value === value);

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

  const focusOption = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) {
      return;
    }
    onChange(option.value);
    optionRefs.current[index]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return;
    }

    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    let next = activeIndex;
    for (let step = 0; step < options.length; step += 1) {
      next = (next + direction + options.length) % options.length;
      if (!options[next]?.disabled) {
        focusOption(next);
        break;
      }
    }
  };

  if (options.length <= 1) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'ui-seg',
        'fulfillment-selector',
        `ui-seg--${size}`,
        fullWidth && 'ui-seg--full',
        className,
      )}
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      data-testid={testId}
    >
      {thumb ? (
        <div
          className={cn(
            'ui-seg__thumb',
            'fulfillment-selector__thumb',
            thumbAnimated && 'ui-seg__thumb--animated fulfillment-selector__thumb--animated',
          )}
          style={thumb}
          aria-hidden
        />
      ) : null}

      {options.map((option, index) => {
        const checked = value === option.value;
        return (
          <button
            key={option.value}
            ref={(element) => {
              optionRefs.current[index] = element;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-selected={checked}
            disabled={option.disabled}
            className="ui-seg__option fulfillment-selector__option"
            onClick={() => onChange(option.value)}
            data-testid={option.testId}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
