export const PWA_THEME_COLOR = '#359661';
export const PWA_BACKGROUND_COLOR = '#f8faf9';

export const pwaManifest = {
  name: 'Youth Go Budget App',
  short_name: 'YGB',
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
  ],
};

/** App shell assets are precached (CacheFirst). Runtime rules for network resources only. */
export const workboxRuntimeCaching = [
  {
    urlPattern: ({ url }: { url: URL }) => url.pathname === '/api/v1/locations/dataset',
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
