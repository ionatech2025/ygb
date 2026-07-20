import { useEffect, useState } from 'react';
import { CloudUpload, Hash, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { canSubmitSurvey } from '../../../../core/domain/user.model';
import {
  fetchCollectorSubmissionCount,
  fetchCollectorSyncStatus,
} from '../../../../core/api/collector-api';
import { FormSection } from '../components/forms';
import { PDMSurveyView } from './PDMSurveyView';

function formatSyncTime(value: string | null): string {
  if (!value) return 'Not synced yet';
  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function CollectorDashboard() {
  const user = useAuthStore((state) => state.user);
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const isOnline = useAuthStore((state) => state.isOnline);

  const [dailyCount, setDailyCount] = useState<number | null>(null);
  const [syncedCount, setSyncedCount] = useState<number | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [statsError, setStatsError] = useState('');
  const [loadingStats, setLoadingStats] = useState(true);

  const loadStats = async () => {
    const token = getAccessToken();
    if (!token || !isOnline) {
      setLoadingStats(false);
      if (!isOnline) setStatsError('Stats unavailable while offline.');
      return;
    }

    setLoadingStats(true);
    setStatsError('');
    try {
      const [count, syncStatus] = await Promise.all([
        fetchCollectorSubmissionCount(token),
        fetchCollectorSyncStatus(token),
      ]);
      setDailyCount(count);
      setSyncedCount(syncStatus.syncedCount);
      setLastSyncedAt(syncStatus.lastSyncedAt);
    } catch (err) {
      setStatsError(err instanceof Error ? err.message : 'Unable to load dashboard stats.');
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    void loadStats();
  }, [isOnline]);

  if (!canSubmitSurvey(user?.role)) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-800 dark:bg-amber-950/40">
        <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">Survey entry is restricted to data collectors.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-text">Field dashboard</h2>
        <p className="text-sm text-text-muted">Welcome back, {user?.fullName}.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          icon={Hash}
          label="Today's submissions"
          value={loadingStats ? '…' : String(dailyCount ?? '—')}
          hint="GET /api/v1/submissions/my-count"
        />
        <StatCard
          icon={CloudUpload}
          label="Synced total"
          value={loadingStats ? '…' : String(syncedCount ?? '—')}
          hint="GET /api/v1/submissions/my-sync-status"
        />
        <StatCard
          icon={RefreshCw}
          label="Last synced"
          value={loadingStats ? '…' : formatSyncTime(lastSyncedAt)}
          hint={isOnline ? 'Live from server' : 'Offline mode'}
          compact
        />
      </div>

      {statsError && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          {statsError}
        </p>
      )}

      {!loadingStats && isOnline && (
        <button
          type="button"
          onClick={() => void loadStats()}
          className="text-xs font-semibold text-brand underline-offset-2 hover:underline"
        >
          Refresh stats
        </button>
      )}

      <FormSection title="PDM Survey" description="Start a new household survey submission">
        <PDMSurveyView />
      </FormSection>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  compact = false,
}: {
  icon: typeof Hash;
  label: string;
  value: string;
  hint: string;
  compact?: boolean;
}) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-brand">
        <Icon className="h-4 w-4" aria-hidden="true" />
        <p className="text-[11px] font-bold uppercase tracking-wide text-text-muted">{label}</p>
      </div>
      <p className={`font-bold text-text ${compact ? 'text-sm leading-snug' : 'text-2xl'}`}>{value}</p>
      <p className="mt-1 text-[10px] text-text-muted">{hint}</p>
    </article>
  );
}
