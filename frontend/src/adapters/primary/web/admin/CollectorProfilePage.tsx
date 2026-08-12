import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Filter, UserCircle } from 'lucide-react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { ApiError } from '../../../../core/api/api-client';
import {
  collectorProfileFilterFromSearchParams,
  type CollectorProfileFilter,
} from '../../../../core/domain/collector-profile-filter.model';
import {
  formatAdminTimestamp,
  formatFormTypeLabel,
  formatSubmissionStatus,
} from '../../../../core/domain/submission-detail-fields';
import { FORM_TYPE_OPTIONS } from '../../../../core/domain/form-type.model';
import { formatFinancialYearPeriodLabel } from '../../../../core/financial-year-period';
import type { FinancialYearPeriodHalf } from '../../../../core/domain/financial-year-period.model';
import type { SubmissionSummary } from '../../../../core/domain/submission-admin.model';
import { HttpDashboardAdapter } from '../../../secondary/api/dashboard-api.adapter';
import { HttpUserAdapter } from '../../../secondary/api/http-user.adapter';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { FormField, FormSelect, formControlClassName } from '../components/forms';
import type { IUserRepositoryPort } from '../../../../ports/user-repository.port';
import type { IDashboardApiPort } from '../../../../ports/dashboard-api.port';

function labelFromFinancialYearPeriodKey(key: string): string {
  const match = key.match(/^(JAN_JUN|JUL_DEC)_(\d+)$/);
  if (!match) {
    return key;
  }
  return formatFinancialYearPeriodLabel({
    period: match[1] as FinancialYearPeriodHalf,
    year: Number(match[2]),
  });
}

function renderStatusBadge(status: string) {
  const formatted = formatSubmissionStatus(status);
  switch (status.toUpperCase()) {
    case 'SYNCED':
      return (
        <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          {formatted}
        </span>
      );
    case 'FAILED':
      return (
        <span className="inline-flex items-center rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-0.5 text-xs font-bold text-rose-600 dark:text-rose-400">
          {formatted}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
          {formatted}
        </span>
      );
  }
}

export interface CollectorProfilePageProps {
  userAdmin?: IUserRepositoryPort;
  dashboardApi?: IDashboardApiPort;
  collectorName?: string;
}

const PAGE_SIZE = 10;

