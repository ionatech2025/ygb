import { AlertCircle } from 'lucide-react';
import { DEVICE_PENDING_INFO_MESSAGE } from '../../../../core/domain/admin-receipt-status.model';
import type { AdminReceiptStatus } from '../../../../core/domain/admin-receipt-status.model';
import { StatCard } from './StatCard';
import type { StatCardViewModel } from '../../../../core/domain/dashboard-summary.model';

export interface ReceiptStatusSummaryProps {
  status: AdminReceiptStatus | null;
  loading?: boolean;
}

function buildSummaryCards(status: AdminReceiptStatus): StatCardViewModel[] {
  return [
    {
      id: 'receipt-synced',
      title: 'Synced (server)',
      primaryValue: status.totalSynced.toLocaleString('en-UG'),
    },
    {
      id: 'receipt-flagged',
      title: 'Flagged',
      primaryValue: status.totalFlagged.toLocaleString('en-UG'),
    },
    {
      id: 'receipt-duplicate',
      title: 'Duplicate',
      primaryValue: status.totalDuplicate.toLocaleString('en-UG'),
    },
  ];
}

export function ReceiptStatusSummary({ status, loading = false }: ReceiptStatusSummaryProps) {
  if (loading && !status) {
    return (
      <div
        data-testid="receipt-status-summary-skeleton"
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        aria-busy="true"
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-2xl border border-border bg-surface-muted" />
        ))}
      </div>
    );
  }

  if (!status) {
    return null;
  }

  return (
    <div className="space-y-4" data-testid="receipt-status-summary">
      <div
        role="note"
        className="flex items-start gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-200"
        data-testid="receipt-status-pending-info"
      >
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>{DEVICE_PENDING_INFO_MESSAGE}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {buildSummaryCards(status).map((card, index) => (
          <StatCard key={card.id} card={card} accentIndex={index} />
        ))}
      </div>
    </div>
  );
}
