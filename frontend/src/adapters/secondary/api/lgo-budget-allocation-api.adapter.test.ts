import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  HttpLgoBudgetAllocationAdapter,
  LGO_BUDGET_ALLOCATION_SUBMIT_PATH,
  mapLgoBudgetAllocationSubmissionResponse,
} from './lgo-budget-allocation-api.adapter';

describe('lgo-budget-allocation-api.adapter', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('maps backend submission response to the domain result', () => {
    expect(
      mapLgoBudgetAllocationSubmissionResponse({
        submissionId: 'sub-1',
        lbaId: 'lba-1',
        status: 'SYNCED',
      })
    ).toEqual({
      submissionId: 'sub-1',
      lbaId: 'lba-1',
      status: 'SYNCED',
    });
  });

  it('POSTs authenticated JSON payload to the collector endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          submissionId: 'sub-99',
          lbaId: 'lba-99',
          status: 'SYNCED',
        }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    const adapter = new HttpLgoBudgetAllocationAdapter(() => 'collector-token');
    const result = await adapter.submit({
      deviceSubmissionId: '11111111-1111-1111-1111-111111111111',
      formCompletedAt: '2026-03-15T10:00:00.000Z',
      respondent: {
        name: 'District Health Officer',
        phone: '0772555666',
        gender: 'FEMALE',
        ageGroup: 'AGE_30_AND_ABOVE',
        districtId: '22222222-2222-2222-2222-222222222222',
        subcountyId: '33333333-3333-3333-3333-333333333333',
        parishId: '44444444-4444-4444-4444-444444444444',
        villageId: '55555555-5555-5555-5555-555555555555',
      },
      priorYearAllocations: {
        health: { amount: 1_200_000, percentage: 28 },
      },
      rationale: 'Health and education received the largest shares due to service delivery gaps.',
      recommendations: 'Increase agriculture extension funding and climate resilience programmes.',
    });

    expect(result.lbaId).toBe('lba-99');
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain(LGO_BUDGET_ALLOCATION_SUBMIT_PATH);

    const headers = new Headers(init.headers);
    expect(headers.get('Authorization')).toBe('Bearer collector-token');
    expect(headers.get('Content-Type')).toBe('application/json');

    const body = JSON.parse(init.body as string) as Record<string, unknown>;
    expect(body.deviceSubmissionId).toBe('11111111-1111-1111-1111-111111111111');
    expect(body.priorYearAllocations).toEqual({
      health: { amount: 1_200_000, percentage: 28 },
    });
    expect(body.rationale).toContain('Health and education');
  });
});