export function CollectorProfilePage({
  userAdmin: userAdminProp,
  dashboardApi: dashboardApiProp,
  collectorName: collectorNameProp,
}: CollectorProfilePageProps = {}) {
  const { id: collectorId = '' } = useParams();
  const location = useLocation();
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const userAdmin = useMemo(
    () => userAdminProp ?? new HttpUserAdapter(getAccessToken),
    [userAdminProp, getAccessToken]
  );
  const dashboardApi = useMemo(
    () => dashboardApiProp ?? new HttpDashboardAdapter(getAccessToken),
    [dashboardApiProp, getAccessToken]
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const filter = collectorProfileFilterFromSearchParams(searchParams);
  const page = Math.max(0, Number(searchParams.get('page') ?? '0') || 0);

  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [rows, setRows] = useState<SubmissionSummary[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [districts, setDistricts] = useState<Array<{ id: string; name: string }>>([]);
  const [financialYearPeriods, setFinancialYearPeriods] = useState<string[]>([]);

  const navigationState = location.state as { collectorName?: string } | null;
  const collectorName = collectorNameProp ?? navigationState?.collectorName ?? 'Data Collector';

  useEffect(() => {
    let cancelled = false;
    void dashboardApi.fetchFilterOptions().then((options) => {
      if (!cancelled) {
        setDistricts(options.districts);
        setFinancialYearPeriods(options.financialYearPeriods ?? []);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [dashboardApi]);

  const filterKey = JSON.stringify({ ...filter, page, collectorId });

  useEffect(() => {
    if (!collectorId) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await userAdmin.getCollectorSubmissions(collectorId, filter, page, PAGE_SIZE);
        if (!cancelled) {
          setRows(result.items);
          setTotalPages(result.totalPages);
          setTotalElements(result.totalElements);
        }
      } catch (err) {
        if (!cancelled) {
          setRows([]);
          setTotalPages(0);
          setTotalElements(0);
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
  }, [userAdmin, collectorId, filterKey, page]);

  const showTableSkeleton = loading && rows.length === 0;

  const updateFilter = (patch: Partial<CollectorProfileFilter>) => {
    const next = { ...filter, ...patch };
    const params = new URLSearchParams();
    if (next.districtId) params.set('districtId', next.districtId);
    if (next.formType) params.set('formType', next.formType);
    if (next.dateFrom) params.set('dateFrom', next.dateFrom);
    if (next.dateTo) params.set('dateTo', next.dateTo);
    if (next.financialYearPeriod) params.set('financialYearPeriod', next.financialYearPeriod);
    setSearchParams(params, { replace: true });
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const goToPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams);
    if (nextPage <= 0) {
      params.delete('page');
    } else {
      params.set('page', String(nextPage));
    }
    setSearchParams(params, { replace: true });
  };

  const activeFilterCount = [
    filter.districtId,
    filter.formType,
    filter.dateFrom,
    filter.dateTo,
    filter.financialYearPeriod,
  ].filter(Boolean).length;

  const hasFilters = activeFilterCount > 0;

  const selectedDistrictName = districts.find((d) => d.id === filter.districtId)?.name;
  const selectedFormTypeLabel = FORM_TYPE_OPTIONS.find((f) => f.value === filter.formType)?.label;

  const startItem = totalElements === 0 ? 0 : page * PAGE_SIZE + 1;
  const endItem = Math.min(totalElements, (page + 1) * PAGE_SIZE);

  return (
    <div className="space-y-6" data-testid="collector-profile-page">
      {/* Header card */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-surface p-6 shadow-sm ring-1 ring-black/[0.03] sm:p-8 dark:ring-white/[0.04]">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-nac-blue via-brand to-nac-orange" />
        <div className="pl-2">
          <Link
            to="/admin/users"
            className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand transition hover:underline"
            data-testid="collector-profile-back"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to users
          </Link>
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand/20 via-nac-orange/15 to-nac-blue/20 text-brand ring-1 ring-brand/30 shadow-xs">
              <UserCircle className="h-7 w-7 text-brand" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-text sm:text-2xl">
                {collectorName}
              </h1>
              <p className="text-xs font-semibold text-text-muted mt-0.5 sm:text-sm">
                {loading ? 'Loading submissions…' : `${totalElements.toLocaleString('en-UG')} submissions submitted`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Filter Panel */}
      <section
        className="overflow-hidden rounded-3xl border border-border/80 bg-surface p-5 shadow-sm ring-1 ring-black/[0.03] sm:p-6 dark:ring-white/[0.04]"
        data-testid="collector-profile-filters"
      >
        <header className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsFiltersOpen((prev) => !prev)}
            className="group flex items-center gap-2.5 text-left text-sm font-bold text-text focus:outline-none"
            aria-expanded={isFiltersOpen}
            data-testid="collector-profile-toggle-filters"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand/10 text-brand group-hover:bg-brand/20 transition-colors">
              <Filter className="h-4 w-4" aria-hidden="true" />
            </div>
            <span>Filter submissions</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center rounded-full border border-brand/25 bg-brand/10 px-2.5 py-0.5 text-xs font-bold text-brand">
                {activeFilterCount} active
              </span>
            )}
            {isFiltersOpen ? (
              <ChevronUp className="h-4 w-4 text-text-muted transition-transform group-hover:text-text" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-4 w-4 text-text-muted transition-transform group-hover:text-text" aria-hidden="true" />
            )}
          </button>

          <div className="flex items-center gap-3">
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-brand transition hover:underline"
                data-testid="collector-profile-clear-filters"
              >
                Clear all filters
              </button>
            )}
          </div>
        </header>

        {/* Active filters pill bar (shown when collapsed or as summary) */}
        {!isFiltersOpen && hasFilters && (
          <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
            <span className="text-xs font-semibold text-text-muted">Active filters:</span>
            {filter.formType && (
              <span className="inline-flex items-center gap-1 rounded-lg border border-brand/20 bg-brand/10 px-2.5 py-1 text-xs font-bold text-brand">
                Form: {selectedFormTypeLabel ?? filter.formType}
              </span>
            )}
            {filter.districtId && (
              <span className="inline-flex items-center gap-1 rounded-lg border border-nac-blue/20 bg-nac-blue/10 px-2.5 py-1 text-xs font-bold text-nac-blue dark:text-blue-300">
                District: {selectedDistrictName ?? filter.districtId}
              </span>
            )}
            {filter.financialYearPeriod && (
              <span className="inline-flex items-center gap-1 rounded-lg border border-nac-orange/20 bg-nac-orange/10 px-2.5 py-1 text-xs font-bold text-nac-orange">
                FY: {labelFromFinancialYearPeriodKey(filter.financialYearPeriod)}
              </span>
            )}
            {filter.dateFrom && (
              <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface-muted px-2.5 py-1 text-xs font-semibold text-text">
                From: {filter.dateFrom}
              </span>
            )}
            {filter.dateTo && (
              <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface-muted px-2.5 py-1 text-xs font-semibold text-text">
                To: {filter.dateTo}
              </span>
            )}
          </div>
        )}

        {/* Filter controls grid */}
        {isFiltersOpen && (
          <div className="mt-5 grid grid-cols-1 gap-4 border-t border-border/60 pt-4 md:grid-cols-2 xl:grid-cols-3">
            <FormField label="Form type" htmlFor="profile-form-type">
              <FormSelect
                id="profile-form-type"
                testId="collector-profile-form-type"
                value={filter.formType}
                onChange={(value) => updateFilter({ formType: value as CollectorProfileFilter['formType'] })}
                options={FORM_TYPE_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
                placeholder="Select All"
              />
            </FormField>

            <FormField label="District" htmlFor="profile-district">
              <FormSelect
                id="profile-district"
                testId="collector-profile-district"
                value={filter.districtId}
                onChange={(value) => updateFilter({ districtId: value })}
                options={districts.map((district) => ({ value: district.id, label: district.name }))}
                placeholder="Select All"
              />
            </FormField>

            <FormField label="Financial year period" htmlFor="profile-fy-period">
              <FormSelect
                id="profile-fy-period"
                testId="collector-profile-fy-period"
                value={filter.financialYearPeriod}
                onChange={(value) => updateFilter({ financialYearPeriod: value })}
                options={financialYearPeriods.map((period) => ({
                  value: period,
                  label: labelFromFinancialYearPeriodKey(period),
                }))}
                placeholder="Select All"
              />
            </FormField>

            <FormField label="Date from" htmlFor="profile-date-from">
              <input
                id="profile-date-from"
                type="date"
                value={filter.dateFrom}
                onChange={(e) => updateFilter({ dateFrom: e.target.value })}
                className={formControlClassName}
                data-testid="collector-profile-date-from"
              />
            </FormField>

            <FormField label="Date to" htmlFor="profile-date-to">
              <input
                id="profile-date-to"
                type="date"
                value={filter.dateTo}
                onChange={(e) => updateFilter({ dateTo: e.target.value })}
                className={formControlClassName}
                data-testid="collector-profile-date-to"
              />
            </FormField>
          </div>
        )}
      </section>

      {error && (
        <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300">
          {error}
        </div>
      )}

      {/* Submissions Table with Integrated Pagination Footer */}
      <div className="overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-sm ring-1 ring-black/[0.03] dark:ring-white/[0.04]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm" data-testid="collector-profile-submissions-table">
            <thead className="border-b border-border bg-surface-muted/70 text-xs uppercase tracking-wide text-text-muted">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Form type</th>
                <th className="px-5 py-3.5 font-semibold">Respondent</th>
                <th className="px-5 py-3.5 font-semibold">District</th>
                <th className="px-5 py-3.5 font-semibold">Completed</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {showTableSkeleton &&
                Array.from({ length: 4 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={5} className="px-5 py-4">
                      <div className="h-4 animate-pulse rounded bg-surface-muted" />
                    </td>
                  </tr>
                ))}

              {!showTableSkeleton && rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-text-muted">
                    No submissions match the current filters.
                  </td>
                </tr>
              )}

              {!showTableSkeleton &&
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="transition hover:bg-surface-muted/50"
                    data-testid={`collector-submission-row-${row.id}`}
                  >
                    <td className="px-5 py-3.5 font-medium text-text">{formatFormTypeLabel(row.formType)}</td>
                    <td className="px-5 py-3.5 font-semibold text-text">{row.respondentName}</td>
                    <td className="px-5 py-3.5 text-text-muted">{row.districtName}</td>
                    <td className="px-5 py-3.5 tabular-nums text-text-muted">{formatAdminTimestamp(row.formCompletedAt)}</td>
                    <td className="px-5 py-3.5">{renderStatusBadge(row.status)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Integrated Pagination Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 bg-surface-muted/30 px-5 py-3.5 sm:px-6">
          <div className="text-xs font-medium text-text-muted sm:text-sm">
            Showing <span className="font-semibold text-text tabular-nums">{startItem}</span> to{' '}
            <span className="font-semibold text-text tabular-nums">{endItem}</span> of{' '}
            <span className="font-semibold text-text tabular-nums">{totalElements.toLocaleString('en-UG')}</span> submissions
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 0 || loading}
              onClick={() => goToPage(page - 1)}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-border/80 bg-surface px-3.5 py-1.5 text-xs font-semibold text-text shadow-xs transition hover:border-brand/30 hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
              data-testid="collector-profile-prev-page"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Previous
            </button>

            <div className="px-2 text-xs font-semibold text-text-muted">
              Page <span className="text-text tabular-nums">{page + 1}</span> of{' '}
              <span className="text-text tabular-nums">{Math.max(1, totalPages)}</span>
            </div>

            <button
              type="button"
              disabled={page >= totalPages - 1 || totalPages === 0 || loading}
              onClick={() => goToPage(page + 1)}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-border/80 bg-surface px-3.5 py-1.5 text-xs font-semibold text-text shadow-xs transition hover:border-brand/30 hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
              data-testid="collector-profile-next-page"
            >
              Next
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollectorProfilePage;

