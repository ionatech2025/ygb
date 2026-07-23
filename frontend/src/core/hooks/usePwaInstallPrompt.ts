import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  type StorageLike,
  isDismissed,
  isIosDevice,
  isStandaloneMode,
  recordDismiss,
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

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(() =>
    storage ? isDismissed(storage, now()) : false
  );
  const [iosHelpOpen, setIosHelpOpen] = useState(false);

  const standalone = useMemo(() => detectStandalone(), []);
  const isIos = useMemo(
    () => (typeof navigator !== 'undefined' ? isIosDevice(navigator.userAgent) : false),
    []
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
      setIosHelpOpen(false);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const canInstall = !standalone && !installed && (Boolean(deferredPrompt) || isIos);
  const shouldShow = canInstall && !dismissed;

  const dismiss = useCallback(() => {
    if (storage) {
      recordDismiss(storage, now());
    }
    setDismissed(true);
    setIosHelpOpen(false);
  }, [now, storage]);

  const promptInstall = useCallback(async () => {
    if (isIos) {
      setIosHelpOpen(true);
      return;
    }

    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setInstalled(true);
    }
    setDeferredPrompt(null);
    setIosHelpOpen(false);
  }, [deferredPrompt, isIos]);

  return {
    canInstall,
    shouldShow,
    isIos,
    iosHelpOpen,
    setIosHelpOpen,
    promptInstall,
    dismiss,
  };
}
