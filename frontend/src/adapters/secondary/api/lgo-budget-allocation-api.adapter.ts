import { apiFetch, ApiError } from '../../../core/api/api-client';
import type {
  LgoBudgetAllocationSubmissionPayload,
  LgoBudgetAllocationSubmissionResult,
} from '../../../core/domain/lgo-budget-allocation-form.model';
import type { ILgoBudgetAllocationApiPort } from '../../../ports/lgo-budget-allocation-api.port';
import { useAuthStore } from '../../../core/store/useAuthStore';

interface BackendLgoBudgetAllocationResponse {
  submissionId: string;
  lbaId: string;
  status: string;
}

export const LGO_BUDGET_ALLOCATION_SUBMIT_PATH = '/api/v1/submissions/lgo-budget-allocation';

export function mapLgoBudgetAllocationSubmissionResponse(
  response: BackendLgoBudgetAllocationResponse
): LgoBudgetAllocationSubmissionResult {
  return {
    submissionId: response.submissionId,
    lbaId: response.lbaId,
    status: response.status,
  };
}

export class HttpLgoBudgetAllocationAdapter implements ILgoBudgetAllocationApiPort {
  constructor(private readonly getAccessToken: () => string | null = () => useAuthStore.getState().getAccessToken()) {}

  async submit(payload: LgoBudgetAllocationSubmissionPayload): Promise<LgoBudgetAllocationSubmissionResult> {
    const token = this.getAccessToken();
    if (!token) {
      throw new ApiError('Not authenticated', 401);
    }

    const response = await apiFetch<BackendLgoBudgetAllocationResponse>(
      LGO_BUDGET_ALLOCATION_SUBMIT_PATH,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      token
    );

    return mapLgoBudgetAllocationSubmissionResponse(response);
  }
}

export { ApiError };
