import type { DashboardFilter } from './domain/dashboard-filter.model';
import type {
  CollectorBreakdown,
  CollectorLeaderboardPage,
  LeaderboardSortDirection,
  LeaderboardSortKey,
} from './domain/collector-tracker.model';
import type { ICollectorTrackerApiPort } from '../ports/collector-tracker-api.port';

export class CollectorTrackerService {
  constructor(private readonly api: ICollectorTrackerApiPort) {}

  async loadLeaderboard(
    filter: DashboardFilter,
    sortKey: LeaderboardSortKey = 'totalCount',
    sortDirection: LeaderboardSortDirection = 'desc',
    page = 0,
    size = 25
  ): Promise<CollectorLeaderboardPage> {
    return this.api.fetchLeaderboard(filter, page, size, sortKey, sortDirection);
  }

  async loadBreakdown(collectorId: string, filter: DashboardFilter): Promise<CollectorBreakdown> {
    return this.api.fetchBreakdown(collectorId, filter);
  }
}
