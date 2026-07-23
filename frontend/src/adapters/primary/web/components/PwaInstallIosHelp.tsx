import { Smartphone } from 'lucide-react';

interface PwaInstallIosHelpProps {
  open: boolean;
  onClose: () => void;
}

export function PwaInstallIosHelp({ open, onClose }: PwaInstallIosHelpProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 px-4 pb-6 pt-10 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-ios-help-title"
      data-testid="pwa-ios-help"
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-xl">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand">
            <Smartphone className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="pwa-ios-help-title" className="text-base font-bold text-text">
              Add YGB to your home screen
            </h2>
            <ol className="mt-3 space-y-2 text-sm text-text-muted">
              <li>1. Tap the Share button in Safari.</li>
              <li>2. Scroll down and choose Add to Home Screen.</li>
              <li>3. Confirm the name, then tap Add.</li>
            </ol>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
