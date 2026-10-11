'use client';

import {
  type CSSProperties,
  type KeyboardEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '@/shared/ui/utils/cn';
import './SegmentedControl.scss';

export type SegmentedSwitcherStyle = 'pill' | 'segmented' | 'tabs';

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
  /** Venue switcher look; defaults to pill. Playground passes explicit styles. */
  switcherStyle?: SegmentedSwitcherStyle;
  /** Adds legacy `fulfillment-selector*` classes for cart selectors only. */
  legacyFulfillmentClasses?: boolean;
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
  fullWidth = true,
  switcherStyle = 'pill',
  legacyFulfillmentClasses = false,
  className,
  testId,
}: SegmentedControlProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [thumb, setThumb] = useState<ThumbMetrics | null>(null);
  const [thumbAnimated, setThumbAnimated] = useState(false);

  const activeIndex = options.findIndex((option) => option.value === value);

  const updateThumb = useCallback(() => {
    const container = containerRef.current;
    const activeEl = optionRefs.current[activeIndex];

    if (!container || !activeEl || activeIndex < 0) {
      setThumb(null);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();

    setThumb({
      width: activeRect.width,
      height: activeRect.height,
      transform: `translate(${activeRect.left - containerRect.left}px, ${activeRect.top - containerRect.top}px)`,
    });
  }, [activeIndex]);

  const scheduleThumbMeasure = useCallback(() => {
    updateThumb();
    void document.fonts.ready.then(() => {
      updateThumb();
    });
  }, [updateThumb]);

  useLayoutEffect(() => {
    scheduleThumbMeasure();
  }, [scheduleThumbMeasure, options.length, value, switcherStyle]);

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- thumb snap when option count changes
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
      scheduleThumbMeasure();
    });

    observer.observe(container);
    optionRefs.current.forEach((el) => {
      if (el) {
        observer.observe(el);
      }
    });
    window.addEventListener('resize', scheduleThumbMeasure);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', scheduleThumbMeasure);
    };
  }, [scheduleThumbMeasure, options.length]);

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

  const gridStyle = {
    '--ui-seg-cols': String(options.length),
  } as CSSProperties;

  const rootClass = cn(
    'ui-seg',
    'ui-segmented',
    `ui-seg--${size}`,
    !legacyFulfillmentClasses && `ui-seg--style-${switcherStyle}`,
    legacyFulfillmentClasses && 'ui-seg--legacy',
    fullWidth ? 'ui-seg--full' : 'ui-seg--fit',
    legacyFulfillmentClasses && 'fulfillment-selector',
    className,
  );

  const thumbClass = cn(
    'ui-seg__thumb',
    legacyFulfillmentClasses && 'fulfillment-selector__thumb',
    thumbAnimated && 'ui-seg__thumb--animated',
    legacyFulfillmentClasses && thumbAnimated && 'fulfillment-selector__thumb--animated',
  );

  const optionClass = cn(
    'ui-seg__option',
    legacyFulfillmentClasses && 'fulfillment-selector__option',
  );

  return (
    <div
      ref={containerRef}
      className={rootClass}
      style={gridStyle}
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      data-testid={testId}
      data-ui-seg-style={legacyFulfillmentClasses ? undefined : switcherStyle}
    >
      {thumb && (legacyFulfillmentClasses || switcherStyle !== 'tabs') ? (
        <div className={thumbClass} style={thumb} aria-hidden />
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
            disabled={option.disabled}
            className={optionClass}
            onClick={() => onChange(option.value)}
            data-testid={option.testId}
          >
            <span className="ui-seg__label">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
