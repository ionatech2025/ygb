import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { LgoBudgetAllocationSubmissionPayload } from './domain/lgo-budget-allocation-form.model';
import { DuplicateRespondentError } from './duplicate-respondent.error';
import { submitLgoBudgetAllocation } from './lgo-budget-allocation-submit.service';

const enqueueMock = vi.fn().mockResolvedValue(1);
const recordSubmissionMock = vi.fn();
const incrementPendingMock = vi.fn();
const triggerSyncMock = vi.fn().mockResolvedValue(undefined);
const validateMock = vi.fn().mockResolvedValue({ valid: true });

vi.mock('../adapters/secondary/submission/submission-queue.adapter', () => ({
  submissionQueue: { enqueue: (...args: unknown[]) => enqueueMock(...args) },
}));

vi.mock('./respondent-uniqueness.validation', () => ({
  validateRespondentUniqueness: (...args: unknown[]) => validateMock(...args),
}));

vi.mock('./store/useSubmissionCountStore', () => ({
  useSubmissionCountStore: {
    getState: () => ({
      recordSubmission: recordSubmissionMock,
      refreshFromLocal: vi.fn().mockResolvedValue(undefined),
    }),
  },
}));

vi.mock('./store/useSyncStore', () => ({
  useSyncStore: {
    getState: () => ({
      refreshPendingCount: vi.fn().mockResolvedValue(undefined),
      incrementPendingCount: incrementPendingMock,
      triggerSync: triggerSyncMock,
    }),
  },
}));

const authState = {
  isOnline: false,
  getAccessToken: () => null as string | null,
};

vi.mock('./store/useAuthStore', () => ({
  useAuthStore: {
    getState: () => authState,
  },
}));

const samplePayload: LgoBudgetAllocationSubmissionPayload = {
  deviceSubmissionId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  formCompletedAt: '2026-03-15T10:00:00.000Z',
  respondent: {
    name: 'District Health Officer',
    phone: '0772555666',
    gender: 'FEMALE',
    ageGroup: 'AGE_30_AND_ABOVE',
    districtId: '11111111-1111-1111-1111-111111111111',
    subcountyId: '22222222-2222-2222-2222-222222222222',
    parishId: '33333333-3333-3333-3333-333333333333',
    villageId: '44444444-4444-4444-4444-444444444444',
  },
  priorYearAllocations: {
    health: { amount: 1_200_000, percentage: 28 },
  },
  rationale: 'Health and education received the largest shares due to service delivery gaps.',
  recommendations: 'Increase agriculture extension funding and climate resilience programmes.',
};

describe('submitLgoBudgetAllocation', () => {
  beforeEach(() => {
    enqueueMock.mockClear();
    recordSubmissionMock.mockClear();
    incrementPendingMock.mockClear();
    triggerSyncMock.mockClear();
    validateMock.mockResolvedValue({ valid: true });
    authState.isOnline = false;
    authState.getAccessToken = () => null;
  });

  it('enqueues payload with deviceSubmissionId and LGO_BUDGET_ALLOCATION form type', async () => {
    await submitLgoBudgetAllocation(samplePayload, 'collector-1');

    expect(validateMock).toHaveBeenCalledWith({
      formType: 'LGO_BUDGET_ALLOCATION',
      respondentPhone: '0772555666',
      completedAt: samplePayload.formCompletedAt,
    });
    expect(enqueueMock).toHaveBeenCalledTimes(1);
    expect(enqueueMock.mock.calls[0][0]).toMatchObject({
      formType: 'LGO_BUDGET_ALLOCATION',
      collectorId: 'collector-1',
      deviceSubmissionId: samplePayload.deviceSubmissionId,
      payload: samplePayload,
      respondentPhone: '0772555666',
      financialYearPeriod: 'JAN_JUN_2026',
    });
  });

  it('triggers sync when online and authenticated', async () => {
    authState.isOnline = true;
    authState.getAccessToken = () => 'collector-token';

    await submitLgoBudgetAllocation(samplePayload, 'collector-1');

    expect(triggerSyncMock).toHaveBeenCalledTimes(1);
  });

  it('throws DuplicateRespondentError and skips enqueue when duplicate exists', async () => {
    validateMock.mockResolvedValueOnce({
      valid: false,
      message: 'LGO Budget Allocation form already submitted for this respondent in Jan–Jun 2026.',
    });

    await expect(submitLgoBudgetAllocation(samplePayload, 'collector-1')).rejects.toBeInstanceOf(
      DuplicateRespondentError
    );
    expect(enqueueMock).not.toHaveBeenCalled();
  });
});
