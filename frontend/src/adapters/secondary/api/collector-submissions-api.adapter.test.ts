import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EMPTY_COLLECTOR_SUBMISSION_FILTER } from '../../../core/domain/collector-submission-list.model';
import { HttpCollectorSubmissionsAdapter } from './collector-submissions-api.adapter';

describe('collector-submissions-api.adapter', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('calls GET /api/v1/submissions/mine with the bearer token and pagination', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          items: [],
          totalElements: 0,
          page: 1,
          size: 10,
          totalPages: 0,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    const adapter = new HttpCollectorSubmissionsAdapter(() => 'collector-token');
    await adapter.fetchMine({ ...EMPTY_COLLECTOR_SUBMISSION_FILTER, formType: 'IYP' }, 1, 10);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/submissions/mine?'),
      expect.objectContaining({
        headers: expect.any(Headers),
      })
    );

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer collector-token');
    expect(url).toContain('page=1');
    expect(url).toContain('size=10');
    expect(url).toContain('formType=IYP');
    expect(url).not.toContain('collectorId=');
  });

  it('calls GET /api/v1/submissions/mine/breakdown with the bearer token', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          byFormType: [{ formType: 'BYP', count: 35 }],
          byDistrict: [{ districtId: 'd1', districtName: 'Kampala', count: 35 }],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    const adapter = new HttpCollectorSubmissionsAdapter(() => 'collector-token');
    const result = await adapter.fetchMineBreakdown();

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/v1\/submissions\/mine\/breakdown$/),
      expect.objectContaining({
        headers: expect.any(Headers),
      })
    );
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect((init.headers as Headers).get('Authorization')).toBe('Bearer collector-token');
    expect(result.byFormType[0]?.count).toBe(35);
    expect(result.byDistrict[0]?.districtName).toBe('Kampala');
  });
});
