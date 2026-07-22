import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Filter, UserCircle } from 'lucide-react';
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
import { FormField, formControlClassName } from '../components/forms/FormField';
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

export interface CollectorProfilePageProps {
  userAdmin?: IUserRepositoryPort;
  dashboardApi?: IDashboardApiPort;
  collectorName?: string;
}

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
        setFinancialYearPeriods(options.financialYearPeriods);
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
        const result = await userAdmin.getCollectorSubmissions(collectorId, filter, page);
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

  const hasFilters =
    filter.districtId !== '' ||
    filter.formType !== '' ||
    filter.dateFrom !== '' ||
    filter.dateTo !== '' ||
    filter.financialYearPeriod !== '';

  return (
    <div className="space-y-6" data-testid="collector-profile-page">
      <div>
        <Link
          to="/admin/users"
          className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
          data-testid="collector-profile-back"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to users
        </Link>
        <h1 className="flex items-center gap-2 text-lg font-bold text-text sm:text-xl">
          <UserCircle className="h-5 w-5 text-brand" aria-hidden="true" />
          {collectorName}
        </h1>
        <p className="text-sm text-text-muted">
          {loading ? 'Loading submissions…' : `${totalElements.toLocaleString('en-UG')} submissions`}
        </p>
      </div>

      <section
        className="rounded-2xl border border-border bg-surface p-4 shadow-sm"
        data-testid="collector-profile-filters"
      >
        <header className="mb-4 flex items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-brand" aria-hidden="true" />
            <h2 className="text-sm font-bold text-text">Filter submissions</h2>
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-brand hover:underline"
              data-testid="collector-profile-clear-filters"
            >
              Clear filters
            </button>
          )}
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <FormField label="Form type" htmlFor="profile-form-type">
            <select
              id="profile-form-type"
              value={filter.formType}
              onChange={(e) => updateFilter({ formType: e.target.value as CollectorProfileFilter['formType'] })}
              className={formControlClassName}
              data-testid="collector-profile-form-type"
            >
              <option value="">All form types</option>
              {FORM_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="District" htmlFor="profile-district">
            <select
              id="profile-district"
              value={filter.districtId}
              onChange={(e) => updateFilter({ districtId: e.target.value })}
              className={formControlClassName}
              data-testid="collector-profile-district"
            >
              <option value="">All districts</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Financial year period" htmlFor="profile-fy-period">
            <select
              id="profile-fy-period"
              value={filter.financialYearPeriod}
              onChange={(e) => updateFilter({ financialYearPeriod: e.target.value })}
              className={formControlClassName}
              data-testid="collector-profile-fy-period"
            >
              <option value="">All periods</option>
              {financialYearPeriods.map((period) => (
                <option key={period} value={period}>
                  {labelFromFinancialYearPeriodKey(period)}
                </option>
              ))}
            </select>
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
      </section>

      {error && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm">
        <table className="min-w-full text-left text-sm" data-testid="collector-profile-submissions-table">
          <thead className="border-b border-border bg-surface-muted text-xs uppercase tracking-wide text-text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Form type</th>
              <th className="px-4 py-3 font-semibold">Respondent</th>
              <th className="px-4 py-3 font-semibold">District</th>
              <th className="px-4 py-3 font-semibold">Completed</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {showTableSkeleton &&
              Array.from({ length: 3 }).map((_, index) => (
                <tr key={index} className="border-b border-border">
                  <td colSpan={5} className="px-4 py-4">
                    <div className="h-4 animate-pulse rounded bg-surface-muted" />
                  </td>
                </tr>
              ))}

            {!showTableSkeleton && rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-text-muted">
                  No submissions match the current filters.
                </td>
              </tr>
            )}

            {!showTableSkeleton &&
              rows.map((row) => (
                <tr key={row.id} className="border-b border-border" data-testid={`collector-submission-row-${row.id}`}>
                  <td className="px-4 py-3">{formatFormTypeLabel(row.formType)}</td>
                  <td className="px-4 py-3 font-medium text-text">{row.respondentName}</td>
                  <td className="px-4 py-3">{row.districtName}</td>
                  <td className="px-4 py-3">{formatAdminTimestamp(row.formCompletedAt)}</td>
                  <td className="px-4 py-3">{formatSubmissionStatus(row.status)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={page <= 0 || loading}
            onClick={() => goToPage(page - 1)}
            className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-text disabled:cursor-not-allowed disabled:opacity-50"
            data-testid="collector-profile-prev-page"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Previous
          </button>
          <p className="text-sm text-text-muted">
            Page {page + 1} of {totalPages}
          </p>
          <button
            type="button"
            disabled={page >= totalPages - 1 || loading}
            onClick={() => goToPage(page + 1)}
            className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold text-text disabled:cursor-not-allowed disabled:opacity-50"
            data-testid="collector-profile-next-page"
          >
            Next
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

export default CollectorProfilePage;
