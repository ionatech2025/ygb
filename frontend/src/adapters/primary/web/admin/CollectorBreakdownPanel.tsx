import { useEffect } from 'react';
import { AlertCircle, Award, BarChart3, Layers, MapPin, Users, X } from 'lucide-react';
import type { CollectorBreakdown } from '../../../../core/domain/collector-tracker.model';
import { formatFormTypeDisplayLabel } from '../../../../core/domain/form-type.model';

function formTypeLabel(formType: string): string {
  return formatFormTypeDisplayLabel(formType);
}

function getFormTypeBadgeClass(formType: string): string {
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

export interface CollectorBreakdownPanelProps {
  collectorName: string;
  rank?: number;
  totalSubmissions?: number;
  breakdown: CollectorBreakdown | null;
  loading?: boolean;
  error?: string;
  onClose?: () => void;
}

export function CollectorBreakdownPanel({
  collectorName,
  rank,
  totalSubmissions,
  breakdown,
  loading = false,
  error = '',
  onClose,
}: CollectorBreakdownPanelProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const totalCount =
    totalSubmissions ??
    (breakdown ? breakdown.byFormType.reduce((acc, curr) => acc + curr.count, 0) : 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 sm:p-6 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => onClose?.()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="collector-breakdown-title"
    >
      <div
        className="relative my-auto flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-2xl ring-1 ring-white/10 dark:ring-white/10 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        data-testid="collector-breakdown-panel"
      >
        {/* Top gradient accent line */}
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-nac-blue via-brand to-nac-orange" />

        {/* Modal Header */}
        <div className="flex items-center justify-between gap-4 border-b border-border/60 px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand/20 via-nac-orange/15 to-nac-blue/20 text-brand ring-1 ring-brand/30 shadow-xs">
              <Users className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Collector Performance
                </span>
                {rank != null && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                    <Award className="h-3 w-3" aria-hidden="true" />
                    Rank #{rank}
                  </span>
                )}
              </div>
              <h3
                id="collector-breakdown-title"
                className="text-lg font-bold tracking-tight text-text truncate sm:text-xl"
              >
                Breakdown for {collectorName}
              </h3>
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close breakdown modal"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/60 bg-surface-muted/50 text-text-muted transition-colors hover:bg-surface-muted hover:text-text focus:outline-none focus:ring-2 focus:ring-brand/40"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-6">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-surface-muted/30 p-3.5 sm:p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
                <BarChart3 className="h-4 w-4 text-brand" aria-hidden="true" />
                <span>Total Submissions</span>
              </div>
              <div className="mt-2 text-2xl font-bold tabular-nums text-text sm:text-3xl">
                {loading ? (
                  <div className="h-7 w-12 animate-pulse rounded bg-surface-muted" />
                ) : (
                  totalCount.toLocaleString('en-UG')
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-surface-muted/30 p-3.5 sm:p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
                <Layers className="h-4 w-4 text-nac-blue dark:text-blue-400" aria-hidden="true" />
                <span>Form Types</span>
              </div>
              <div className="mt-2 text-2xl font-bold tabular-nums text-text sm:text-3xl">
                {loading ? (
                  <div className="h-7 w-12 animate-pulse rounded bg-surface-muted" />
                ) : (
                  breakdown?.byFormType.length ?? 0
                )}
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-2xl border border-border/70 bg-surface-muted/30 p-3.5 sm:p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
                <MapPin className="h-4 w-4 text-nac-orange" aria-hidden="true" />
                <span>Districts Covered</span>
              </div>
              <div className="mt-2 text-2xl font-bold tabular-nums text-text sm:text-3xl">
                {loading ? (
                  <div className="h-7 w-12 animate-pulse rounded bg-surface-muted" />
                ) : (
                  breakdown?.byDistrict.length ?? 0
                )}
              </div>
            </div>
          </div>

          {/* Loading Skeleton State */}
          {loading && (
            <div className="space-y-4 pt-2">
              <div className="h-4 w-32 animate-pulse rounded bg-surface-muted" />
              <div className="h-14 w-full animate-pulse rounded-2xl bg-surface-muted" />
              <div className="h-14 w-full animate-pulse rounded-2xl bg-surface-muted" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div
              role="alert"
              className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300"
            >
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {/* Main Breakdown Content Grid */}
          {!loading && !error && breakdown && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Form Types Section */}
              <section data-testid="collector-breakdown-form-types" className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
                    <Layers className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                    By Form Type
                  </h4>
                  <span className="text-[11px] font-semibold text-text-muted">
                    {breakdown.byFormType.length} {breakdown.byFormType.length === 1 ? 'type' : 'types'}
                  </span>
                </div>

                {breakdown.byFormType.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border p-4 text-center text-xs text-text-muted">
                    No form type data available.
                  </div>
                ) : (
                  <ul className="space-y-2.5">
                    {breakdown.byFormType.map((entry) => {
                      const pct = totalCount > 0 ? Math.round((entry.count / totalCount) * 100) : 0;
                      return (
                        <li
                          key={entry.formType}
                          className="group relative overflow-hidden rounded-2xl border border-border/80 bg-surface/90 p-3.5 shadow-xs transition hover:border-brand/30 hover:bg-surface"
                          data-testid={`breakdown-form-type-${entry.formType}`}
                        >
                          <div className="flex items-center justify-between gap-2 text-xs mb-2">
                            <span className={`inline-flex items-center rounded-lg border px-2 py-0.5 font-bold ${getFormTypeBadgeClass(entry.formType)}`}>
                              {formTypeLabel(entry.formType)}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-text-muted font-medium">{pct}%</span>
                              <span className="font-bold tabular-nums text-text text-sm">{entry.count}</span>
                            </div>
                          </div>
                          {/* Progress bar */}
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-brand to-nac-blue transition-all duration-500"
                              style={{ width: `${Math.max(pct, 4)}%` }}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>

              {/* Districts Section */}
              <section data-testid="collector-breakdown-districts" className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
                    <MapPin className="h-3.5 w-3.5 text-nac-orange" aria-hidden="true" />
                    By District
                  </h4>
                  <span className="text-[11px] font-semibold text-text-muted">
                    {breakdown.byDistrict.length} {breakdown.byDistrict.length === 1 ? 'district' : 'districts'}
                  </span>
                </div>

                {breakdown.byDistrict.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border p-4 text-center text-xs text-text-muted">
                    No district data available.
                  </div>
                ) : (
                  <ul className="space-y-2.5">
                    {breakdown.byDistrict.map((entry) => {
                      const pct = totalCount > 0 ? Math.round((entry.count / totalCount) * 100) : 0;
                      return (
                        <li
                          key={entry.districtId}
                          className="group relative overflow-hidden rounded-2xl border border-border/80 bg-surface/90 p-3.5 shadow-xs transition hover:border-nac-orange/30 hover:bg-surface"
                          data-testid={`breakdown-district-${entry.districtId}`}
                        >
                          <div className="flex items-center justify-between gap-2 text-xs mb-2">
                            <span className="font-bold text-text truncate">{entry.districtName}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-text-muted font-medium">{pct}%</span>
                              <span className="font-bold tabular-nums text-text text-sm">{entry.count}</span>
                            </div>
                          </div>
                          {/* Progress bar */}
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-nac-orange to-brand transition-all duration-500"
                              style={{ width: `${Math.max(pct, 4)}%` }}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between gap-4 border-t border-border/60 bg-surface-muted/30 px-6 py-4 sm:px-8">
          <p className="text-xs text-text-muted hidden sm:block">
            Recalculated dynamically based on active filters.
          </p>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="ml-auto inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-6 text-sm font-bold text-white shadow-sm transition hover:bg-brand-hover active:scale-[0.98]"
            >
              Close Breakdown
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

