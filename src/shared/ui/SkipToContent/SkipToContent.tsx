import './SkipToContent.scss';

const MAIN_CONTENT_ID = 'main-content';

export function mainContentId(): string {
  return MAIN_CONTENT_ID;
}

export function SkipToContent() {
  return (
    <a className="skip-to-content" href={`#${MAIN_CONTENT_ID}`}>
      Перейти к содержимому
    </a>
  );
}
