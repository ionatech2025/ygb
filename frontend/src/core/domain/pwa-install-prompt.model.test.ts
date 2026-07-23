import { describe, expect, it } from 'vitest';
import {
  PWA_INSTALL_DISMISS_DAYS,
  PWA_INSTALL_DISMISS_STORAGE_KEY,
  canOfferPwaInstall,
  isDismissed,
  isIosLikeDevice,
  isStandaloneMode,
  recordDismiss,
  resolvePwaInstallMode,
} from './pwa-install-prompt.model';

describe('pwa-install-prompt.model', () => {
  it('detects standalone display mode', () => {
    expect(isStandaloneMode({ displayModeMatches: true, iosStandalone: false })).toBe(true);
    expect(isStandaloneMode({ displayModeMatches: false, iosStandalone: true })).toBe(true);
    expect(isStandaloneMode({ displayModeMatches: false, iosStandalone: false })).toBe(false);
  });

  it('detects iOS and iPadOS user agents', () => {
    expect(isIosLikeDevice('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)')).toBe(true);
    expect(isIosLikeDevice('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'MacIntel', 5)).toBe(true);
    expect(isIosLikeDevice('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')).toBe(false);
  });

  it('offers install on secure contexts even without a deferred prompt', () => {
    expect(
      canOfferPwaInstall({
        standalone: false,
        installed: false,
        hasDeferredPrompt: false,
        isIosLike: false,
        isSecureContext: true,
      })
    ).toBe(true);
    expect(
      canOfferPwaInstall({
        standalone: false,
        installed: false,
        hasDeferredPrompt: false,
        isIosLike: false,
        isSecureContext: false,
      })
    ).toBe(false);
  });

  it('resolves browser install mode when no deferred prompt is available', () => {
    expect(resolvePwaInstallMode({ hasDeferredPrompt: false, isIosLike: false })).toBe('browser');
    expect(resolvePwaInstallMode({ hasDeferredPrompt: true, isIosLike: true })).toBe('deferred');
  });

  it('records dismiss expiry for seven days', () => {
    const storage = new Map<string, string>();
    const now = new Date('2026-03-15T10:00:00Z');
    const storageLike = {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    };

    recordDismiss(storageLike, now);

    const stored = storage.get(PWA_INSTALL_DISMISS_STORAGE_KEY);
    expect(stored).toBeTruthy();
    expect(isDismissed(storageLike, now)).toBe(true);
    expect(isDismissed(storageLike, new Date('2026-03-22T09:59:59Z'))).toBe(true);
    expect(isDismissed(storageLike, new Date('2026-03-22T10:00:00Z'))).toBe(false);
    expect(PWA_INSTALL_DISMISS_DAYS).toBe(7);
  });
});
