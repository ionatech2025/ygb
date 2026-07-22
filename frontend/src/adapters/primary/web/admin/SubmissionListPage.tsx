import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, List } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ApiError } from '../../../../core/api/api-client';
import { buildDashboardFilterQueryString } from '../../../../core/domain/dashboard-filter.model';
import { buildSubmissionListSearch } from '../../../../core/domain/dashboard-drill-down.model';
import {
  formatAdminTimestamp,
  formatFormTypeLabel,
  formatSubmissionStatus,
} from '../../../../core/domain/submission-detail-fields';
import type { SubmissionSummary } from '../../../../core/domain/submission-admin.model';
import { useDashboardFilterStore } from '../../../../core/store/useDashboardFilterStore';
import { HttpSubmissionAdminAdapter } from '../../../secondary/api/submission-admin-api.adapter';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { DashboardExportToolbar } from './DashboardExportToolbar';

export function SubmissionListPage() {
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const submissionApi = useMemo(() => new HttpSubmissionAdminAdapter(getAccessToken), [getAccessToken]);
  const filter = useDashboardFilterStore((state) => state.filter);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = Math.max(0, Number(searchParams.get('page') ?? '0') || 0);
  const [rows, setRows] = useState<SubmissionSummary[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const filterKey = buildDashboardFilterQueryString(filter);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await submissionApi.listSubmissions(filter, page);
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
  }, [submissionApi, filter, filterKey, page]);

  const dashboardBackHref = `/admin/dashboard${buildDashboardFilterQueryString(filter)}`;

  const goToPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams);
    if (nextPage <= 0) {
      params.delete('page');
    } else {
      params.set('page', String(nextPage));
    }
    setSearchParams(params, { replace: true });
  };

  const openDetail = (submissionId: string) => {
    navigate(`/admin/submissions/${submissionId}${buildSubmissionListSearch(filter, page)}`, {
      state: { returnSearch: buildSubmissionListSearch(filter, page) },
    });
  };

  return (
    <div className="space-y-6" data-testid="submission-list-page">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            to={dashboardBackHref}
            className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
            data-testid="submission-list-back-dashboard"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to dashboard
          </Link>
          <h1 className="flex items-center gap-2 text-lg font-bold text-text sm:text-xl">
            <List className="h-5 w-5 text-brand" aria-hidden="true" />
            Submissions
          </h1>
          <p className="text-sm text-text-muted">
            {loading ? 'Loading submissions…' : `${totalElements.toLocaleString('en-UG')} matching submissions`}
          </p>
        </div>
      </div>

      <DashboardExportToolbar />

      {error && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm">
        <table className="min-w-full text-left text-sm" data-testid="submission-list-table">
          <thead className="border-b border-border bg-surface-muted text-xs uppercase tracking-wide text-text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Form type</th>
              <th className="px-4 py-3 font-semibold">Respondent</th>
              <th className="px-4 py-3 font-semibold">District</th>
              <th className="px-4 py-3 font-semibold">Collector</th>
              <th className="px-4 py-3 font-semibold">Completed</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-b border-border">
                  <td colSpan={6} className="px-4 py-4">
                    <div className="h-4 animate-pulse rounded bg-surface-muted" />
                  </td>
                </tr>
              ))}

            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-text-muted">
                  No submissions match the current filters.
                </td>
              </tr>
            )}

            {!loading &&
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer border-b border-border transition hover:bg-surface-muted"
                  data-testid={`submission-row-${row.id}`}
                  onClick={() => openDetail(row.id)}
                >
                  <td className="px-4 py-3">{formatFormTypeLabel(row.formType)}</td>
                  <td className="px-4 py-3 font-medium text-text">{row.respondentName}</td>
                  <td className="px-4 py-3">{row.districtName}</td>
                  <td className="px-4 py-3">{row.collectorName}</td>
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
            data-testid="submission-list-prev-page"
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
            data-testid="submission-list-next-page"
          >
            Next
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
