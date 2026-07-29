export const PWA_THEME_COLOR = '#359661';
export const PWA_BACKGROUND_COLOR = '#f8faf9';

export const pwaManifest = {
  name: 'Youth Go Budget App',
  short_name: 'Youth Go Budget App',
  description: 'Offline-first PDM field data collection for Youth Go Budget.',
  theme_color: PWA_THEME_COLOR,
  background_color: PWA_BACKGROUND_COLOR,
  display: 'standalone' as const,
  start_url: '/',
  scope: '/',
  icons: [
    {
      src: 'favicon.svg',
      sizes: 'any',
      type: 'image/svg+xml',
      purpose: 'any',
    },
    {
      src: 'pwa-192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: 'pwa-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: 'pwa-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
};

/**
 * Match same-origin API paths only. In production the API lives on a separate host
 * (VITE_API_BASE_URL); intercepting those cross-origin fetches breaks login and dataset loads.
 */
export function isSameOriginLocationDatasetRequest(url: URL, appOrigin?: string): boolean {
  if (url.pathname !== '/api/v1/locations/dataset') {
    return false;
  }

  const origin =
    appOrigin ??
    (typeof self !== 'undefined' && 'location' in self ? self.location.origin : undefined);

  return origin !== undefined && url.origin === origin;
}

/** App shell assets are precached (CacheFirst). Runtime rules for network resources only. */
export const workboxRuntimeCaching = [
  {
    // Inline the matcher: vite-plugin-pwa does not bundle imported helpers into sw.js.
    urlPattern: ({ url }: { url: URL }) =>
      url.pathname === '/api/v1/locations/dataset' &&
      typeof self !== 'undefined' &&
      'location' in self &&
      url.origin === self.location.origin,
    handler: 'StaleWhileRevalidate' as const,
    options: {
      cacheName: 'ygb-location-dataset',
      expiration: {
        maxEntries: 2,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
];
