import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpAdminDownloadUsageAnalyticsAdapter } from './admin-download-usage-analytics-api.adapter';

describe('HttpAdminDownloadUsageAnalyticsAdapter', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('requests downloaders with auth, age, gender, and pagination params', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          items: [],
          totalElements: 0,
          page: 0,
          size: 25,
          totalPages: 0,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    const adapter = new HttpAdminDownloadUsageAnalyticsAdapter(() => 'admin-token');
    await adapter.fetchDownloaders({ gender: 'FEMALE', ageGroup: 'AGE_18_24' }, 0, 25);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/api/v1/admin/analytics/downloaders');
    expect(url).toContain('gender=FEMALE');
    expect(url).toContain('ageGroup=AGE_18_24');
    expect(url).toContain('page=0');
    expect(new Headers(init.headers).get('Authorization')).toBe('Bearer admin-token');
  });
});
