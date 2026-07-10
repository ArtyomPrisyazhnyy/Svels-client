'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
import {
  getMenuCategoryHeaderOffset,
  resolveActiveMenuCategoryId,
} from '../utils/menu-category-nav.util';

export type MenuCategoryNavMode = 'inline_only' | 'dock_in_header' | 'always_in_header';

export interface MenuCategoryNavItem {
  id: string;
  name: string;
}

interface MenuCategoryNavContextValue {
  categories: MenuCategoryNavItem[];
  mode: MenuCategoryNavMode;
  activeId: string;
  docked: boolean;
  inlineAnchorRef: RefObject<HTMLDivElement | null>;
  inlineNavInnerRef: RefObject<HTMLDivElement | null>;
  scrollToCategory: (categoryId: string) => void;
}

const MenuCategoryNavContext = createContext<MenuCategoryNavContextValue | null>(null);

function getCategoryElementId(categoryId: string): string {
  return `menu-category-${categoryId}`;
}

function updateHeaderStackHeight(): void {
  const stack = document.querySelector('.restaurant-public__header-stack');
  if (!(stack instanceof HTMLElement)) {
    return;
  }

  document.documentElement.style.setProperty(
    '--rs-header-stack-height',
    `${stack.getBoundingClientRect().height}px`,
  );
}

interface MenuCategoryNavProviderProps {
  categories: MenuCategoryNavItem[];
  mode: MenuCategoryNavMode;
  children: ReactNode;
}

export function MenuCategoryNavProvider({
  categories,
  mode,
  children,
}: MenuCategoryNavProviderProps) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? '');
  const [docked, setDocked] = useState(false);
  const inlineAnchorRef = useRef<HTMLDivElement>(null);
  const inlineNavInnerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (mode !== 'dock_in_header') {
      setDocked(false);
      return;
    }

    const updateDocked = () => {
      const anchor = inlineAnchorRef.current;
      if (!anchor) {
        setDocked(false);
        return;
      }

      const headerHeight = getMenuCategoryHeaderOffset();
      setDocked(anchor.getBoundingClientRect().top <= headerHeight + 1);
    };

    updateDocked();
    window.addEventListener('scroll', updateDocked, { passive: true });
    window.addEventListener('resize', updateDocked);

    return () => {
      window.removeEventListener('scroll', updateDocked);
      window.removeEventListener('resize', updateDocked);
    };
  }, [mode, categories.length]);

  useEffect(() => {
    updateHeaderStackHeight();

    const stack = document.querySelector('.restaurant-public__header-stack');
    if (!(stack instanceof HTMLElement)) {
      return;
    }

    const observer = new ResizeObserver(() => {
      updateHeaderStackHeight();
    });

    observer.observe(stack);
    window.addEventListener('resize', updateHeaderStackHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHeaderStackHeight);
    };
  }, [docked, categories.length, mode]);

  const value: MenuCategoryNavContextValue = {
    categories,
    mode,
    activeId,
    docked,
    inlineAnchorRef,
    inlineNavInnerRef,
    scrollToCategory,
  };

  return (
    <MenuCategoryNavContext.Provider value={value}>{children}</MenuCategoryNavContext.Provider>
  );
}

export function useMenuCategoryNav(): MenuCategoryNavContextValue {
  const context = useContext(MenuCategoryNavContext);
  if (!context) {
    throw new Error('useMenuCategoryNav must be used within MenuCategoryNavProvider');
  }

  return context;
}

export function useMenuCategoryNavOptional(): MenuCategoryNavContextValue | null {
  return useContext(MenuCategoryNavContext);
}
