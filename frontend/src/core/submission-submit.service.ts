import type { PendingSubmissionInput } from './domain/pending-submission.model';
import { enrichPendingSubmission } from './build-pending-submission-index';
import { submissionQueue } from '../adapters/secondary/submission/submission-queue.adapter';
import { useAuthStore } from './store/useAuthStore';
import { useSubmissionCountStore } from './store/useSubmissionCountStore';
import { useSyncStore } from './store/useSyncStore';

export type { PendingSubmissionInput } from './domain/pending-submission.model';

export async function submitSurvey(submission: PendingSubmissionInput): Promise<number> {
  useSubmissionCountStore.getState().recordSubmission();

  const localId = await submissionQueue.enqueue(enrichPendingSubmission(submission));

  void useSubmissionCountStore.getState().refreshFromLocal();
  void useSyncStore.getState().refreshPendingCount();

  if (useAuthStore.getState().isOnline && useAuthStore.getState().getAccessToken()) {
    void useSyncStore.getState().triggerSync();
  }

  return localId;
}
