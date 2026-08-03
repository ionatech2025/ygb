import { describe, expect, it } from 'vitest';
import {
  PWA_INSTALL_DISMISS_MINUTES,
  PWA_INSTALL_DISMISS_STORAGE_KEY,
  canOfferPwaInstall,
  getPwaInstallGuideSections,
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

  it('records dismiss expiry for thirty minutes', () => {
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
    expect(isDismissed(storageLike, new Date('2026-03-15T10:29:59Z'))).toBe(true);
    expect(isDismissed(storageLike, new Date('2026-03-15T10:30:00Z'))).toBe(false);
    expect(PWA_INSTALL_DISMISS_MINUTES).toBe(30);
  });

  it('offers install on iOS-like devices even without a deferred prompt', () => {
    expect(
      canOfferPwaInstall({
        standalone: false,
        installed: false,
        hasDeferredPrompt: false,
        isIosLike: true,
        isSecureContext: false,
      })
    ).toBe(true);
  });

  it('returns browser-labelled install steps for desktop browsers', () => {
    const sections = getPwaInstallGuideSections({ isAndroid: false, isIosLike: false });

    expect(sections.map((section) => section.browser)).toEqual(['Chrome', 'Edge', 'Safari']);
    expect(sections[0].steps[0]).toMatch(/install icon in the address bar/i);
    expect(sections[1].steps.join(' ')).toMatch(/More tools/i);
    expect(sections[1].steps.join(' ')).toMatch(/Apps/i);
    expect(sections[1].steps.join(' ')).toMatch(/Install Youth Go Budget App/i);
    expect(sections[2].steps.join(' ')).toMatch(/Safari/i);
    expect(sections[2].steps.join(' ')).toMatch(/Mac/i);
  });

  it('returns Android Chrome and Safari mobile install steps when requested', () => {
    const androidSections = getPwaInstallGuideSections({ isAndroid: true, isIosLike: false });
    expect(androidSections).toHaveLength(1);
    expect(androidSections[0].browser).toBe('Chrome (Android)');
    expect(androidSections[0].steps.join(' ')).toMatch(/Install app|Add to Home screen/i);

    const iosSections = getPwaInstallGuideSections({ isAndroid: false, isIosLike: true });
    expect(iosSections).toHaveLength(1);
    expect(iosSections[0].browser).toBe('Safari (iPhone / iPad)');
    expect(iosSections[0].steps.join(' ')).toMatch(/Add to Home Screen/i);
  });
});
