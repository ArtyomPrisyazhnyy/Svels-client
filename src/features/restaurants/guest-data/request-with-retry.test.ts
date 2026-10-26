import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  isRetryableGuestDataError,
  requestWithTimeoutRetry,
} from './request-with-retry.ts';

function statusError(status: number): Error {
  const error = new Error(`status ${status}`);
  return Object.assign(error, { status });
}

describe('guest data request retry', () => {
  it('retries a network failure once after backoff, then returns the second result', async () => {
    let calls = 0;
    let slept = 0;
    const result = await requestWithTimeoutRetry({
      backoffMs: 40,
      sleep: async (ms) => {
        slept = ms;
      },
      run: async () => {
        calls += 1;
        if (calls === 1) {
          throw statusError(0);
        }
        return 'ok';
      },
    });

    assert.equal(result, 'ok');
    assert.equal(calls, 2);
    assert.equal(slept, 40);
  });

  it('does not retry a client error', async () => {
    let calls = 0;
    await assert.rejects(
      () =>
        requestWithTimeoutRetry({
          sleep: async () => {
            throw new Error('should not backoff');
          },
          run: async () => {
            calls += 1;
            throw statusError(400);
          },
        }),
      (error: unknown) => {
        assert.equal((error as { status: number }).status, 400);
        return true;
      },
    );
    assert.equal(calls, 1);
    assert.equal(isRetryableGuestDataError(statusError(400)), false);
    assert.equal(isRetryableGuestDataError(statusError(503)), true);
  });

  it('aborts a hung attempt at the timeout and retries once', async () => {
    let calls = 0;
    await assert.rejects(
      () =>
        requestWithTimeoutRetry({
          timeoutMs: 30,
          backoffMs: 0,
          sleep: async () => {},
          run: (signal) =>
            new Promise((_resolve, reject) => {
              calls += 1;
              const onAbort = () => {
                const error = new Error('aborted');
                error.name = 'AbortError';
                reject(error);
              };
              if (signal.aborted) {
                onAbort();
                return;
              }
              signal.addEventListener('abort', onAbort, { once: true });
            }),
        }),
    );
    assert.equal(calls, 2);
  });

  it('does not start a second attempt when the caller aborts', async () => {
    const controller = new AbortController();
    let calls = 0;
    const pending = requestWithTimeoutRetry({
      signal: controller.signal,
      run: (signal) =>
        new Promise((_, reject) => {
          calls += 1;
          signal.addEventListener(
            'abort',
            () => {
              const error = new Error('aborted');
              error.name = 'AbortError';
              reject(error);
            },
            { once: true },
          );
          controller.abort();
        }),
    });
    await assert.rejects(pending);
    assert.equal(calls, 1);
  });
});
