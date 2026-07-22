import { beforeEach, describe, expect, it } from 'vitest';
import type { PendingSubmission } from '../../../core/domain/pending-submission.model';
import { submissionDb, submissionQueue } from './submission-queue.adapter';
import { respondentUniqueness } from './respondent-uniqueness.adapter';

const BASE_SUBMISSION = {
  collectorId: 'collector-1',
  deviceSubmissionId: '11111111-1111-1111-1111-111111111111',
  retryCount: 0,
  createdAt: '2026-03-15T10:00:00.000Z',
  respondentPhone: '0772111222',
  financialYearPeriod: 'JAN_JUN_2026',
  payload: {
    formType: 'BYP',
    respondentPhone: '0772111222',
    formCompletedAt: '2026-03-15T10:00:00.000Z',
  },
} satisfies Omit<PendingSubmission, 'localId' | 'formType' | 'status'>;

describe('RespondentUniquenessAdapter', () => {
  beforeEach(async () => {
    await submissionDb.pendingSubmissions.clear();
  });

  it('returns true after enqueueing the same form type, phone, and FY period', async () => {
    await submissionQueue.enqueue({
      ...BASE_SUBMISSION,
      formType: 'BYP',
      status: 'PENDING',
    });

    await expect(
      respondentUniqueness.existsLocalDuplicate('BYP', '0772111222', 'JAN_JUN_2026')
    ).resolves.toBe(true);
  });

  it('allows the same phone for a different form type in the same period (TC-UNIQ-01-02)', async () => {
    await submissionQueue.enqueue({
      ...BASE_SUBMISSION,
      formType: 'BYP',
      status: 'SYNCED',
    });

    await expect(
      respondentUniqueness.existsLocalDuplicate('IYP', '0772111222', 'JAN_JUN_2026')
    ).resolves.toBe(false);
  });

  it('allows the same phone and form type in a different FY period (TC-UNIQ-01-03)', async () => {
    await submissionQueue.enqueue({
      ...BASE_SUBMISSION,
      formType: 'BYP',
      status: 'PENDING',
    });

    await expect(
      respondentUniqueness.existsLocalDuplicate('BYP', '0772111222', 'JUL_DEC_2026')
    ).resolves.toBe(false);
  });

  it('ignores FAILED records when checking for duplicates', async () => {
    await submissionQueue.enqueue({
      ...BASE_SUBMISSION,
      formType: 'BYP',
      status: 'FAILED',
    });

    await expect(
      respondentUniqueness.existsLocalDuplicate('BYP', '0772111222', 'JAN_JUN_2026')
    ).resolves.toBe(false);
  });

  it('normalises phone numbers before matching', async () => {
    await submissionQueue.enqueue({
      ...BASE_SUBMISSION,
      formType: 'BYP',
      status: 'PENDING',
      respondentPhone: '0772111222',
    });

    await expect(
      respondentUniqueness.existsLocalDuplicate('BYP', '+256772111222', 'JAN_JUN_2026')
    ).resolves.toBe(true);
  });
});
