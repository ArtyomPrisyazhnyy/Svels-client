const overlayStack: Array<() => void> = [];

export function pushOverlay(onEscape: () => void): () => void {
  overlayStack.push(onEscape);
  return () => {
    const index = overlayStack.lastIndexOf(onEscape);
    if (index >= 0) {
      overlayStack.splice(index, 1);
    }
  };
}

export function isTopOverlay(onEscape: () => void): boolean {
  return overlayStack[overlayStack.length - 1] === onEscape;
}

export function subscribeEscapeKey(onEscape: () => void): () => void {
  const handler = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') {
      return;
    }
    if (isTopOverlay(onEscape)) {
      event.preventDefault();
      onEscape();
    }
  };

  document.addEventListener('keydown', handler);
  return () => document.removeEventListener('keydown', handler);
}
