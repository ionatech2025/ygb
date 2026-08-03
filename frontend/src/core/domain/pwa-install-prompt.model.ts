export const PWA_INSTALL_DISMISS_STORAGE_KEY = 'ygb-pwa-install-dismissed';
export const PWA_INSTALL_DISMISS_MINUTES = 30;

export type PwaInstallMode = 'deferred' | 'ios' | 'browser';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function isStandaloneMode(options: {
  displayModeMatches: boolean;
  iosStandalone: boolean;
}): boolean {
  return options.displayModeMatches || options.iosStandalone;
}

/** Includes iPadOS devices that report a desktop user agent. */
export function isIosLikeDevice(
  userAgent: string,
  platform = '',
  maxTouchPoints = 0
): boolean {
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return true;
  }
  return platform === 'MacIntel' && maxTouchPoints > 1;
}

/** @deprecated Use isIosLikeDevice */
export function isIosDevice(userAgent: string): boolean {
  return isIosLikeDevice(userAgent);
}

export function isAndroidDevice(userAgent: string): boolean {
  return /Android/i.test(userAgent);
}

export function resolvePwaInstallMode(options: {
  hasDeferredPrompt: boolean;
  isIosLike: boolean;
}): PwaInstallMode {
  if (options.hasDeferredPrompt) {
    return 'deferred';
  }
  if (options.isIosLike) {
    return 'ios';
  }
  return 'browser';
}

export function canOfferPwaInstall(options: {
  standalone: boolean;
  installed: boolean;
  hasDeferredPrompt: boolean;
  isIosLike: boolean;
  isSecureContext: boolean;
}): boolean {
  if (options.standalone || options.installed) {
    return false;
  }
  if (options.hasDeferredPrompt || options.isIosLike) {
    return true;
  }
  // Offer manual browser install steps on HTTPS (production and localhost).
  return options.isSecureContext;
}

export function isDismissed(storage: StorageLike, now: Date): boolean {
  const raw = storage.getItem(PWA_INSTALL_DISMISS_STORAGE_KEY);
  if (!raw) {
    return false;
  }
  const dismissedUntil = Date.parse(raw);
  if (Number.isNaN(dismissedUntil)) {
    return false;
  }
  return now.getTime() < dismissedUntil;
}

export function recordDismiss(storage: StorageLike, now: Date): void {
  const dismissedUntil = new Date(now);
  dismissedUntil.setMinutes(dismissedUntil.getMinutes() + PWA_INSTALL_DISMISS_MINUTES);
  storage.setItem(PWA_INSTALL_DISMISS_STORAGE_KEY, dismissedUntil.toISOString());
}

export interface PwaInstallGuideSection {
  browser: string;
  steps: string[];
}

export function getPwaInstallGuideSections(options: {
  isAndroid: boolean;
  isIosLike: boolean;
}): PwaInstallGuideSection[] {
  if (options.isIosLike) {
    return [
      {
        browser: 'Safari (iPhone / iPad)',
        steps: [
          'Open this page in Safari (not Chrome or another browser).',
          'Tap the Share button at the bottom of the screen.',
          'Scroll down and choose Add to Home Screen, then tap Add.',
        ],
      },
    ];
  }

  if (options.isAndroid) {
    return [
      {
        browser: 'Chrome (Android)',
        steps: [
          'Open the browser menu (three dots).',
          'Tap Install app or Add to Home screen.',
          'Confirm to add Youth Go Budget App to your home screen.',
        ],
      },
    ];
  }

  return [
    {
      browser: 'Chrome',
      steps: [
        'Look for the install icon in the address bar (⊕ or computer icon).',
        'Click it, then confirm Install Youth Go Budget App.',
      ],
    },
    {
      browser: 'Edge',
      steps: [
        'Open the browser menu (⋯).',
        'Choose More tools → Apps → Install Youth Go Budget App.',
        'Confirm the install prompt to add the app to your device.',
      ],
    },
    {
      browser: 'Safari',
      steps: [
        'On a Mac, open this page in Safari.',
        'From the File menu, choose Add to Dock (or use Share → Add to Dock).',
        'Confirm to keep Youth Go Budget App in your Dock for offline access.',
      ],
    },
  ];
}
