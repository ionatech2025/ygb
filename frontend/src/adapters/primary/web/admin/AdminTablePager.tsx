import type { ReactNode } from 'react';

export interface AdminTablePagerProps {
  page: number;
  totalPages: number;
  totalElements: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
  itemLabel: string;
  testIdPrefix: string;
  summary?: ReactNode;
}

export function AdminTablePager({
  page,
  totalPages,
  totalElements,
  loading = false,
  onPageChange,
  itemLabel,
  testIdPrefix,
  summary,
}: AdminTablePagerProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-xs text-text-muted" data-testid={`${testIdPrefix}-total`}>
        {summary ?? (
          <>
            {totalElements} {itemLabel}
            {totalElements === 1 ? '' : 's'}
          </>
        )}
      </p>
      {totalPages > 1 ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 0 || loading}
            onClick={() => onPageChange(page - 1)}
            className="rounded-xl border border-border px-3 py-2 text-sm font-semibold text-text disabled:opacity-50"
            data-testid={`${testIdPrefix}-prev-page`}
          >
            Previous
          </button>
          <span className="text-sm tabular-nums text-text-muted" data-testid={`${testIdPrefix}-page-label`}>
            Page {page + 1} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages - 1 || loading}
            onClick={() => onPageChange(page + 1)}
            className="rounded-xl border border-border px-3 py-2 text-sm font-semibold text-text disabled:opacity-50"
            data-testid={`${testIdPrefix}-next-page`}
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
