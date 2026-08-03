import { Download } from 'lucide-react';
import { getPwaInstallGuideSections } from '../../../../core/domain/pwa-install-prompt.model';

interface PwaInstallBrowserHelpProps {
  open: boolean;
  onClose: () => void;
  isAndroid: boolean;
}

export function PwaInstallBrowserHelp({ open, onClose, isAndroid }: PwaInstallBrowserHelpProps) {
  if (!open) {
    return null;
  }

  const sections = getPwaInstallGuideSections({ isAndroid, isIosLike: false });

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 px-4 pb-6 pt-10 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-browser-help-title"
      data-testid="pwa-browser-help"
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-xl">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand">
            <Download className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="pwa-browser-help-title" className="text-base font-bold text-text">
              Install YGB on this device
            </h2>
            <div className="mt-3 space-y-4">
              {sections.map((section) => (
                <div key={section.browser}>
                  <p className="text-sm font-semibold text-text">{section.browser}</p>
                  <ol className="mt-1.5 space-y-1.5 text-sm text-text-muted">
                    {section.steps.map((step, index) => (
                      <li key={step}>
                        {index + 1}. {step}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
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
