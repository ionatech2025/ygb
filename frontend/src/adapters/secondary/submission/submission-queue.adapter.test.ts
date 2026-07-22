import { beforeEach, describe, expect, it } from 'vitest';
import { submissionDb, submissionQueue } from './submission-queue.adapter';

const BASE_FIELDS = {
  collectorId: 'collector-1',
  deviceSubmissionId: '11111111-1111-1111-1111-111111111111',
  retryCount: 0,
  createdAt: new Date().toISOString(),
  respondentPhone: '0770000000',
  financialYearPeriod: 'JAN_JUN_2026',
  payload: { formType: 'BYP' as const },
};

describe('SubmissionQueueAdapter', () => {
  beforeEach(async () => {
    await submissionDb.pendingSubmissions.clear();
  });

  it('counts today local submissions', async () => {
    await submissionQueue.enqueue({
      ...BASE_FIELDS,
      formType: 'BYP',
      status: 'PENDING',
    });

    expect(await submissionQueue.countTodayLocal()).toBe(1);
    expect(await submissionQueue.countPending()).toBe(1);
  });

  it('marks synced entries and updates last synced timestamp', async () => {
    const localId = await submissionQueue.enqueue({
      ...BASE_FIELDS,
      formType: 'IYP',
      deviceSubmissionId: '22222222-2222-2222-2222-222222222222',
      status: 'PENDING',
      payload: { formType: 'IYP' },
    });

    await submissionQueue.markSynced(localId);

    expect(await submissionQueue.countPending()).toBe(0);
    expect(await submissionQueue.getLastSyncedAt()).toBeInstanceOf(Date);
  });
});
