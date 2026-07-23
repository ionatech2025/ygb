import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PWA_INSTALL_DISMISS_STORAGE_KEY } from '../domain/pwa-install-prompt.model';
import { usePwaInstallPrompt } from './usePwaInstallPrompt';

interface MockBeforeInstallPromptEvent extends Event {
  prompt: ReturnType<typeof vi.fn>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function createDeferredPrompt(outcome: 'accepted' | 'dismissed' = 'accepted'): MockBeforeInstallPromptEvent {
  const prompt = vi.fn().mockResolvedValue(undefined);
  return {
    preventDefault: vi.fn(),
    prompt,
    userChoice: Promise.resolve({ outcome }),
  } as unknown as MockBeforeInstallPromptEvent;
}

function mockMatchMedia(standalone: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query === '(display-mode: standalone)' && standalone,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe('usePwaInstallPrompt', () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    vi.clearAllMocks();
    mockMatchMedia(false);
    Object.defineProperty(window.navigator, 'standalone', {
      configurable: true,
      value: false,
    });
    Object.defineProperty(window.navigator, 'userAgent', {
      configurable: true,
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns canInstall false when running in standalone mode', () => {
    mockMatchMedia(true);

    const { result } = renderHook(() =>
      usePwaInstallPrompt({
        storage: {
          getItem: (key) => storage.get(key) ?? null,
          setItem: (key, value) => storage.set(key, value),
        },
      })
    );

    expect(result.current.canInstall).toBe(false);
    expect(result.current.shouldShow).toBe(false);
  });

  it('stores dismiss flag and suppresses banner when dismissed', async () => {
    const deferredPrompt = createDeferredPrompt();

    const { result } = renderHook(() =>
      usePwaInstallPrompt({
        storage: {
          getItem: (key) => storage.get(key) ?? null,
          setItem: (key, value) => storage.set(key, value),
        },
        now: () => new Date('2026-03-15T10:00:00Z'),
      })
    );

    act(() => {
      window.dispatchEvent(
        Object.assign(new Event('beforeinstallprompt'), deferredPrompt)
      );
    });

    await waitFor(() => expect(result.current.canInstall).toBe(true));

    act(() => {
      result.current.dismiss();
    });

    expect(result.current.shouldShow).toBe(false);
    expect(storage.get(PWA_INSTALL_DISMISS_STORAGE_KEY)).toBeTruthy();
  });

  it('calls deferred prompt when install is requested', async () => {
    const deferredPrompt = createDeferredPrompt('accepted');

    const { result } = renderHook(() =>
      usePwaInstallPrompt({
        storage: {
          getItem: (key) => storage.get(key) ?? null,
          setItem: (key, value) => storage.set(key, value),
        },
      })
    );

    act(() => {
      window.dispatchEvent(
        Object.assign(new Event('beforeinstallprompt'), deferredPrompt)
      );
    });

    await waitFor(() => expect(result.current.canInstall).toBe(true));

    await act(async () => {
      await result.current.promptInstall();
    });

    expect(deferredPrompt.prompt).toHaveBeenCalledTimes(1);
    expect(result.current.shouldShow).toBe(false);
  });

  it('enables iOS install help instead of deferred prompt', async () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      configurable: true,
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    });

    const { result } = renderHook(() =>
      usePwaInstallPrompt({
        storage: {
          getItem: (key) => storage.get(key) ?? null,
          setItem: (key, value) => storage.set(key, value),
        },
      })
    );

    expect(result.current.isIos).toBe(true);
    expect(result.current.canInstall).toBe(true);

    act(() => {
      result.current.promptInstall();
    });

    expect(result.current.iosHelpOpen).toBe(true);
  });

  it('hides banner after appinstalled event', async () => {
    const deferredPrompt = createDeferredPrompt();

    const { result } = renderHook(() =>
      usePwaInstallPrompt({
        storage: {
          getItem: (key) => storage.get(key) ?? null,
          setItem: (key, value) => storage.set(key, value),
        },
      })
    );

    act(() => {
      window.dispatchEvent(
        Object.assign(new Event('beforeinstallprompt'), deferredPrompt)
      );
    });

    await waitFor(() => expect(result.current.shouldShow).toBe(true));

    act(() => {
      window.dispatchEvent(new Event('appinstalled'));
    });

    expect(result.current.shouldShow).toBe(false);
  });
});
