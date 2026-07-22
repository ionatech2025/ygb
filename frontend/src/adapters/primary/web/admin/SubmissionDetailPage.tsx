import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ApiError } from '../../../../core/api/api-client';
import { buildDashboardFilterQueryString } from '../../../../core/domain/dashboard-filter.model';
import type { SubmissionDetail } from '../../../../core/domain/submission-admin.model';
import { useDashboardFilterStore } from '../../../../core/store/useDashboardFilterStore';
import { HttpSubmissionAdminAdapter } from '../../../secondary/api/submission-admin-api.adapter';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { SubmissionDetailView } from './SubmissionDetailView';

interface DetailLocationState {
  returnSearch?: string;
}

export function SubmissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const submissionApi = useMemo(() => new HttpSubmissionAdminAdapter(getAccessToken), [getAccessToken]);
  const filter = useDashboardFilterStore((state) => state.filter);

  const [detail, setDetail] = useState<SubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const returnSearch =
    (location.state as DetailLocationState | null)?.returnSearch ??
    buildDashboardFilterQueryString(filter);
  const listBackHref = `/admin/submissions${returnSearch}`;
  const dashboardBackHref = `/admin/dashboard${buildDashboardFilterQueryString(filter)}`;

  useEffect(() => {
    if (!id) {
      setError('Submission ID is missing.');
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await submissionApi.getSubmissionDetail(id);
        if (!cancelled) {
          setDetail(result);
        }
      } catch (err) {
        if (!cancelled) {
          setDetail(null);
          setError(err instanceof ApiError || err instanceof Error ? err.message : 'Failed to load submission.');
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
  }, [id, submissionApi]);

  return (
    <div className="space-y-6" data-testid="submission-detail-page">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          to={listBackHref}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
          data-testid="submission-detail-back-list"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to list
        </Link>
        <Link
          to={dashboardBackHref}
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-text"
          data-testid="submission-detail-back-dashboard"
        >
          Dashboard filters
        </Link>
      </div>

      <div>
        <h1 className="flex items-center gap-2 text-lg font-bold text-text sm:text-xl">
          <FileText className="h-5 w-5 text-brand" aria-hidden="true" />
          Submission detail
        </h1>
        {detail && (
          <p className="text-sm text-text-muted">
            {detail.payload.respondentName as string} · {detail.id}
          </p>
        )}
      </div>

      {loading && (
        <div
          data-testid="submission-detail-skeleton"
          className="animate-pulse rounded-2xl border border-border bg-surface p-6"
          aria-busy="true"
        >
          <div className="h-4 w-48 rounded bg-surface-muted" />
          <div className="mt-4 h-24 rounded bg-surface-muted" />
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      {!loading && detail && <SubmissionDetailView detail={detail} />}
    </div>
  );
}
