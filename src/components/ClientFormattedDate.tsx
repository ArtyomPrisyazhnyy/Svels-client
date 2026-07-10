'use client';

import { useEffect, useState } from 'react';

interface ClientFormattedDateProps {
  iso: string;
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
}

export function ClientFormattedDate({
  iso,
  locale = 'ru-RU',
  options,
}: ClientFormattedDateProps) {
  const [formatted, setFormatted] = useState<string | null>(null);

  useEffect(() => {
    setFormatted(new Date(iso).toLocaleString(locale, options));
  }, [iso, locale, options]);

  return <>{formatted ?? '…'}</>;
}
