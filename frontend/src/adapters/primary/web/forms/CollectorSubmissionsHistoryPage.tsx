import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, History, Layers } from 'lucide-react';
import { ApiError } from '../../../../core/api/api-client';
import { EMPTY_COLLECTOR_SUBMISSION_FILTER } from '../../../../core/domain/collector-submission-list.model';
import { COLLECTOR_SUBMISSIONS_ROUTES } from '../../../../core/domain/collector-submissions.routes';
import type { CollectorBreakdown } from '../../../../core/domain/collector-tracker.model';
import { formatFormTypeDisplayLabel } from '../../../../core/domain/form-type.model';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import type { ICollectorSubmissionsApiPort } from '../../../../ports/collector-submissions-api.port';
import type { ISubmissionQueuePort } from '../../../../ports/submission-queue.port';
import { HttpCollectorSubmissionsAdapter } from '../../../secondary/api/collector-submissions-api.adapter';
import { submissionQueue } from '../../../secondary/submission/submission-queue.adapter';

interface CollectorSubmissionsHistoryPageProps {
  submissionsApi?: ICollectorSubmissionsApiPort;
  queue?: ISubmissionQueuePort;
}

function formTypeBadgeClass(formType: string): string {
  switch (formType) {
    case 'BYP':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    case 'IYP':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    case 'LGO':
      return 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20';
    case 'PC':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    default:
      return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20';
  }
}

export function CollectorSubmissionsHistoryPage({
  submissionsApi,
  queue,
}: CollectorSubmissionsHistoryPageProps) {
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const api = useMemo(
    () => submissionsApi ?? new HttpCollectorSubmissionsAdapter(getAccessToken),
    [submissionsApi, getAccessToken]
  );
  const queuePort = queue ?? submissionQueue;

  const [breakdown, setBreakdown] = useState<CollectorBreakdown | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');

      const pendingResult = await Promise.allSettled([queuePort.countPending()]);
      if (!cancelled) {
        setPendingCount(pendingResult[0]?.status === 'fulfilled' ? pendingResult[0].value : 0);
      }

      try {
        const result = await api.fetchMineBreakdown(EMPTY_COLLECTOR_SUBMISSION_FILTER);
        if (!cancelled) {
          setBreakdown(result);
        }
      } catch (err) {
        if (!cancelled) {
          setBreakdown(null);
          setError(err instanceof ApiError || err instanceof Error ? err.message : 'Failed to load submissions.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [api, queuePort]);

  const totalCount = breakdown
    ? breakdown.byFormType.reduce((sum, entry) => sum + entry.count, 0)
    : 0;

  const totalsHint = loading
    ? 'Loading your breakdown…'
    : [
        `${totalCount.toLocaleString('en-UG')} on server`,
        pendingCount > 0 ? `${pendingCount} waiting to sync` : null,
      ]
        .filter(Boolean)
        .join(' · ');

  return (
    <div className="space-y-5" data-testid="collector-submissions-history-page">
      <Link
        to={COLLECTOR_SUBMISSIONS_ROUTES.collectorDashboard}
        className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition hover:underline motion-safe:active:scale-[0.98]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Field dashboard
      </Link>

      <header>
        <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Your performance</p>
        <h1 className="mt-1 flex items-center gap-2 text-lg font-bold text-text">
          <History className="h-5 w-5 text-brand" aria-hidden="true" />
          My submissions
        </h1>
        <p className="mt-1 text-sm text-text-muted">{totalsHint}</p>
      </header>

      {pendingCount > 0 && (
        <div
          data-testid="collector-waiting-to-sync"
          className="rounded-2xl border border-amber-200/80 bg-amber-50/70 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200"
        >
          <span
            className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-amber-500 align-middle motion-safe:animate-pulse"
            aria-hidden="true"
          />
          <span className="font-semibold">{pendingCount} waiting to sync</span>
          <span className="text-amber-800/80 dark:text-amber-200/80">
            {' '}
            — saved on this device until they reach the server.
          </span>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <SummaryStat
          icon={BarChart3}
          label="Total submissions"
          value={loading ? null : totalCount}
          testId="collector-breakdown-total"
        />
        <SummaryStat
          icon={Layers}
          label="Form types"
          value={loading ? null : (breakdown?.byFormType.length ?? 0)}
          testId="collector-breakdown-form-type-count"
        />
      </div>

      {loading && (
        <div className="space-y-3" aria-hidden="true">
          <div className="h-14 animate-pulse rounded-2xl bg-surface-muted" />
          <div className="h-14 animate-pulse rounded-2xl bg-surface-muted" />
        </div>
      )}

      {!loading && !error && breakdown && (
        <BreakdownSection
          title="By form type"
          countLabel={`${breakdown.byFormType.length} ${breakdown.byFormType.length === 1 ? 'type' : 'types'}`}
          empty={breakdown.byFormType.length === 0}
          emptyMessage="No form type data on the server yet."
          testId="collector-breakdown-form-types"
        >
          {breakdown.byFormType.map((entry) => {
            const pct = totalCount > 0 ? Math.round((entry.count / totalCount) * 100) : 0;
            return (
              <li
                key={entry.formType}
                className="rounded-2xl border border-border/80 bg-surface p-3.5 shadow-sm motion-safe:transition-colors"
                data-testid={`breakdown-form-type-${entry.formType}`}
              >
                <div className="mb-2 flex items-center justify-between gap-2 text-xs">
                  <span
                    className={`inline-flex items-center rounded-lg border px-2 py-0.5 font-bold ${formTypeBadgeClass(entry.formType)}`}
                  >
                    {formatFormTypeDisplayLabel(entry.formType)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-text-muted">{pct}%</span>
                    <span className="text-sm font-bold tabular-nums text-text">{entry.count}</span>
                  </div>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand to-nac-blue motion-safe:transition-all motion-safe:duration-500"
                    style={{ width: `${Math.max(pct, 4)}%` }}
                  />
                </div>
              </li>
            );
          })}
        </BreakdownSection>
      )}
    </div>
  );
}

function SummaryStat({
  icon: Icon,
  label,
  value,
  testId,
}: {
  icon: typeof BarChart3;
  label: string;
  value: number | null;
  testId: string;
}) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-4 shadow-sm" data-testid={testId}>
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-text-muted">
        <Icon className="h-4 w-4 text-brand" aria-hidden="true" />
        <span>{label}</span>
      </div>
      {value == null ? (
        <div className="h-7 w-12 animate-pulse rounded bg-surface-muted" />
      ) : (
        <p className="text-2xl font-bold tabular-nums text-text">{value.toLocaleString('en-UG')}</p>
      )}
    </article>
  );
}

function BreakdownSection({
  title,
  countLabel,
  empty,
  emptyMessage,
  testId,
  children,
}: {
  title: string;
  countLabel: string;
  empty: boolean;
  emptyMessage: string;
  testId: string;
  children: ReactNode;
}) {
  return (
    <section data-testid={testId} className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">{title}</h2>
        <span className="text-[11px] font-semibold text-text-muted">{countLabel}</span>
      </div>
      {empty ? (
        <div className="rounded-2xl border border-dashed border-border p-4 text-center text-xs text-text-muted">
          {emptyMessage}
        </div>
      ) : (
        <ul className="space-y-2.5">{children}</ul>
      )}
    </section>
  );
}
