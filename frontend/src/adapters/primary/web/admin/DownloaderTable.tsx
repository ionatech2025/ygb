import {
  formatDownloaderAgeGroup,
  formatDownloaderFieldOfOperation,
  formatDownloaderGender,
  type DownloaderSummary,
} from '../../../../core/domain/download-usage-analytics.model';

export interface DownloaderTableProps {
  rows: DownloaderSummary[];
  loading: boolean;
  page: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}

function formatTimestamp(value: string | null): string {
  if (!value) {
    return '—';
  }
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) {
    return value;
  }
  return new Date(parsed).toLocaleString();
}

export function DownloaderTable({
  rows,
  loading,
  page,
  totalPages,
  totalElements,
  onPageChange,
}: DownloaderTableProps) {
  return (
    <section data-testid="downloader-table" className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-border/80">
        <table className="min-w-full divide-y divide-border text-left text-sm">
          <thead className="sticky top-0 bg-surface-muted/90 backdrop-blur">
            <tr className="text-xs uppercase tracking-wider text-text-muted">
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Country</th>
              <th className="px-4 py-3 font-semibold">Gender</th>
              <th className="px-4 py-3 font-semibold">Age</th>
              <th className="px-4 py-3 font-semibold">Field of operation</th>
              <th className="px-4 py-3 font-semibold tabular-nums">Downloads</th>
              <th className="px-4 py-3 font-semibold">Last download</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-text-muted">
                  Loading downloaders…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-text-muted">
                  No downloaders match the current filters.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.profileId} className="transition-colors hover:bg-surface-muted/60">
                  <td className="px-4 py-3 text-text">{row.optionalName?.trim() || '—'}</td>
                  <td className="px-4 py-3 text-text">{row.email}</td>
                  <td className="px-4 py-3 tabular-nums text-text">{row.countryCode}</td>
                  <td className="px-4 py-3 text-text">{formatDownloaderGender(row.gender)}</td>
                  <td className="px-4 py-3 text-text">{formatDownloaderAgeGroup(row.ageGroup)}</td>
                  <td className="px-4 py-3 text-text">
                    {formatDownloaderFieldOfOperation(
                      row.fieldOfOperation,
                      row.fieldOfOperationSpecify
                    )}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-text">{row.downloadCount}</td>
                  <td className="px-4 py-3 text-text-muted">{formatTimestamp(row.lastDownloadedAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-text-muted" data-testid="downloader-table-total">
          {totalElements} downloader{totalElements === 1 ? '' : 's'}
        </p>
        {totalPages > 1 ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 0 || loading}
              onClick={() => onPageChange(page - 1)}
              className="rounded-xl border border-border px-3 py-2 text-sm font-semibold text-text disabled:opacity-50"
              data-testid="downloader-table-prev-page"
            >
              Previous
            </button>
            <span className="text-sm tabular-nums text-text-muted">
              Page {page + 1} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages - 1 || loading}
              onClick={() => onPageChange(page + 1)}
              className="rounded-xl border border-border px-3 py-2 text-sm font-semibold text-text disabled:opacity-50"
              data-testid="downloader-table-next-page"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
