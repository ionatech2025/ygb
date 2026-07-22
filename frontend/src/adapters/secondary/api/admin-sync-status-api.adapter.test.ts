import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpAdminSyncStatusAdapter } from './admin-sync-status-api.adapter';

describe('admin-sync-status-api.adapter', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('includes the Authorization header when fetching receipt status', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          totalSynced: 4,
          totalFlagged: 1,
          totalDuplicate: 1,
          byCollector: [],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    const adapter = new HttpAdminSyncStatusAdapter(() => 'admin-token');
    await adapter.fetchReceiptStatus();

    expect(fetchMock.mock.calls[0]?.[0]).toContain('/api/v1/admin/sync/receipt-status');
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer admin-token');
  });
});
