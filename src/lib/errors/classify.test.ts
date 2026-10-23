import { describe, expect, it } from 'vitest';
import { ApiError } from '@/shared/api/api-client';
import {
  API_REQUEST_TIMEOUT_ERROR_NAME,
  classifyError,
  isApiRequestTimeoutError,
} from './classify';

describe('classifyError', () => {
  it('classifies offline as network', () => {
    expect(classifyError(new Error('x'), { offline: true })).toBe('network');
  });

  it('classifies status 0 as network', () => {
    expect(classifyError(new ApiError(0, 'offline'), { status: 0 })).toBe('network');
  });

  it('classifies fetch TypeError as network', () => {
    const error = new TypeError('Failed to fetch');
    expect(classifyError(error)).toBe('network');
  });

  it('classifies timeout abort as network', () => {
    const error = new DOMException('Aborted', 'AbortError');
    (error as DOMException & { apiRequestTimeout?: boolean }).apiRequestTimeout = true;
    expect(classifyError(error)).toBe('network');
  });

  it('classifies custom timeout error as network', () => {
    const error = new Error('timeout');
    error.name = API_REQUEST_TIMEOUT_ERROR_NAME;
    expect(isApiRequestTimeoutError(error)).toBe(true);
    expect(classifyError(error)).toBe('network');
  });

  it('classifies HTTP 5xx as server', () => {
    expect(classifyError(new ApiError(503, 'down'), { status: 503 })).toBe('server');
  });

  it('classifies HTTP 4xx as client', () => {
    expect(classifyError(new ApiError(422, 'bad'), { status: 422 })).toBe('client');
  });

  it('classifies unknown errors as crash', () => {
    expect(classifyError(new Error('boom'))).toBe('crash');
  });
});
