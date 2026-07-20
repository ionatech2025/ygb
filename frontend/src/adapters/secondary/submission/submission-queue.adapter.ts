import Dexie, { Table } from 'dexie';
import type { PendingSubmission } from '../../../core/domain/pending-submission.model';
import { isCreatedToday } from '../../../core/utils/submission-date.utils';
import type { ISubmissionQueuePort } from '../../../ports/submission-queue.port';

class YGBSubmissionDatabase extends Dexie {
  pendingSubmissions!: Table<PendingSubmission, number>;

  constructor() {
    super('YGBSubmissionDatabase');
    this.version(1).stores({
      pendingSubmissions: '++localId, formType, status, collectorId, deviceSubmissionId, createdAt',
    });
  }
}

export const submissionDb = new YGBSubmissionDatabase();

export class SubmissionQueueAdapter implements ISubmissionQueuePort {
  async enqueue(submission: Omit<PendingSubmission, 'localId'>): Promise<number> {
    return submissionDb.pendingSubmissions.add(submission as PendingSubmission);
  }

  async dequeueAll(): Promise<PendingSubmission[]> {
    return submissionDb.pendingSubmissions.where('status').equals('PENDING').sortBy('createdAt');
  }

  async markSynced(localId: number): Promise<void> {
    await submissionDb.pendingSubmissions.update(localId, {
      status: 'SYNCED',
      syncedAt: new Date().toISOString(),
    });
  }

  async markFailed(localId: number, retryCount: number): Promise<void> {
    await submissionDb.pendingSubmissions.update(localId, {
      status: 'PENDING',
      retryCount,
    });
  }

  async countPending(): Promise<number> {
    return submissionDb.pendingSubmissions.where('status').equals('PENDING').count();
  }

  async countTodayLocal(): Promise<number> {
    const entries = await submissionDb.pendingSubmissions.toArray();
    return entries.filter((entry) => isCreatedToday(entry.createdAt)).length;
  }

  async getLastSyncedAt(): Promise<Date | null> {
    const synced = await submissionDb.pendingSubmissions
      .where('status')
      .equals('SYNCED')
      .toArray();

    const timestamps = synced
      .map((entry) => entry.syncedAt)
      .filter((value): value is string => Boolean(value))
      .map((value) => new Date(value).getTime());

    if (timestamps.length === 0) return null;
    return new Date(Math.max(...timestamps));
  }
}

export const submissionQueue = new SubmissionQueueAdapter();
