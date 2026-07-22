import { beforeEach, describe, expect, it, vi } from 'vitest';
import { enrichPendingSubmission } from './build-pending-submission-index';
import { DuplicateRespondentError } from './duplicate-respondent.error';
import { submitSurvey } from './submission-submit.service';

const enqueueMock = vi.fn().mockResolvedValue(1);
const recordSubmissionMock = vi.fn();
const incrementPendingMock = vi.fn();
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
      triggerSync: vi.fn().mockResolvedValue(undefined),
    }),
  },
}));

vi.mock('./store/useAuthStore', () => ({
  useAuthStore: {
    getState: () => ({
      isOnline: false,
      getAccessToken: () => null,
    }),
  },
}));

describe('submitSurvey index fields', () => {
  beforeEach(() => {
    enqueueMock.mockClear();
    recordSubmissionMock.mockClear();
    incrementPendingMock.mockClear();
    validateMock.mockResolvedValue({ valid: true });
  });

  it('populates respondentPhone and financialYearPeriod on enqueue', async () => {
    await submitSurvey({
      formType: 'BYP',
      collectorId: 'collector-1',
      deviceSubmissionId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      status: 'PENDING',
      retryCount: 0,
      createdAt: '2026-03-15T10:00:00.000Z',
      payload: {
        respondentPhone: '0772111222',
        formCompletedAt: '2026-03-15T10:00:00.000Z',
      },
    });

    expect(enqueueMock).toHaveBeenCalledTimes(1);
    expect(incrementPendingMock).toHaveBeenCalledTimes(1);
    expect(enqueueMock.mock.calls[0][0]).toMatchObject({
      respondentPhone: '0772111222',
      financialYearPeriod: 'JAN_JUN_2026',
    });
  });

  it('throws DuplicateRespondentError and skips enqueue when duplicate exists', async () => {
    validateMock.mockResolvedValueOnce({
      valid: false,
      message: 'BYP form already submitted for this respondent in Jan–Jun 2026.',
    });

    await expect(
      submitSurvey({
        formType: 'BYP',
        collectorId: 'collector-1',
        deviceSubmissionId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        status: 'PENDING',
        retryCount: 0,
        createdAt: '2026-03-15T10:00:00.000Z',
        payload: {
          respondentPhone: '0772111222',
          formCompletedAt: '2026-03-15T10:00:00.000Z',
        },
      })
    ).rejects.toBeInstanceOf(DuplicateRespondentError);

    expect(recordSubmissionMock).not.toHaveBeenCalled();
    expect(incrementPendingMock).not.toHaveBeenCalled();
    expect(enqueueMock).not.toHaveBeenCalled();
  });

  it('derives index fields from payload via enrichPendingSubmission', () => {
    const enriched = enrichPendingSubmission({
      formType: 'IYP',
      collectorId: 'collector-1',
      deviceSubmissionId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      status: 'PENDING',
      retryCount: 0,
      createdAt: '2026-08-01T09:00:00.000Z',
      payload: {
        respondentPhone: '0773000111',
        formCompletedAt: '2026-08-01T09:00:00.000Z',
      },
    });

    expect(enriched.respondentPhone).toBe('0773000111');
    expect(enriched.financialYearPeriod).toBe('JUL_DEC_2026');
  });
});
