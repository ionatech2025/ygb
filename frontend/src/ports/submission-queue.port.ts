import type { PendingSubmission } from '../core/domain/pending-submission.model';

export interface ISubmissionQueuePort {
  enqueue(submission: Omit<PendingSubmission, 'localId'>): Promise<number>;
  dequeueAll(): Promise<PendingSubmission[]>;
  markSynced(localId: number): Promise<void>;
  markFailed(localId: number, retryCount: number): Promise<void>;
  countPending(): Promise<number>;
  countTodayLocal(): Promise<number>;
  getLastSyncedAt(): Promise<Date | null>;
}
