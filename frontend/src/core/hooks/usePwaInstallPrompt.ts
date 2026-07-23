import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  type PwaInstallMode,
  type StorageLike,
  canOfferPwaInstall,
  isDismissed,
  isAndroidDevice,
  isIosLikeDevice,
  isStandaloneMode,
  recordDismiss,
  resolvePwaInstallMode,
} from '../domain/pwa-install-prompt.model';

export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface UsePwaInstallPromptOptions {
  storage?: StorageLike;
  now?: () => Date;
}

function detectStandalone(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const iosStandalone = Boolean(
    (window.navigator as Navigator & { standalone?: boolean }).standalone
  );
  const displayModeMatches =
    typeof window.matchMedia === 'function'
      ? window.matchMedia('(display-mode: standalone)').matches
      : false;

  return isStandaloneMode({ displayModeMatches, iosStandalone });
}

function defaultStorage(): StorageLike {
  return window.localStorage;
}

export function usePwaInstallPrompt(options: UsePwaInstallPromptOptions = {}) {
  const storage = options.storage ?? (typeof window !== 'undefined' ? defaultStorage() : undefined);
  const now = options.now ?? (() => new Date());

  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [canNativeInstall, setCanNativeInstall] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(() =>
    storage ? isDismissed(storage, now()) : false
  );
  const [iosHelpOpen, setIosHelpOpen] = useState(false);
  const [browserHelpOpen, setBrowserHelpOpen] = useState(false);

  const standalone = useMemo(() => detectStandalone(), []);
  const isIosLike = useMemo(
    () =>
      typeof navigator !== 'undefined'
        ? isIosLikeDevice(navigator.userAgent, navigator.platform, navigator.maxTouchPoints)
        : false,
    []
  );
  const isAndroid = useMemo(
    () => (typeof navigator !== 'undefined' ? isAndroidDevice(navigator.userAgent) : false),
    []
  );
  const isSecureContext = typeof window !== 'undefined' && window.isSecureContext;

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      deferredPromptRef.current = event as BeforeInstallPromptEvent;
      setCanNativeInstall(true);
    };

    const onAppInstalled = () => {
      setInstalled(true);
      deferredPromptRef.current = null;
      setCanNativeInstall(false);
      setIosHelpOpen(false);
      setBrowserHelpOpen(false);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const installMode: PwaInstallMode = resolvePwaInstallMode({
    hasDeferredPrompt: canNativeInstall,
    isIosLike,
  });

  const canInstall = canOfferPwaInstall({
    standalone,
    installed,
    hasDeferredPrompt: canNativeInstall,
    isIosLike,
    isSecureContext,
  });
  const shouldShow = canInstall && !dismissed;

  const dismiss = useCallback(() => {
    if (storage) {
      recordDismiss(storage, now());
    }
    setDismissed(true);
    setIosHelpOpen(false);
    setBrowserHelpOpen(false);
  }, [now, storage]);

  const showInstallGuide = useCallback(() => {
    if (isIosLike) {
      setIosHelpOpen(true);
      return;
    }
    setBrowserHelpOpen(true);
  }, [isIosLike]);

  const clearDeferredPrompt = useCallback(() => {
    deferredPromptRef.current = null;
    setCanNativeInstall(false);
  }, []);

  const promptInstall = useCallback(async () => {
    const promptEvent = deferredPromptRef.current;
    if (!promptEvent) {
      showInstallGuide();
      return;
    }

    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice.outcome === 'accepted') {
        setInstalled(true);
      }
      setIosHelpOpen(false);
      setBrowserHelpOpen(false);
    } catch {
      showInstallGuide();
    } finally {
      clearDeferredPrompt();
    }
  }, [clearDeferredPrompt, showInstallGuide]);

  return {
    canInstall,
    canNativeInstall,
    shouldShow,
    installMode,
    isIos: isIosLike,
    isAndroid,
    iosHelpOpen,
    setIosHelpOpen,
    browserHelpOpen,
    setBrowserHelpOpen,
    promptInstall,
    showInstallGuide,
    dismiss,
  };
}
