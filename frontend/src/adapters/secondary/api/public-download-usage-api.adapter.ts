import { apiClient } from '../../../core/api/api-client';
import type { PublicDownloadUsageAggregates } from '../../../core/domain/public-download-usage.model';
import type { IPublicDownloadUsageApiPort } from '../../../ports/public-download-usage-api.port';

export class HttpPublicDownloadUsageAdapter implements IPublicDownloadUsageApiPort {
  async fetchPublicDownloadUsage(): Promise<PublicDownloadUsageAggregates> {
    return apiClient.get<PublicDownloadUsageAggregates>(
      '/api/v1/public/dashboard/download-usage'
    );
  }
}
