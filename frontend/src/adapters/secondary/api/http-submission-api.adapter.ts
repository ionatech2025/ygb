import { apiFetch, ApiError } from '../../../core/api/api-client';
import type { PendingSubmission } from '../../../core/domain/pending-submission.model';
import { useAuthStore } from '../../../core/store/useAuthStore';
import type { ISubmissionApiPort } from '../../../ports/submission-api.port';
import { LGO_BUDGET_ALLOCATION_SUBMIT_PATH } from './lgo-budget-allocation-api.adapter';

export function resolveSubmissionSyncPath(formType: PendingSubmission['formType']): string {
  if (formType === 'LGO_BUDGET_ALLOCATION') {
    return LGO_BUDGET_ALLOCATION_SUBMIT_PATH;
  }
  return '/api/v1/submissions';
}

export class HttpSubmissionApiAdapter implements ISubmissionApiPort {
  async syncSubmission(submission: PendingSubmission): Promise<void> {
    const token = useAuthStore.getState().getAccessToken();
    if (!token) {
      throw new ApiError('Not authenticated', 401);
    }

    await apiFetch(
      resolveSubmissionSyncPath(submission.formType),
      {
        method: 'POST',
        body: JSON.stringify(submission.payload),
      },
      token
    );
  }
}

export const httpSubmissionApi = new HttpSubmissionApiAdapter();
