import { describe, expect, it } from 'vitest';
import {
  isSameOriginLocationDatasetRequest,
  pwaManifest,
  workboxRuntimeCaching,
} from '../workbox-config';

describe('workbox-config', () => {
  it('registers StaleWhileRevalidate for same-origin location dataset only', () => {
    const rule = workboxRuntimeCaching.find((entry) => entry.handler === 'StaleWhileRevalidate');
    expect(rule).toBeDefined();
    const appOrigin = 'https://youthgobudgetapp.org';
    expect(
      isSameOriginLocationDatasetRequest(
        new URL('https://youthgobudgetapp.org/api/v1/locations/dataset'),
        appOrigin
      )
    ).toBe(true);
    expect(
      isSameOriginLocationDatasetRequest(
        new URL('https://api.youthgobudgetapp.org/api/v1/locations/dataset'),
        appOrigin
      )
    ).toBe(false);
    expect(rule!.options.cacheName).toBe('ygb-location-dataset');
  });

  it('does not treat cross-origin API hosts as cacheable dataset requests', () => {
    expect(
      isSameOriginLocationDatasetRequest(
        new URL('https://api.youthgobudgetapp.org/api/v1/locations/dataset'),
        'https://youthgobudgetapp.org'
      )
    ).toBe(false);
    expect(
      isSameOriginLocationDatasetRequest(
        new URL('/api/v1/locations/dataset', 'https://localhost:5173'),
        'https://localhost:5173'
      )
    ).toBe(true);
  });

  it('defines a standalone manifest with icons', () => {
    expect(pwaManifest.display).toBe('standalone');
    expect(pwaManifest.name).toBe('Youth Go Budget App');
    expect(pwaManifest.short_name).toBe('Youth Go Budget App');
    expect(pwaManifest.icons.length).toBeGreaterThanOrEqual(4);
    expect(pwaManifest.icons.some((icon) => icon.sizes === '192x192')).toBe(true);
    expect(pwaManifest.icons.some((icon) => icon.sizes === '512x512')).toBe(true);
  });
});
