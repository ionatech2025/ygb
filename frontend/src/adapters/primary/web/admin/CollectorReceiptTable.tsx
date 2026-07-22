import { AlertTriangle } from 'lucide-react';
import { formatAdminTimestamp } from '../../../../core/domain/submission-detail-fields';
import type { CollectorReceiptStatus } from '../../../../core/domain/admin-receipt-status.model';

export interface CollectorReceiptTableProps {
  rows: CollectorReceiptStatus[];
  loading?: boolean;
}

export function CollectorReceiptTable({ rows, loading = false }: CollectorReceiptTableProps) {
  const showSkeleton = loading && rows.length === 0;

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm">
      <table className="min-w-full text-left text-sm" data-testid="collector-receipt-table">
        <thead className="border-b border-border bg-surface-muted text-xs uppercase tracking-wide text-text-muted">
          <tr>
            <th className="px-4 py-3 font-semibold">Collector</th>
            <th className="px-4 py-3 font-semibold">Synced</th>
            <th className="px-4 py-3 font-semibold">Flagged</th>
            <th className="px-4 py-3 font-semibold">Duplicate</th>
            <th className="px-4 py-3 font-semibold">Last received</th>
            <th className="px-4 py-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {showSkeleton &&
            Array.from({ length: 4 }).map((_, index) => (
              <tr key={index} className="border-b border-border">
                <td colSpan={6} className="px-4 py-4">
                  <div className="h-4 animate-pulse rounded bg-surface-muted" />
                </td>
              </tr>
            ))}

          {!showSkeleton && rows.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-text-muted">
                No collector receipt data available.
              </td>
            </tr>
          )}

          {!showSkeleton &&
            rows.map((row) => (
              <tr
                key={row.collectorId}
                className={`border-b border-border ${
                  row.stale ? 'bg-amber-50/80 dark:bg-amber-950/20' : 'hover:bg-surface-muted/50'
                }`}
                data-testid={`collector-receipt-row-${row.collectorId}`}
                data-stale={row.stale ? 'true' : 'false'}
              >
                <td className="px-4 py-3 font-medium text-text">{row.fullName}</td>
                <td className="px-4 py-3">{row.syncedCount.toLocaleString('en-UG')}</td>
                <td className="px-4 py-3">{row.flaggedCount.toLocaleString('en-UG')}</td>
                <td className="px-4 py-3">{row.duplicateCount.toLocaleString('en-UG')}</td>
                <td className="px-4 py-3">
                  {row.lastReceivedAt ? formatAdminTimestamp(row.lastReceivedAt) : '—'}
                </td>
                <td className="px-4 py-3">
                  {row.stale ? (
                    <span
                      className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800"
                      data-testid={`collector-receipt-stale-badge-${row.collectorId}`}
                    >
                      <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                      Stale (&gt; 48 h)
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      Active
                    </span>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
