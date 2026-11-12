const loadedScripts = new Map<string, Promise<void>>();

export function loadScript(src: string, id?: string): Promise<void> {
  const existing = loadedScripts.get(src);
  if (existing) {
    return existing;
  }

  const promise = new Promise<void>((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('document_unavailable'));
      return;
    }

    const byId = id ? document.getElementById(id) : null;
    if (byId) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    if (id) {
      script.id = id;
    }
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`script_load_failed:${src}`));
    document.head.appendChild(script);
  });

  loadedScripts.set(src, promise);
  return promise;
}
