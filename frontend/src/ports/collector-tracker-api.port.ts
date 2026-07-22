import type { DashboardFilter } from '../core/domain/dashboard-filter.model';
import type { CollectorBreakdown, CollectorLeaderboardEntry } from '../core/domain/collector-tracker.model';

export interface ICollectorTrackerApiPort {
  fetchLeaderboard(filter: DashboardFilter): Promise<CollectorLeaderboardEntry[]>;
  fetchBreakdown(collectorId: string, filter: DashboardFilter): Promise<CollectorBreakdown>;
}
