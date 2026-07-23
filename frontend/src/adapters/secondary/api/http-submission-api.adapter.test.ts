import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { PendingSubmission } from '../../../core/domain/pending-submission.model';
import {
  HttpSubmissionApiAdapter,
  resolveSubmissionSyncPath,
} from './http-submission-api.adapter';
import { LGO_BUDGET_ALLOCATION_SUBMIT_PATH } from './lgo-budget-allocation-api.adapter';

vi.mock('../../../core/store/useAuthStore', () => ({
  useAuthStore: {
    getState: () => ({
      getAccessToken: () => 'collector-token',
    }),
  },
}));

describe('http-submission-api.adapter', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('routes LGO budget allocation queue items to the dedicated endpoint', () => {
    expect(resolveSubmissionSyncPath('LGO_BUDGET_ALLOCATION')).toBe(LGO_BUDGET_ALLOCATION_SUBMIT_PATH);
    expect(resolveSubmissionSyncPath('BYP')).toBe('/api/v1/submissions');
  });

  it('POSTs queued LGO budget allocation payload to the collector endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ submissionId: 'sub-1', lbaId: 'lba-1', status: 'SYNCED' }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    const submission: PendingSubmission = {
      localId: 1,
      formType: 'LGO_BUDGET_ALLOCATION',
      collectorId: 'collector-1',
      deviceSubmissionId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      status: 'PENDING',
      retryCount: 0,
      createdAt: '2026-03-15T10:00:00.000Z',
      respondentPhone: '0772555666',
      financialYearPeriod: 'JAN_JUN_2026',
      payload: {
        deviceSubmissionId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        rationale: 'Sample rationale text here.',
      },
    };

    await new HttpSubmissionApiAdapter().syncSubmission(submission);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain(LGO_BUDGET_ALLOCATION_SUBMIT_PATH);
    expect(new Headers(init.headers).get('Authorization')).toBe('Bearer collector-token');
    expect(JSON.parse(init.body as string)).toMatchObject({
      deviceSubmissionId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    });
  });
});
