import { ChevronDown, ChevronUp } from 'lucide-react';
import type { CollectorLeaderboardEntry, LeaderboardSortDirection, LeaderboardSortKey } from '../../../../core/domain/collector-tracker.model';

export interface CollectorLeaderboardTableProps {
  rows: CollectorLeaderboardEntry[];
  sortKey: LeaderboardSortKey;
  sortDirection: LeaderboardSortDirection;
  expandedCollectorId: string | null;
  loading?: boolean;
  onSort: (key: LeaderboardSortKey) => void;
  onToggleExpand: (collectorId: string) => void;
}

function SortIndicator({
  active,
  direction,
}: {
  active: boolean;
  direction: LeaderboardSortDirection;
}) {
  if (!active) {
    return null;
  }
  return direction === 'asc' ? (
    <ChevronUp className="inline h-3.5 w-3.5" aria-hidden="true" />
  ) : (
    <ChevronDown className="inline h-3.5 w-3.5" aria-hidden="true" />
  );
}

export function CollectorLeaderboardTable({
  rows,
  sortKey,
  sortDirection,
  expandedCollectorId,
  loading = false,
  onSort,
  onToggleExpand,
}: CollectorLeaderboardTableProps) {
  const showSkeleton = loading && rows.length === 0;

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm">
      <table className="min-w-full text-left text-sm" data-testid="collector-leaderboard-table">
        <thead className="border-b border-border bg-surface-muted text-xs uppercase tracking-wide text-text-muted">
          <tr>
            <th className="px-4 py-3 font-semibold">Rank</th>
            <th className="px-4 py-3 font-semibold">
              <button
                type="button"
                onClick={() => onSort('fullName')}
                className="inline-flex items-center gap-1 font-semibold uppercase tracking-wide"
                data-testid="leaderboard-sort-name"
              >
                Collector
                <SortIndicator active={sortKey === 'fullName'} direction={sortDirection} />
              </button>
            </th>
            <th className="px-4 py-3 font-semibold">
              <button
                type="button"
                onClick={() => onSort('totalCount')}
                className="inline-flex items-center gap-1 font-semibold uppercase tracking-wide"
                data-testid="leaderboard-sort-count"
              >
                Submissions
                <SortIndicator active={sortKey === 'totalCount'} direction={sortDirection} />
              </button>
            </th>
            <th className="px-4 py-3 font-semibold">Breakdown</th>
          </tr>
        </thead>
        <tbody>
          {showSkeleton &&
            Array.from({ length: 4 }).map((_, index) => (
              <tr key={index} className="border-b border-border">
                <td colSpan={4} className="px-4 py-4">
                  <div className="h-4 animate-pulse rounded bg-surface-muted" />
                </td>
              </tr>
            ))}

          {!showSkeleton && rows.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-text-muted">
                No collectors match the current filters.
              </td>
            </tr>
          )}

          {!showSkeleton &&
            rows.map((row, index) => {
              const expanded = expandedCollectorId === row.collectorId;
              return (
                <tr
                  key={row.collectorId}
                  className="border-b border-border hover:bg-surface-muted/50"
                  data-testid={`leaderboard-row-${row.collectorId}`}
                >
                  <td className="px-4 py-3 font-medium text-text-muted">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-text">{row.fullName}</td>
                  <td className="px-4 py-3 font-semibold text-text">{row.totalCount.toLocaleString('en-UG')}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onToggleExpand(row.collectorId)}
                      aria-expanded={expanded}
                      className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-brand hover:bg-surface-muted"
                      data-testid={`leaderboard-expand-${row.collectorId}`}
                    >
                      {expanded ? 'Hide' : 'Show'} breakdown
                      {expanded ? (
                        <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
