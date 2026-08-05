import type { PublicDownloadUsageAggregates } from '../core/domain/public-download-usage.model';

export interface IPublicDownloadUsageApiPort {
  fetchPublicDownloadUsage(): Promise<PublicDownloadUsageAggregates>;
}
