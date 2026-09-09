import type { DashboardFilter } from '../core/domain/dashboard-filter.model';
import type {
  CollectorBreakdown,
  CollectorLeaderboardPage,
  LeaderboardSortDirection,
  LeaderboardSortKey,
} from '../core/domain/collector-tracker.model';

export interface ICollectorTrackerApiPort {
  fetchLeaderboard(
    filter: DashboardFilter,
    page?: number,
    size?: number,
    sortKey?: LeaderboardSortKey,
    sortDirection?: LeaderboardSortDirection
  ): Promise<CollectorLeaderboardPage>;
  fetchBreakdown(collectorId: string, filter: DashboardFilter): Promise<CollectorBreakdown>;
}
