import type { DashboardFilter } from './domain/dashboard-filter.model';
import type {
  CollectorBreakdown,
  CollectorLeaderboardEntry,
  LeaderboardSortDirection,
  LeaderboardSortKey,
} from './domain/collector-tracker.model';
import { sortLeaderboardEntries } from './domain/collector-tracker.model';
import type { ICollectorTrackerApiPort } from '../ports/collector-tracker-api.port';

export class CollectorTrackerService {
  constructor(private readonly api: ICollectorTrackerApiPort) {}

  async loadLeaderboard(
    filter: DashboardFilter,
    sortKey: LeaderboardSortKey = 'totalCount',
    sortDirection: LeaderboardSortDirection = 'desc'
  ): Promise<CollectorLeaderboardEntry[]> {
    const entries = await this.api.fetchLeaderboard(filter);
    return sortLeaderboardEntries(entries, sortKey, sortDirection);
  }

  async loadBreakdown(collectorId: string, filter: DashboardFilter): Promise<CollectorBreakdown> {
    return this.api.fetchBreakdown(collectorId, filter);
  }
}
