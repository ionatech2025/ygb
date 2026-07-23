export const PWA_INSTALL_DISMISS_STORAGE_KEY = 'ygb-pwa-install-dismissed';
export const PWA_INSTALL_DISMISS_DAYS = 7;

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

export function isIosDevice(userAgent: string): boolean {
  return /iPad|iPhone|iPod/.test(userAgent);
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
  dismissedUntil.setDate(dismissedUntil.getDate() + PWA_INSTALL_DISMISS_DAYS);
  storage.setItem(PWA_INSTALL_DISMISS_STORAGE_KEY, dismissedUntil.toISOString());
}
