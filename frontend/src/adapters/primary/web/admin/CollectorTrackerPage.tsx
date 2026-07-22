import { useEffect, useMemo, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { ApiError } from '../../../../core/api/api-client';
import { CollectorTrackerService } from '../../../../core/CollectorTrackerService';
import { buildDashboardFilterQueryString } from '../../../../core/domain/dashboard-filter.model';
import type {
  CollectorBreakdown,
  CollectorLeaderboardEntry,
  LeaderboardSortDirection,
  LeaderboardSortKey,
} from '../../../../core/domain/collector-tracker.model';
import { useDashboardFilterStore } from '../../../../core/store/useDashboardFilterStore';
import { HttpCollectorTrackerAdapter } from '../../../secondary/api/collector-tracker-api.adapter';
import { HttpDashboardAdapter } from '../../../secondary/api/dashboard-api.adapter';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import type { ICollectorTrackerApiPort } from '../../../../ports/collector-tracker-api.port';
import type { IDashboardApiPort } from '../../../../ports/dashboard-api.port';
import { CollectorBreakdownPanel } from './CollectorBreakdownPanel';
import { CollectorLeaderboardTable } from './CollectorLeaderboardTable';
import { DashboardFilterPanel } from './DashboardFilterPanel';

export interface CollectorTrackerPageProps {
  trackerApi?: ICollectorTrackerApiPort;
  dashboardApi?: IDashboardApiPort;
  trackerService?: CollectorTrackerService;
}

export function CollectorTrackerPage({
  trackerApi: trackerApiProp,
  dashboardApi: dashboardApiProp,
  trackerService: trackerServiceProp,
}: CollectorTrackerPageProps = {}) {
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const trackerApi = useMemo(
    () => trackerApiProp ?? new HttpCollectorTrackerAdapter(getAccessToken),
    [trackerApiProp, getAccessToken]
  );
  const dashboardApi = useMemo(
    () => dashboardApiProp ?? new HttpDashboardAdapter(getAccessToken),
    [dashboardApiProp, getAccessToken]
  );
  const trackerService = useMemo(
    () => trackerServiceProp ?? new CollectorTrackerService(trackerApi),
    [trackerServiceProp, trackerApi]
  );

  const filter = useDashboardFilterStore((state) => state.filter);
  const filterKey = buildDashboardFilterQueryString(filter);

  const [rows, setRows] = useState<CollectorLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortKey, setSortKey] = useState<LeaderboardSortKey>('totalCount');
  const [sortDirection, setSortDirection] = useState<LeaderboardSortDirection>('desc');
  const [expandedCollectorId, setExpandedCollectorId] = useState<string | null>(null);
  const [breakdown, setBreakdown] = useState<CollectorBreakdown | null>(null);
  const [breakdownLoading, setBreakdownLoading] = useState(false);
  const [breakdownError, setBreakdownError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const entries = await trackerService.loadLeaderboard(filter, sortKey, sortDirection);
        if (!cancelled) {
          setRows(entries);
        }
      } catch (err) {
        if (!cancelled) {
          setRows([]);
          setError(err instanceof ApiError || err instanceof Error ? err.message : 'Failed to load leaderboard.');
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
  }, [trackerService, filterKey, filter, sortKey, sortDirection]);

  useEffect(() => {
    if (!expandedCollectorId) {
      setBreakdown(null);
      setBreakdownError('');
      return;
    }

    let cancelled = false;
    setBreakdownLoading(true);
    setBreakdownError('');

    void trackerService
      .loadBreakdown(expandedCollectorId, filter)
      .then((result) => {
        if (!cancelled) {
          setBreakdown(result);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setBreakdown(null);
          setBreakdownError(
            err instanceof ApiError || err instanceof Error ? err.message : 'Failed to load breakdown.'
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setBreakdownLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [trackerService, expandedCollectorId, filterKey, filter]);

  const handleSort = (key: LeaderboardSortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => (current === 'desc' ? 'asc' : 'desc'));
      return;
    }
    setSortKey(key);
    setSortDirection(key === 'totalCount' ? 'desc' : 'asc');
  };

  const handleToggleExpand = (collectorId: string) => {
    setExpandedCollectorId((current) => (current === collectorId ? null : collectorId));
  };

  const expandedCollector = rows.find((row) => row.collectorId === expandedCollectorId);

  return (
    <div className="mx-auto max-w-6xl space-y-6" data-testid="collector-tracker-page">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold text-text sm:text-xl">
          <TrendingUp className="h-5 w-5 text-brand" aria-hidden="true" />
          Data Collector Tracker
        </h2>
        <p className="text-sm text-text-muted">
          Leaderboard of submission counts by collector. Filters recalculate totals across matching submissions.
        </p>
      </div>

      <DashboardFilterPanel dashboardApi={dashboardApi} compact />

      {error && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      <CollectorLeaderboardTable
        rows={rows}
        sortKey={sortKey}
        sortDirection={sortDirection}
        expandedCollectorId={expandedCollectorId}
        loading={loading}
        onSort={handleSort}
        onToggleExpand={handleToggleExpand}
      />

      {expandedCollectorId && expandedCollector && (
        <CollectorBreakdownPanel
          collectorName={expandedCollector.fullName}
          breakdown={breakdown}
          loading={breakdownLoading}
          error={breakdownError}
        />
      )}
    </div>
  );
}

export default CollectorTrackerPage;
