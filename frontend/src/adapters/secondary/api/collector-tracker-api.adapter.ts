import { apiFetch } from '../../../core/api/api-client';
import { buildDashboardFilterQueryString } from '../../../core/domain/dashboard-filter.model';
import type { DashboardFilter } from '../../../core/domain/dashboard-filter.model';
import type {
  CollectorBreakdown,
  CollectorLeaderboardPage,
  LeaderboardSortDirection,
  LeaderboardSortKey,
} from '../../../core/domain/collector-tracker.model';
import type { ICollectorTrackerApiPort } from '../../../ports/collector-tracker-api.port';

const DEFAULT_PAGE_SIZE = 25;

export class HttpCollectorTrackerAdapter implements ICollectorTrackerApiPort {
  constructor(private readonly getAccessToken: () => string | null) {}

  private requireToken(): string {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('You must be signed in as an administrator.');
    }
    return token;
  }

  async fetchLeaderboard(
    filter: DashboardFilter,
    page = 0,
    size = DEFAULT_PAGE_SIZE,
    sortKey: LeaderboardSortKey = 'totalCount',
    sortDirection: LeaderboardSortDirection = 'desc'
  ): Promise<CollectorLeaderboardPage> {
    const token = this.requireToken();
    const params = new URLSearchParams(buildDashboardFilterQueryString(filter).replace(/^\?/, ''));
    params.set('page', String(page));
    params.set('size', String(size));
    params.set('sort', sortKey);
    params.set('direction', sortDirection);
    return apiFetch<CollectorLeaderboardPage>(
      `/api/v1/admin/collectors/leaderboard?${params.toString()}`,
      { method: 'GET' },
      token
    );
  }

  async fetchBreakdown(collectorId: string, filter: DashboardFilter): Promise<CollectorBreakdown> {
    const token = this.requireToken();
    const query = buildDashboardFilterQueryString(filter).replace(/^\?/, '');
    const path = query
      ? `/api/v1/admin/collectors/${collectorId}/breakdown?${query}`
      : `/api/v1/admin/collectors/${collectorId}/breakdown`;
    return apiFetch<CollectorBreakdown>(path, { method: 'GET' }, token);
  }
}
