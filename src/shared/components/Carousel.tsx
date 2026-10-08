'use client';

import { useCallback, useEffect, useState, type ElementType, type ReactNode } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import './Carousel.scss';

type CarouselOptions = NonNullable<Parameters<typeof useEmblaCarousel>[0]>;

function ChevronIcon({ direction }: { direction: 'prev' | 'next' }) {
  return (
    <svg
      className="carousel__arrow-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {direction === 'prev' ? (
        <path d="M15 6 9 12l6 6" />
      ) : (
        <path d="M9 6l6 6-6 6" />
      )}
    </svg>
  );
}

interface CarouselProps {
  slides: ReactNode[];
  options?: CarouselOptions;
  /** Автопрокрутка (для баннеров акций). */
  autoplay?: boolean;
  autoplayDelay?: number;
  /** Показывать стрелки навигации. */
  showArrows?: boolean;
  /** Показывать точки-индикаторы. */
  showDots?: boolean;
  /** Тег-обёртка слайда (по умолчанию div). */
  slideAs?: ElementType;
  className?: string;
  slideClassName?: string;
}

export function Carousel({
  slides,
  options,
  autoplay = false,
  autoplayDelay = 4000,
  showArrows = true,
  showDots = true,
  slideAs: Slide = 'div',
  className,
  slideClassName,
}: CarouselProps) {
  const plugins = autoplay ? [Autoplay({ delay: autoplayDelay, stopOnInteraction: false })] : [];
  const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback((api: typeof emblaApi) => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect(emblaApi);
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (slides.length === 0) return null;

  return (
    <div className={className}>
      <div className="carousel__viewport" ref={emblaRef}>
        <div className="carousel__container">
          {slides.map((slide, index) => (
            <Slide className={`carousel__slide${slideClassName ? ` ${slideClassName}` : ''}`} key={index}>
              {slide}
            </Slide>
          ))}
        </div>
      </div>

      {showArrows && slides.length > 1 && (
        <>
          <button type="button" className="carousel__arrow carousel__arrow--prev" onClick={scrollPrev} aria-label="Предыдущий слайд">
            <ChevronIcon direction="prev" />
          </button>
          <button type="button" className="carousel__arrow carousel__arrow--next" onClick={scrollNext} aria-label="Следующий слайд">
            <ChevronIcon direction="next" />
          </button>
        </>
      )}

      {showDots && slides.length > 1 && (
        <div className="carousel__dots">
          {scrollSnaps.map((_, index) => (
            <button
              type="button"
              key={index}
              className={`carousel__dot${index === selectedIndex ? ' carousel__dot--active' : ''}`}
              onClick={() => scrollTo(index)}
              aria-label={`Слайд ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
