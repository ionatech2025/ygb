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

  it('lists pending and failed items without removing them', async () => {
    await submissionQueue.enqueue({
      ...BASE_FIELDS,
      formType: 'BYP',
      status: 'PENDING',
    });
    const failedId = await submissionQueue.enqueue({
      ...BASE_FIELDS,
      formType: 'IYP',
      deviceSubmissionId: '33333333-3333-3333-3333-333333333333',
      status: 'FAILED',
      payload: { formType: 'IYP' },
    });
    await submissionQueue.enqueue({
      ...BASE_FIELDS,
      formType: 'PC',
      deviceSubmissionId: '44444444-4444-4444-4444-444444444444',
      status: 'SYNCED',
      payload: { formType: 'PC' },
    });

    const listed = await submissionQueue.listPending();

    expect(listed.map((item) => item.formType)).toEqual(['BYP', 'IYP']);
    expect(listed.map((item) => item.localId)).toContain(failedId);
    expect(await submissionQueue.countPending()).toBe(1);
  });
});
