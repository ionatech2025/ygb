import { beforeEach, describe, expect, it } from 'vitest';
import { submissionDb, submissionQueue } from './submission-queue.adapter';

describe('SubmissionQueueAdapter', () => {
  beforeEach(async () => {
    await submissionDb.pendingSubmissions.clear();
  });

  it('counts today local submissions', async () => {
    await submissionQueue.enqueue({
      formType: 'BYP',
      collectorId: 'collector-1',
      deviceSubmissionId: '11111111-1111-1111-1111-111111111111',
      status: 'PENDING',
      retryCount: 0,
      createdAt: new Date().toISOString(),
      payload: { formType: 'BYP' },
    });

    expect(await submissionQueue.countTodayLocal()).toBe(1);
    expect(await submissionQueue.countPending()).toBe(1);
  });

  it('marks synced entries and updates last synced timestamp', async () => {
    const localId = await submissionQueue.enqueue({
      formType: 'IYP',
      collectorId: 'collector-1',
      deviceSubmissionId: '22222222-2222-2222-2222-222222222222',
      status: 'PENDING',
      retryCount: 0,
      createdAt: new Date().toISOString(),
      payload: { formType: 'IYP' },
    });

    await submissionQueue.markSynced(localId);

    expect(await submissionQueue.countPending()).toBe(0);
    expect(await submissionQueue.getLastSyncedAt()).toBeInstanceOf(Date);
  });
});
