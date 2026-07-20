import type { PendingSubmission } from '../core/domain/pending-submission.model';

export interface ISubmissionApiPort {
  syncSubmission(submission: PendingSubmission): Promise<void>;
}
