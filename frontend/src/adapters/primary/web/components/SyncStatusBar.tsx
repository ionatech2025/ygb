import { useAuthStore } from '../../../../core/store/useAuthStore';
import { useSyncStore } from '../../../../core/store/useSyncStore';

function formatLastSynced(value: Date): string {
  return value.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function SyncStatusBar() {
  const isOnline = useAuthStore((state) => state.isOnline);
  const pendingCount = useSyncStore((state) => state.pendingCount);
  const lastSyncedAt = useSyncStore((state) => state.lastSyncedAt);
  const syncing = useSyncStore((state) => state.syncing);

  return (
    <div
      className="border-b border-border bg-surface-muted/90 backdrop-blur-sm"
      data-testid="sync-status-bar"
      role="status"
      aria-live="polite"
      aria-label={`Connection ${isOnline ? 'online' : 'offline'}${pendingCount > 0 ? `, ${pendingCount} pending` : ''}`}
    >
      <div className="mx-auto flex max-w-lg flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 text-[11px] font-medium">
        <span className="inline-flex items-center gap-1.5 text-text">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${
              isOnline ? 'bg-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.25)]' : 'bg-rose-500 shadow-[0_0_0_2px_rgba(244,63,94,0.25)]'
            }`}
            aria-hidden="true"
          />
          {isOnline ? 'Online' : 'Offline'}
          {syncing && isOnline && (
            <span className="text-text-muted font-normal">· Syncing…</span>
          )}
        </span>

        {pendingCount > 0 && (
          <span
            className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 font-semibold text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
            data-testid="sync-pending-count"
          >
            Pending: {pendingCount}
          </span>
        )}

        {lastSyncedAt && (
          <span className="text-text-muted" data-testid="sync-last-synced">
            Last synced: {formatLastSynced(lastSyncedAt)}
          </span>
        )}
      </div>
    </div>
  );
}
