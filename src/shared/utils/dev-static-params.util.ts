/**
 * В dev не прогреваем static paths — это снижает риск битого .next-кэша
 * (Cannot find module './vendor-chunks/...') после Hot Reload.
 */
export async function devAwareStaticParams<T>(
  fetchParams: () => Promise<T[]>,
): Promise<T[]> {
  if (process.env.NODE_ENV === 'development') {
    return [];
  }

  return fetchParams();
}
