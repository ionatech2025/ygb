import { apiFetch } from '../../../core/api/api-client';
import {
  buildDownloadUsageAnalyticsQueryString,
  type DownloadUsageAggregates,
  type DownloadUsageAnalyticsFilter,
  type DownloaderPage,
  type VisitsVsDownloadsComparison,
} from '../../../core/domain/download-usage-analytics.model';
import type { IAdminDownloadUsageAnalyticsApiPort } from '../../../ports/admin-download-usage-analytics-api.port';

export class HttpAdminDownloadUsageAnalyticsAdapter implements IAdminDownloadUsageAnalyticsApiPort {
  constructor(private readonly getAccessToken: () => string | null) {}

  private requireToken(): string {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('You must be signed in as an administrator.');
    }
    return token;
  }

  async fetchDownloaders(
    filter: DownloadUsageAnalyticsFilter,
    page: number,
    size = 25
  ): Promise<DownloaderPage> {
    const token = this.requireToken();
    const query = buildDownloadUsageAnalyticsQueryString(filter, { page, size });
    return apiFetch<DownloaderPage>(`/api/v1/admin/analytics/downloaders${query}`, { method: 'GET' }, token);
  }

  async fetchDownloadUsage(filter: DownloadUsageAnalyticsFilter): Promise<DownloadUsageAggregates> {
    const token = this.requireToken();
    const query = buildDownloadUsageAnalyticsQueryString(filter);
    return apiFetch<DownloadUsageAggregates>(
      `/api/v1/admin/analytics/download-usage${query}`,
      { method: 'GET' },
      token
    );
  }

  async fetchVisitsVsDownloads(
    filter: DownloadUsageAnalyticsFilter
  ): Promise<VisitsVsDownloadsComparison> {
    const token = this.requireToken();
    const query = buildDownloadUsageAnalyticsQueryString(filter);
    return apiFetch<VisitsVsDownloadsComparison>(
      `/api/v1/admin/analytics/visits-vs-downloads${query}`,
      { method: 'GET' },
      token
    );
  }
}
