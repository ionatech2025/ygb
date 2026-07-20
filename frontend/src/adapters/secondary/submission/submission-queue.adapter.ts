import Dexie, { Table } from 'dexie';
import type { PendingSubmission } from '../../../core/domain/pending-submission.model';
import type { ISubmissionQueuePort } from '../../../ports/submission-queue.port';

class YGBSubmissionDatabase extends Dexie {
  pendingSubmissions!: Table<PendingSubmission, number>;

  constructor() {
    super('YGBSubmissionDatabase');
    this.version(1).stores({
      pendingSubmissions: '++id, formType, status, collectorId, deviceSubmissionId, createdAt',
    });
  }
}

const db = new YGBSubmissionDatabase();

export class SubmissionQueueAdapter implements ISubmissionQueuePort {
  async enqueue(submission: Omit<PendingSubmission, 'localId'>): Promise<number> {
    return db.pendingSubmissions.add(submission as PendingSubmission);
  }
}

export const submissionQueue = new SubmissionQueueAdapter();
