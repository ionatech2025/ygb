import { describe, expect, it } from 'vitest';
import { pwaManifest, workboxRuntimeCaching } from '../workbox-config';

describe('workbox-config', () => {
  it('registers StaleWhileRevalidate for the Uganda location dataset', () => {
    const rule = workboxRuntimeCaching.find((entry) => entry.handler === 'StaleWhileRevalidate');
    expect(rule).toBeDefined();
    expect(rule!.urlPattern({ url: new URL('https://example.com/api/v1/locations/dataset') })).toBe(true);
    expect(rule!.options.cacheName).toBe('ygb-location-dataset');
  });

  it('defines a standalone manifest with icons', () => {
    expect(pwaManifest.display).toBe('standalone');
    expect(pwaManifest.name).toBe('Youth Go Budget App');
    expect(pwaManifest.short_name).toBe('YGB');
    expect(pwaManifest.icons.length).toBeGreaterThanOrEqual(1);
  });
});
