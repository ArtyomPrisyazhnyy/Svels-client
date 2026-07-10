import type { SocialLink } from '@/shared/types/social-link';
import { SocialIcon, socialIconClassName } from '@/shared/components/SocialIcon';
import { getSocialLinkDisplayLabel } from '@/shared/types/social-link';
import '../styles/restaurant-social-links.scss';

interface RestaurantSocialLinksProps {
  links: SocialLink[];
}

export function RestaurantSocialLinks({ links }: RestaurantSocialLinksProps) {
  if (links.length === 0) {
    return null;
  }

  return (
    <div className="restaurant-social-links">
      <h2 className="restaurant-social-links__title">Мы в соцсетях</h2>
      <ul className="restaurant-social-links__list">
        {links.map((link) => (
          <li key={link.id}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`restaurant-social-links__item ${socialIconClassName(link.platform)}`}
              aria-label={getSocialLinkDisplayLabel(link)}
              title={getSocialLinkDisplayLabel(link)}
            >
              <SocialIcon platform={link.platform} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
