import { Download } from 'lucide-react';
import { usePwaInstallPrompt } from '../../../../core/hooks/usePwaInstallPrompt';
import { PwaInstallBrowserHelp } from './PwaInstallBrowserHelp';
import { PwaInstallIosHelp } from './PwaInstallIosHelp';

interface PwaInstallBannerProps {
  placement?: 'inline' | 'fixed';
}

export function PwaInstallBanner({ placement = 'inline' }: PwaInstallBannerProps) {
  const {
    shouldShow,
    installMode,
    iosHelpOpen,
    setIosHelpOpen,
    browserHelpOpen,
    setBrowserHelpOpen,
    isAndroid,
    promptInstall,
    dismiss,
  } = usePwaInstallPrompt();

  if (!shouldShow) {
    return null;
  }

  const primaryLabel =
    installMode === 'deferred' ? 'Install YGB' : 'How to install';

  const content = (
    <>
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
        <Download className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-text">Install YGB</p>
        <p className="mt-0.5 text-xs leading-relaxed text-text-muted">
          Add Youth Go Budget to your home screen for offline field work and faster access.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void promptInstall()}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            {primaryLabel}
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-text transition hover:bg-surface-muted"
          >
            Not now
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <section
        role="region"
        aria-label="Install YGB app"
        data-testid="pwa-install-banner"
        className={
          placement === 'fixed'
            ? 'pointer-events-none fixed inset-x-0 bottom-4 z-[55] flex justify-center px-4'
            : 'border-b border-brand/20 bg-brand-light/70 px-4 py-3 dark:bg-brand/10'
        }
      >
        <div
          className={
            placement === 'fixed'
              ? 'pointer-events-auto flex w-full max-w-lg items-start gap-3 rounded-2xl border border-brand/20 bg-surface px-4 py-3 shadow-lg shadow-black/10 dark:shadow-black/30'
              : 'mx-auto flex max-w-lg items-start gap-3'
          }
        >
          {content}
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
