import type { PendingSubmission } from '../core/domain/pending-submission.model';

export interface ISubmissionQueuePort {
  enqueue(submission: Omit<PendingSubmission, 'localId'>): Promise<number>;
}
