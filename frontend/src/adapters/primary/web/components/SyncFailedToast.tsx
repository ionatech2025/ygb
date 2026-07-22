import { AlertTriangle, X } from 'lucide-react';
import { useEffect } from 'react';
import { useSyncStore } from '../../../../core/store/useSyncStore';

const AUTO_DISMISS_MS = 5000;

export function SyncFailedToast() {
  const lastSyncError = useSyncStore((state) => state.lastSyncError);
  const clearSyncError = useSyncStore((state) => state.clearSyncError);

  useEffect(() => {
    if (!lastSyncError) return;
    const timer = window.setTimeout(() => clearSyncError(), AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [lastSyncError, clearSyncError]);

  if (!lastSyncError) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4"
      role="alert"
      aria-live="assertive"
    >
      <div
        className="pointer-events-auto flex max-w-lg items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900 shadow-lg shadow-amber-900/10 dark:border-amber-900/50 dark:bg-amber-950/90 dark:text-amber-100 dark:shadow-black/30"
        data-testid="sync-failed-toast"
      >
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wide text-amber-800 dark:text-amber-200">
            Sync failed
          </p>
          <p className="mt-0.5 text-xs leading-relaxed">{lastSyncError}</p>
        </div>
        <button
          type="button"
          onClick={clearSyncError}
          aria-label="Dismiss sync error"
          className="inline-flex min-h-8 min-w-8 shrink-0 items-center justify-center rounded-lg text-amber-700 transition hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-900/50"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
