import { Download, X } from 'lucide-react';
import { usePwaInstallPrompt } from '../../../../core/hooks/usePwaInstallPrompt';
import { PwaInstallBrowserHelp } from './PwaInstallBrowserHelp';
import { PwaInstallIosHelp } from './PwaInstallIosHelp';

interface PwaInstallBannerProps {
  placement?: 'inline' | 'fixed';
}

export function PwaInstallBanner({ placement = 'inline' }: PwaInstallBannerProps) {
  const {
    shouldShow,
    canNativeInstall,
    iosHelpOpen,
    setIosHelpOpen,
    browserHelpOpen,
    setBrowserHelpOpen,
    isAndroid,
    promptInstall,
    showInstallGuide,
    dismiss,
  } = usePwaInstallPrompt();

  if (!shouldShow) {
    return null;
  }

  const isFixed = placement === 'fixed';

  return (
    <>
      <section
        role="region"
        aria-label="Install YGB app"
        data-testid="pwa-install-banner"
        className={
          isFixed
            ? 'pointer-events-none fixed inset-x-0 bottom-3 z-[55] flex justify-center px-3'
            : 'border-b border-brand/20 bg-brand-light/60 px-3 py-2 dark:bg-brand/10'
        }
      >
        <div
          className={
            isFixed
              ? 'pointer-events-auto flex w-full max-w-lg items-center gap-2 rounded-xl border border-brand/20 bg-surface/95 px-2.5 py-2 shadow-md shadow-black/10 backdrop-blur-sm dark:shadow-black/30'
              : 'mx-auto flex max-w-lg items-center gap-2'
          }
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <p className="min-w-0 flex-1 text-xs leading-snug text-text">
            <span className="font-semibold">Install YGB</span>
            <span className="text-text-muted"> · Offline field access</span>
          </p>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
            {canNativeInstall && (
              <button
                type="button"
                onClick={() => void promptInstall()}
                className="inline-flex min-h-9 items-center justify-center rounded-lg bg-brand px-2.5 text-xs font-semibold text-white transition hover:bg-brand-dark"
              >
                Install
              </button>
            )}
            <button
              type="button"
              onClick={showInstallGuide}
              className={
                canNativeInstall
                  ? 'inline-flex min-h-9 items-center justify-center rounded-lg border border-border bg-surface px-2.5 text-xs font-semibold text-text transition hover:bg-surface-muted'
                  : 'inline-flex min-h-9 items-center justify-center rounded-lg bg-brand px-2.5 text-xs font-semibold text-white transition hover:bg-brand-dark'
              }
            >
              How to install
            </button>
            {isFixed ? (
              <button
                type="button"
                onClick={dismiss}
                aria-label="Not now"
                className="inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-muted transition hover:bg-surface-muted"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={dismiss}
                className="inline-flex min-h-9 items-center justify-center rounded-lg border border-border bg-surface px-2.5 text-xs font-semibold text-text transition hover:bg-surface-muted"
              >
                Not now
              </button>
            )}
          </div>
        </div>
      </section>
      <PwaInstallIosHelp open={iosHelpOpen} onClose={() => setIosHelpOpen(false)} />
      <PwaInstallBrowserHelp
        open={browserHelpOpen}
        onClose={() => setBrowserHelpOpen(false)}
        isAndroid={isAndroid}
      />
    </>
  );
}
