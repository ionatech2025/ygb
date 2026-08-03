import { describe, expect, it } from 'vitest';
import { ApiError } from '../api/api-client';
import { isNetworkAuthFailure } from './auth-network';

describe('isNetworkAuthFailure', () => {
  it('treats Failed to fetch as a network failure', () => {
    expect(isNetworkAuthFailure(new TypeError('Failed to fetch'))).toBe(true);
  });

  it('treats generic network errors as network failures', () => {
    expect(isNetworkAuthFailure(new Error('NetworkError when attempting to fetch resource.'))).toBe(
      true
    );
    expect(isNetworkAuthFailure(new Error('Network request failed'))).toBe(true);
  });

  it('does not treat credential ApiErrors as network failures', () => {
    expect(isNetworkAuthFailure(new ApiError('Unauthorized', 401))).toBe(false);
  });

  it('does not treat unrelated errors as network failures', () => {
    expect(isNetworkAuthFailure(new Error('Initial online login required on this device'))).toBe(
      false
    );
  });
});
