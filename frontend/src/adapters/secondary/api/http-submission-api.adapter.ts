import { apiFetch, ApiError } from '../../../core/api/api-client';
import type { PendingSubmission } from '../../../core/domain/pending-submission.model';
import { useAuthStore } from '../../../core/store/useAuthStore';
import type { ISubmissionApiPort } from '../../../ports/submission-api.port';

export class HttpSubmissionApiAdapter implements ISubmissionApiPort {
  async syncSubmission(submission: PendingSubmission): Promise<void> {
    const token = useAuthStore.getState().getAccessToken();
    if (!token) {
      throw new ApiError('Not authenticated', 401);
    }

    await apiFetch('/api/v1/submissions', {
      method: 'POST',
      body: JSON.stringify(submission.payload),
    }, token);
  }
}

export const httpSubmissionApi = new HttpSubmissionApiAdapter();
