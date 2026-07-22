import { apiFetch } from '../../../core/api/api-client';
import { buildDashboardFilterQueryString } from '../../../core/domain/dashboard-filter.model';
import type { DashboardFilter } from '../../../core/domain/dashboard-filter.model';
import type { CollectorBreakdown, CollectorLeaderboardEntry } from '../../../core/domain/collector-tracker.model';
import type { ICollectorTrackerApiPort } from '../../../ports/collector-tracker-api.port';

export class HttpCollectorTrackerAdapter implements ICollectorTrackerApiPort {
  constructor(private readonly getAccessToken: () => string | null) {}

  private requireToken(): string {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('You must be signed in as an administrator.');
    }
    return token;
  }

  async fetchLeaderboard(filter: DashboardFilter): Promise<CollectorLeaderboardEntry[]> {
    const token = this.requireToken();
    const query = buildDashboardFilterQueryString(filter).replace(/^\?/, '');
    const path = query
      ? `/api/v1/admin/collectors/leaderboard?${query}`
      : '/api/v1/admin/collectors/leaderboard';
    return apiFetch<CollectorLeaderboardEntry[]>(path, { method: 'GET' }, token);
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
