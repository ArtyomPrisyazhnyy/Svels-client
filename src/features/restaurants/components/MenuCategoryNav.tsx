'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import {
  resolveActiveMenuCategoryId,
  scrollMenuCategoryNavButtonIntoView,
} from '../utils/menu-category-nav.util';
import {
  useMenuCategoryNavOptional,
  type MenuCategoryNavItem,
} from '../context/MenuCategoryNavContext';

export type { MenuCategoryNavItem };

interface MenuCategoryNavViewProps {
  categories: MenuCategoryNavItem[];
  activeId: string;
  onSelect: (categoryId: string) => void;
  placement: 'inline' | 'header';
  innerRef?: RefObject<HTMLDivElement | null>;
  enableActiveButtonScroll?: boolean;
}

function getCategoryElementId(categoryId: string): string {
  return `menu-category-${categoryId}`;
}

function MenuCategoryNavView({
  categories,
  activeId,
  onSelect,
  placement,
  innerRef,
  enableActiveButtonScroll = true,
}: MenuCategoryNavViewProps) {
  useEffect(() => {
    if (!enableActiveButtonScroll || !innerRef?.current || !activeId) {
      return;
    }

    scrollMenuCategoryNavButtonIntoView(innerRef.current, activeId);
  }, [activeId, enableActiveButtonScroll, innerRef]);

  if (categories.length <= 1) {
    return null;
  }

  return (
    <nav
      className={`restaurant-menu__category-nav${
        placement === 'header' ? ' restaurant-menu__category-nav--header' : ''
      }`}
      aria-label="Навигация по категориям меню"
    >
      <div ref={innerRef} className="restaurant-menu__category-nav-inner">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            data-category-id={category.id}
            className={`restaurant-menu__category-nav-btn${
              activeId === category.id ? ' restaurant-menu__category-nav-btn--active' : ''
            }`}
            onClick={() => onSelect(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </nav>
  );
}

function MenuCategoryNavStandalone({ categories }: { categories: MenuCategoryNavItem[] }) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? '');
  const innerRef = useRef<HTMLDivElement>(null);

  const scrollToCategory = useCallback((categoryId: string) => {
    const element = document.getElementById(getCategoryElementId(categoryId));
    if (!element) {
      return;
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveId(categoryId);
  }, []);

  useEffect(() => {
    setActiveId((current) => {
      if (categories.some((category) => category.id === current)) {
        return current;
      }

      return categories[0]?.id ?? '';
    });
  }, [categories]);

  useEffect(() => {
    if (categories.length === 0) {
      return;
    }

    const updateActiveId = () => {
      setActiveId((current) => {
        const next = resolveActiveMenuCategoryId(categories);
        return next === current ? current : next;
      });
    };

    updateActiveId();
    window.addEventListener('scroll', updateActiveId, { passive: true });
    window.addEventListener('resize', updateActiveId);

    return () => {
      window.removeEventListener('scroll', updateActiveId);
      window.removeEventListener('resize', updateActiveId);
    };
  }, [categories]);

  return (
    <MenuCategoryNavView
      categories={categories}
      activeId={activeId}
      onSelect={scrollToCategory}
      placement="inline"
      innerRef={innerRef}
    />
  );
}

interface MenuCategoryNavProps {
  categories?: MenuCategoryNavItem[];
  placement?: 'inline' | 'header';
}

export function MenuCategoryNav({ categories: categoriesProp, placement = 'inline' }: MenuCategoryNavProps) {
  const context = useMenuCategoryNavOptional();
  const headerInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!context || placement !== 'header' || !context.docked) {
      return;
    }

    const source = context.inlineNavInnerRef.current;
    const target = headerInnerRef.current;
    if (source && target) {
      target.scrollLeft = source.scrollLeft;
    }
  }, [context?.docked, context, placement]);

  if (categoriesProp && !context) {
    return <MenuCategoryNavStandalone categories={categoriesProp} />;
  }

  if (!context) {
    return null;
  }

  const enableInlineActiveButtonScroll =
    placement === 'header' || (placement === 'inline' && !context.docked);

  return (
    <MenuCategoryNavView
      categories={context.categories}
      activeId={context.activeId}
      onSelect={context.scrollToCategory}
      placement={placement}
      innerRef={placement === 'inline' ? context.inlineNavInnerRef : headerInnerRef}
      enableActiveButtonScroll={enableInlineActiveButtonScroll}
    />
  );
}
