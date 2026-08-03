import { ApiError } from '../api/api-client';

/**
 * Detect unreachable-API failures so login can fall back to the cached offline profile.
 * `navigator.onLine` is unreliable on mobile/PWA and often stays true when the API cannot be reached.
 */
export function isNetworkAuthFailure(error: unknown): boolean {
  if (error instanceof ApiError) {
    return false;
  }
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return (
    error.name === 'TypeError' ||
    message.includes('failed to fetch') ||
    message.includes('networkerror') ||
    message.includes('network request failed') ||
    message.includes('load failed') ||
    message.includes('fetch failed')
  );
}
