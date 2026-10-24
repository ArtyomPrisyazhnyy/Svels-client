'use client';

import { useEffect, useState } from 'react';
import './offline-banner.scss';

export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const sync = () => {
      setOffline(!navigator.onLine);
    };

    sync();
    window.addEventListener('online', sync);
    window.addEventListener('offline', sync);

    return () => {
      window.removeEventListener('online', sync);
      window.removeEventListener('offline', sync);
    };
  }, []);

  if (!offline) {
    return null;
  }

  return (
    <div className="offline-banner" role="status" data-testid="offline-banner">
      <p className="offline-banner__text">Нет подключения к интернету</p>
    </div>
  );
}
