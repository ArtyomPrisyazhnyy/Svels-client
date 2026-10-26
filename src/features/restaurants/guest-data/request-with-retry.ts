export const GUEST_DATA_REQUEST_TIMEOUT_MS = 8_000;
export const GUEST_DATA_RETRY_BACKOFF_MS = 500;

export function isAbortError(error: unknown): boolean {
  return (
    (typeof DOMException !== 'undefined' && error instanceof DOMException && error.name === 'AbortError') ||
    (error instanceof Error && error.name === 'AbortError')
  );
}

function abortError(): Error {
  const error = new Error('The operation was aborted');
  error.name = 'AbortError';
  return error;
}

function statusOf(error: unknown): number | null {
  if (!error || typeof error !== 'object' || !('status' in error)) {
    return null;
  }
  const status = (error as { status?: unknown }).status;
  return typeof status === 'number' ? status : null;
}

export function isRetryableGuestDataError(error: unknown): boolean {
  if (isAbortError(error)) {
    return true;
  }
  const status = statusOf(error);
  if (status == null) {
    return true;
  }
  return status === 0 || status === 408 || status === 429 || status >= 500;
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError());
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(abortError());
    };
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

export async function requestWithTimeoutRetry<T>(options: {
  run: (signal: AbortSignal) => Promise<T>;
  timeoutMs?: number;
  backoffMs?: number;
  signal?: AbortSignal;
  sleep?: (ms: number, signal?: AbortSignal) => Promise<void>;
}): Promise<T> {
  const timeoutMs = options.timeoutMs ?? GUEST_DATA_REQUEST_TIMEOUT_MS;
  const backoffMs = options.backoffMs ?? GUEST_DATA_RETRY_BACKOFF_MS;
  const sleep = options.sleep ?? delay;
  const external = options.signal;

  const once = async (): Promise<T> => {
    if (external?.aborted) {
      throw abortError();
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const onAbort = () => controller.abort();
    external?.addEventListener('abort', onAbort);
    try {
      return await options.run(controller.signal);
    } finally {
      clearTimeout(timer);
      external?.removeEventListener('abort', onAbort);
    }
  };

  try {
    return await once();
  } catch (error) {
    if (external?.aborted || !isRetryableGuestDataError(error)) {
      throw error;
    }
    await sleep(backoffMs, external);
    if (external?.aborted) {
      throw abortError();
    }
    return await once();
  }
}
