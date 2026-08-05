import type {
  DownloadUsageAggregates,
  DownloadUsageAnalyticsFilter,
  DownloaderPage,
  VisitsVsDownloadsComparison,
} from '../core/domain/download-usage-analytics.model';

export interface IAdminDownloadUsageAnalyticsApiPort {
  fetchDownloaders(
    filter: DownloadUsageAnalyticsFilter,
    page: number,
    size?: number
  ): Promise<DownloaderPage>;

  fetchDownloadUsage(filter: DownloadUsageAnalyticsFilter): Promise<DownloadUsageAggregates>;

  fetchVisitsVsDownloads(
    filter: DownloadUsageAnalyticsFilter
  ): Promise<VisitsVsDownloadsComparison>;
}
