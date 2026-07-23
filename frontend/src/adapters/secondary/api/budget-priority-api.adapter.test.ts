import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildBudgetPrioritySubmitPath,
  HttpBudgetPriorityAdapter,
  mapBudgetPrioritySubmissionResponse,
} from './budget-priority-api.adapter';

describe('budget-priority-api.adapter', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('builds the public submit path for a section', () => {
    expect(buildBudgetPrioritySubmitPath('health')).toBe('/api/v1/public/budget-priorities/health');
  });

  it('maps backend submission response to the domain result', () => {
    expect(
      mapBudgetPrioritySubmissionResponse(
        {
          bpId: 'bp-1',
          status: 'SUBMITTED',
          section: 'health',
          financialYearPeriod: 'JAN_JUN_2026',
        },
        'health'
      )
    ).toEqual({
      bpId: 'bp-1',
      status: 'SUBMITTED',
      section: 'health',
      financialYearPeriod: 'JAN_JUN_2026',
    });
  });

  it('POSTs demographics and priorityAreas without verificationToken', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          bpId: 'bp-99',
          status: 'SUBMITTED',
          section: 'health',
          financialYearPeriod: 'JAN_JUN_2026',
        }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    const adapter = new HttpBudgetPriorityAdapter();
    const result = await adapter.submit('health', {
      demographics: {
        fullName: 'Jane Citizen',
        phoneNumber: '0772123456',
        ageGroup: 'AGE_20_24',
        gender: 'FEMALE',
        districtId: 'district-1',
      },
      priorityAreas: {
        rankedAreas: ['PRIMARY_HEALTH_CARE', 'MATERNAL_HEALTH'],
      },
    });

    expect(result.bpId).toBe('bp-99');
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/api/v1/public/budget-priorities/health');

    const headers = new Headers(init.headers);
    expect(headers.has('Authorization')).toBe(false);
    expect(headers.get('Content-Type')).toBe('application/json');

    const body = JSON.parse(init.body as string) as Record<string, unknown>;
    expect(body).toEqual({
      demographics: {
        fullName: 'Jane Citizen',
        phoneNumber: '0772123456',
        ageGroup: 'AGE_20_24',
        gender: 'FEMALE',
        districtId: 'district-1',
      },
      priorityAreas: {
        rankedAreas: ['PRIMARY_HEALTH_CARE', 'MATERNAL_HEALTH'],
      },
    });
    expect(body).not.toHaveProperty('verificationToken');
  });
});
