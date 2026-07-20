import type { PendingSubmission } from './domain/pending-submission.model';
import { submissionQueue } from '../adapters/secondary/submission/submission-queue.adapter';
import { useAuthStore } from './store/useAuthStore';
import { useSubmissionCountStore } from './store/useSubmissionCountStore';
import { useSyncStore } from './store/useSyncStore';

export async function submitSurvey(submission: Omit<PendingSubmission, 'localId'>): Promise<number> {
  useSubmissionCountStore.getState().recordSubmission();

  const localId = await submissionQueue.enqueue(submission);

  void useSubmissionCountStore.getState().refreshFromLocal();
  void useSyncStore.getState().refreshPendingCount();

  if (useAuthStore.getState().isOnline && useAuthStore.getState().getAccessToken()) {
    void useSyncStore.getState().triggerSync();
  }

  return localId;
}
