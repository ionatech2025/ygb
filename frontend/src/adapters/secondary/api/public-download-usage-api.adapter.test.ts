import { describe, expect, it, vi } from 'vitest';
import { apiFetch } from '../../../core/api/api-client';
import { HttpPublicDownloadUsageAdapter } from './public-download-usage-api.adapter';

vi.mock('../../../core/api/api-client', () => ({
  apiFetch: vi.fn(),
}));

describe('HttpPublicDownloadUsageAdapter', () => {
  it('calls GET /api/v1/public/dashboard/download-usage without requiring authentication', async () => {
    const mockData = {
      totalDownloads: 42,
      byDataset: [
        { dataset: 'PUBLIC_SUBMISSIONS', count: 20 },
        { dataset: 'BUDGET_PRIORITIES', count: 12 },
        { dataset: 'LGO_BUDGET_ALLOCATION', count: 10 },
      ],
      downloadsOverTime: [
        { bucketStart: '2026-08-01', count: 15 },
        { bucketStart: '2026-08-02', count: 27 },
      ],
    };
    vi.mocked(apiFetch).mockResolvedValueOnce(mockData);

    const adapter = new HttpPublicDownloadUsageAdapter();
    const result = await adapter.fetchPublicDownloadUsage();

    expect(apiFetch).toHaveBeenCalledWith('/api/v1/public/dashboard/download-usage');
    expect(result).toEqual(mockData);
  });
});
