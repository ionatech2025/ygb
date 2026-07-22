import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EMPTY_DASHBOARD_FILTER } from '../../../core/domain/dashboard-filter.model';
import { KAMPALA_DISTRICT_ID } from '../../../core/domain/location-seed.constants';
import { HttpSubmissionAdminAdapter } from './submission-admin-api.adapter';

describe('submission-admin-api.adapter', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('includes the Authorization header when listing submissions', async () => {
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

    const adapter = new HttpSubmissionAdminAdapter(() => 'admin-token');
    await adapter.listSubmissions({ ...EMPTY_DASHBOARD_FILTER, districtId: KAMPALA_DISTRICT_ID }, 0);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/admin/submissions?'),
      expect.objectContaining({
        headers: expect.any(Headers),
      })
    );

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer admin-token');
    expect(fetchMock.mock.calls[0]?.[0]).toContain(`districtId=${KAMPALA_DISTRICT_ID}`);
  });

  it('includes the Authorization header when loading submission detail', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 'submission-1',
          collectorId: 'collector-1',
          collectorName: 'Collector',
          status: 'SYNCED',
          formCompletedAt: '2026-03-15T10:00:00',
          syncedAt: '2026-03-15T10:05:00',
          financialYearPeriod: 'JAN_JUN_2026',
          payload: { formType: 'BYP', respondentName: 'Jane Doe' },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    const adapter = new HttpSubmissionAdminAdapter(() => 'admin-token');
    await adapter.getSubmissionDetail('submission-1');

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer admin-token');
    expect(fetchMock.mock.calls[0]?.[0]).toContain('/api/v1/admin/submissions/submission-1');
  });
});
