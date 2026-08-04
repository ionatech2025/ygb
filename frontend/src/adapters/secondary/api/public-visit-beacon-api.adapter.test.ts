import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpPublicVisitBeaconAdapter } from './public-visit-beacon-api.adapter';

describe('HttpPublicVisitBeaconAdapter', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('POSTs anonymous session id and route group only (no PII)', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetchMock);

    const adapter = new HttpPublicVisitBeaconAdapter();
    await adapter.recordVisit({
      anonymousSessionId: 'anon-session-abc',
      routeGroup: 'public-dashboard',
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/api/v1/public/analytics/visit');
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toEqual({
      anonymousSessionId: 'anon-session-abc',
      routeGroup: 'public-dashboard',
    });
  });
});
