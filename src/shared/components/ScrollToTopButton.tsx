'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useIsTenantDomain } from '@/shared/routing/restaurant-guest-path';
import '@/shared/styles/scroll-to-top-button.scss';

const ADMIN_PREFIXES = ['/admin', '/restaurant-admin'] as const;
const PLATFORM_RESTAURANT_GUEST = /^\/restaurants\/[^/]+(\/|$)/;
const TENANT_GUEST_PATHS = /^\/(|booking|pre-order|account|favorites|auth|payment\/result)(\/|$)/;

function isRestaurantGuestPage(pathname: string, tenantMode: boolean): boolean {
  if (PLATFORM_RESTAURANT_GUEST.test(pathname)) {
    return true;
  }
  return tenantMode && TENANT_GUEST_PATHS.test(pathname);
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function currentScrollY(): number {
  return window.scrollY || document.documentElement.scrollTop || 0;
}

function ChevronUpIcon() {
  return (
    <svg
      className="scroll-to-top__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 15 12 9l6 6" />
    </svg>
  );
}

export function ScrollToTopButton({ forRestaurantTheme = false }: { forRestaurantTheme?: boolean }) {
  const pathname = usePathname();
  const tenantMode = useIsTenantDomain();
  const [scrolled, setScrolled] = useState(false);
  const [footerInView, setFooterInView] = useState(false);

  const hiddenOnAdmin = ADMIN_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const hiddenOnRestaurantGuest =
    !forRestaurantTheme && isRestaurantGuestPage(pathname, tenantMode);

  useEffect(() => {
    if (hiddenOnAdmin || hiddenOnRestaurantGuest) {
      setScrolled(false);
      return;
    }

    const syncVisibility = () => {
      setScrolled(currentScrollY() > 0);
    };

    syncVisibility();
    window.addEventListener('scroll', syncVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', syncVisibility);
    };
  }, [hiddenOnAdmin, hiddenOnRestaurantGuest]);

  useEffect(() => {
    if (hiddenOnAdmin || hiddenOnRestaurantGuest || !forRestaurantTheme) {
      setFooterInView(false);
      return;
    }

    const footer = document.querySelector('[data-testid="restaurant-footer"]');
    if (!(footer instanceof HTMLElement)) {
      setFooterInView(false);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        setFooterInView(entries.some((entry) => entry.isIntersecting));
      },
      { threshold: 0, rootMargin: '0px 0px -1px 0px' },
    );
    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, [forRestaurantTheme, hiddenOnAdmin, hiddenOnRestaurantGuest, pathname]);

  const visible = scrolled && !footerInView;

  const handleClick = () => {
    if (currentScrollY() <= 0) {
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  };

  if (hiddenOnAdmin || hiddenOnRestaurantGuest) {
    return null;
  }

  return (
    <button
      type="button"
      className={`scroll-to-top${visible ? ' scroll-to-top--visible' : ''}`}
      aria-label="Наверх"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      data-testid="scroll-to-top"
      onClick={handleClick}
    >
      <ChevronUpIcon />
    </button>
  );
}
