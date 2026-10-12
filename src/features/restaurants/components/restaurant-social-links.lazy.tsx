'use client';

import dynamic from 'next/dynamic';
import type { SocialLink } from '@/shared/types/social-link';

const RestaurantSocialLinksLazy = dynamic(
  () =>
    import('./RestaurantSocialLinks').then((module) => ({
      default: module.RestaurantSocialLinks,
    })),
  { ssr: false, loading: () => null },
);

interface RestaurantSocialLinksProps {
  links: SocialLink[];
}

export function RestaurantSocialLinks({ links }: RestaurantSocialLinksProps) {
  if (links.length === 0) {
    return null;
  }

  return <RestaurantSocialLinksLazy links={links} />;
}
