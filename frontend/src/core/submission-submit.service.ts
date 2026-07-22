import type { PendingSubmissionInput } from './domain/pending-submission.model';
import { enrichPendingSubmission } from './build-pending-submission-index';
import { DuplicateRespondentError } from './duplicate-respondent.error';
import { validateRespondentUniqueness } from './respondent-uniqueness.validation';
import { submissionQueue } from '../adapters/secondary/submission/submission-queue.adapter';
import { useAuthStore } from './store/useAuthStore';
import { useSubmissionCountStore } from './store/useSubmissionCountStore';
import { useSyncStore } from './store/useSyncStore';

export type { PendingSubmissionInput } from './domain/pending-submission.model';
export { DuplicateRespondentError } from './duplicate-respondent.error';

interface SubmissionPayloadSource {
  respondentPhone?: string;
  formCompletedAt?: string;
}

export async function submitSurvey(submission: PendingSubmissionInput): Promise<number> {
  const payload = submission.payload as SubmissionPayloadSource;
  const uniqueness = await validateRespondentUniqueness({
    formType: submission.formType,
    respondentPhone: payload.respondentPhone ?? '',
    completedAt: payload.formCompletedAt ?? submission.createdAt,
  });

  if (!uniqueness.valid) {
    throw new DuplicateRespondentError(uniqueness.message);
  }

  useSubmissionCountStore.getState().recordSubmission();
  useSyncStore.getState().incrementPendingCount();

  const localId = await submissionQueue.enqueue(enrichPendingSubmission(submission));

  void useSubmissionCountStore.getState().refreshFromLocal();
  void useSyncStore.getState().refreshPendingCount();

  if (useAuthStore.getState().isOnline && useAuthStore.getState().getAccessToken()) {
    void useSyncStore.getState().triggerSync();
  }

  return localId;
}
