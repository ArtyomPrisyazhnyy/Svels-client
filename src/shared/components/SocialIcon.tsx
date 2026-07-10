import type { SocialPlatform } from '../types/social-link';

interface SocialIconProps {
  platform: SocialPlatform;
  className?: string;
  title?: string;
}

export function SocialIcon({ platform, className, title }: SocialIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : 'presentation'}
    >
      {title ? <title>{title}</title> : null}
      {renderIconPath(platform)}
    </svg>
  );
}

function renderIconPath(platform: SocialPlatform) {
  switch (platform) {
    case 'telegram':
      return (
        <path
          fill="currentColor"
          d="M9.04 15.314 8.664 20.616c.538 0 .77-.231 1.049-.508l2.517-2.405 5.216 3.817c.957.527 1.637.252 1.898-.871l3.412-16.089h-.001c.305-1.418-.512-2.044-1.421-1.691L2.337 9.854C.968 10.381.987 11.143 2.09 11.483l4.918 1.531 11.398-7.191c.537-.328 1.025-.146.623.19"
        />
      );
    case 'instagram':
      return (
        <>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" />
        </>
      );
    case 'vk':
      return (
        <path
          fill="currentColor"
          d="M19.376 17.123h-1.744c-.66 0-.862-.525-2.049-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.254.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.271.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.49-.085.744-.576.744z"
        />
      );
    case 'facebook':
      return (
        <path
          fill="currentColor"
          d="M13.5 8.5V6.8c0-.8.2-1.2 1.2-1.2H16V3h-2.1C11 3 9.5 4.4 9.5 7v1.5H8v2.8h1.5V21h4V11.3h2.7l.3-2.8H13.5Z"
        />
      );
    case 'youtube':
      return (
        <path
          fill="currentColor"
          d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C17.8 5 12 5 12 5s-5.8 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C6.2 19 12 19 12 19s5.8 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z"
        />
      );
    case 'tiktok':
      return (
        <path
          fill="currentColor"
          d="M16.5 4.2c.8 1.1 1.8 1.9 3.2 2v3.1c-1.2 0-2.3-.4-3.2-1v6.4a5.7 5.7 0 1 1-5.7-5.7c.3 0 .7 0 1 .1v3.2a2.5 2.5 0 1 0 2 2.4V4.2h2.7Z"
        />
      );
    case 'twitter':
      return (
        <path
          fill="currentColor"
          d="M17.7 4H20l-6.2 7.1L21 20h-5.4l-4.2-5.5L6.4 20H4l6.6-7.5L3 4h5.5l3.8 5L17.7 4Zm-1.9 14.3h1.5L7.8 5.6H6.2l9.6 12.7Z"
        />
      );
    case 'whatsapp':
      return (
        <path
          fill="currentColor"
          d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3Zm0 16.2c-1.4 0-2.7-.4-3.8-1.1l-.3-.2-2.8.7.7-2.7-.2-.3A7.2 7.2 0 1 1 12 19.2Zm4-5.4c-.2-.1-1.3-.6-1.5-.7-.2-.1-.4-.1-.6.1-.2.2-.7.8-.9 1-.2.2-.3.2-.6.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.3.1-.4.1-.1.2-.3.3-.4.1-.1.1-.2.2-.3.1-.1 0-.2 0-.3 0-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2 0 1.2.8 2.4 1 2.5.1.2 1.7 2.6 4.1 3.6.6.2 1 .4 1.4.5.6.2 1.1.2 1.5.1.5-.1 1.3-.5 1.5-1 .2-.5.2-1 .1-1.1-.1-.1-.2-.1-.4-.2Z"
        />
      );
    default:
      return (
        <>
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            d="M8.5 12h7M12 8.5v7"
          />
        </>
      );
  }
}

export function socialIconClassName(platform: SocialPlatform): string {
  return `social-icon social-icon--${platform}`;
}
