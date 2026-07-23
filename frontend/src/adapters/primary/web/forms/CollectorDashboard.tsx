import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CloudUpload, Hash, Landmark, RefreshCw } from 'lucide-react';
import { LGO_BUDGET_ALLOCATION_ROUTES } from '../../../../core/domain/lgo-budget-allocation.routes';
import { lgoBudgetAllocationClasses } from '../../../../core/domain/lgo-budget-allocation.theme';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { useSubmissionCountStore } from '../../../../core/store/useSubmissionCountStore';
import { useSyncStore } from '../../../../core/store/useSyncStore';
import { canSubmitSurvey } from '../../../../core/domain/user.model';
import { FormSection } from '../components/forms';
import { PDMSurveyView } from './PDMSurveyView';

function formatSyncTime(value: Date | null): string {
  if (!value) return 'Not synced yet';
  return value.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function CollectorDashboard() {
  const user = useAuthStore((state) => state.user);
  const isOnline = useAuthStore((state) => state.isOnline);
  const getAccessToken = useAuthStore((state) => state.getAccessToken);

  const todayCount = useSubmissionCountStore((state) => state.todayCount);
  const refreshFromLocal = useSubmissionCountStore((state) => state.refreshFromLocal);
  const reconcileWithServer = useSubmissionCountStore((state) => state.reconcileWithServer);

  const pendingCount = useSyncStore((state) => state.pendingCount);
  const lastSyncedAt = useSyncStore((state) => state.lastSyncedAt);
  const syncing = useSyncStore((state) => state.syncing);
  const triggerSync = useSyncStore((state) => state.triggerSync);
  const initializeSync = useSyncStore((state) => state.initialize);

  useEffect(() => {
    void initializeSync();
    void refreshFromLocal();
  }, [initializeSync, refreshFromLocal]);

  useEffect(() => {
    const token = getAccessToken();
    if (isOnline && token) {
      void reconcileWithServer(token);
    }
  }, [isOnline, getAccessToken, reconcileWithServer]);

  const handleRefresh = () => {
    void refreshFromLocal();
    const token = getAccessToken();
    if (isOnline && token) {
      void reconcileWithServer(token);
      void triggerSync();
    }
  };

  if (!canSubmitSurvey(user?.role)) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-800 dark:bg-amber-950/40">
        <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">Survey entry is restricted to data collectors.</p>
      </div>
    );
  }

  const syncedTotal = Math.max(0, todayCount - pendingCount);

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
          value={String(todayCount)}
          hint="All form types combined for today"
        />
        <StatCard
          icon={CloudUpload}
          label="Synced today"
          value={String(syncedTotal)}
          hint={pendingCount > 0 ? `${pendingCount} waiting to sync` : 'Up to date on server'}
        />
        <StatCard
          icon={RefreshCw}
          label="Last synced"
          value={formatSyncTime(lastSyncedAt)}
          hint={isOnline ? (syncing ? 'Syncing now…' : 'Auto-sync when online') : 'Offline — saved locally'}
          compact
        />
      </div>

      <button
        type="button"
        onClick={handleRefresh}
        disabled={syncing}
        className="text-xs font-semibold text-brand underline-offset-2 hover:underline disabled:opacity-60"
      >
        {syncing ? 'Syncing…' : 'Refresh stats'}
      </button>

      <FormSection title="PDM Survey" description="Start a new household survey submission">
        <PDMSurveyView />
      </FormSection>

      <section aria-label="Other collector forms" className="space-y-3">
        <h3 className={lgoBudgetAllocationClasses.otherInterviewsHeading}>Other interviews</h3>
        <Link
          to={LGO_BUDGET_ALLOCATION_ROUTES.index}
          data-testid="lgo-budget-allocation-entry"
          className={lgoBudgetAllocationClasses.dashboardEntryCard}
        >
          <div className={lgoBudgetAllocationClasses.dashboardEntryIcon}>
            <Landmark className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className={lgoBudgetAllocationClasses.dashboardEntryTitle}>LGO Budget Allocation</p>
            <p className={lgoBudgetAllocationClasses.dashboardEntrySummary}>
              Prior-FY sector allocations, rationale, and recommendations — not the LGO Questionnaire.
            </p>
          </div>
          <ArrowRight className={lgoBudgetAllocationClasses.dashboardEntryArrow} aria-hidden="true" />
        </Link>
      </section>
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
