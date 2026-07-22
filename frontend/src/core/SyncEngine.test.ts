import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from './api/api-client';
import type { PendingSubmission } from './domain/pending-submission.model';
import { SyncEngine } from './SyncEngine';
import type { ISubmissionApiPort } from '../ports/submission-api.port';
import type { ISubmissionQueuePort } from '../ports/submission-queue.port';

const BASE: PendingSubmission = {
  localId: 1,
  formType: 'BYP',
  collectorId: 'collector-1',
  deviceSubmissionId: '11111111-1111-1111-1111-111111111111',
  status: 'PENDING',
  retryCount: 0,
  createdAt: '2026-07-22T10:00:00.000Z',
  respondentPhone: '0772111222',
  financialYearPeriod: 'JAN_JUN_2026',
  payload: {},
};

function createQueue(pending: PendingSubmission[]): ISubmissionQueuePort {
  return {
    enqueue: vi.fn(),
    dequeueAll: vi.fn().mockResolvedValue(pending),
    markSynced: vi.fn().mockResolvedValue(undefined),
    markFailed: vi.fn().mockResolvedValue(undefined),
    countPending: vi.fn(),
    countTodayLocal: vi.fn(),
    getLastSyncedAt: vi.fn(),
  };
}

describe('SyncEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('processes pending entries oldest-first', async () => {
    const first = { ...BASE, localId: 1, createdAt: '2026-07-22T09:00:00.000Z' };
    const second = { ...BASE, localId: 2, createdAt: '2026-07-22T10:00:00.000Z' };
    const queue = createQueue([first, second]);
    const api: ISubmissionApiPort = {
      syncSubmission: vi.fn().mockResolvedValue(undefined),
    };

    await new SyncEngine(queue, api).syncPending();

    expect(api.syncSubmission).toHaveBeenNthCalledWith(1, first);
    expect(api.syncSubmission).toHaveBeenNthCalledWith(2, second);
  });

  it('marks synced on success and reports failure with incremented retry count', async () => {
    const queue = createQueue([BASE]);
    const api: ISubmissionApiPort = {
      syncSubmission: vi.fn().mockRejectedValue(new Error('Server unavailable')),
    };
    const onFailed = vi.fn();

    await new SyncEngine(queue, api, { onFailed }).syncPending();

    expect(queue.markFailed).toHaveBeenCalledWith(1, 1);
    expect(onFailed).toHaveBeenCalledWith(1, 'Server unavailable', 1);
  });

  it('treats 409 conflict as synced', async () => {
    const queue = createQueue([BASE]);
    const api: ISubmissionApiPort = {
      syncSubmission: vi.fn().mockRejectedValue(new ApiError('Duplicate', 409)),
    };
    const onSynced = vi.fn();

    await new SyncEngine(queue, api, { onSynced }).syncPending();

    expect(queue.markSynced).toHaveBeenCalledWith(1);
    expect(queue.markFailed).not.toHaveBeenCalled();
    expect(onSynced).toHaveBeenCalledWith(1);
  });
});
