import { Download } from 'lucide-react';
import { usePwaInstallPrompt } from '../../../../core/hooks/usePwaInstallPrompt';
import { PwaInstallIosHelp } from './PwaInstallIosHelp';

export function PwaInstallBanner() {
  const {
    shouldShow,
    isIos,
    iosHelpOpen,
    setIosHelpOpen,
    promptInstall,
    dismiss,
  } = usePwaInstallPrompt();

  if (!shouldShow) {
    return null;
  }

  return (
    <>
      <section
        role="region"
        aria-label="Install YGB app"
        data-testid="pwa-install-banner"
        className="border-b border-brand/20 bg-brand-light/70 px-4 py-3 dark:bg-brand/10"
      >
        <div className="mx-auto flex max-w-lg items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
            <Download className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-text">Install YGB</p>
            <p className="mt-0.5 text-xs leading-relaxed text-text-muted">
              {isIos
                ? 'Add Youth Go Budget to your home screen for offline field work.'
                : 'Add Youth Go Budget to your home screen for faster offline access in the field.'}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void promptInstall()}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-dark"
              >
                {isIos ? 'How to install' : 'Install YGB'}
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
        </div>
      </section>
      <PwaInstallIosHelp open={iosHelpOpen} onClose={() => setIosHelpOpen(false)} />
    </>
  );
}
