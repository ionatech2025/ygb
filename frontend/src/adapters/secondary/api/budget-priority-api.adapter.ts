import { apiFetch, ApiError } from '../../../core/api/api-client';
import type { BudgetPrioritySection } from '../../../core/domain/budget-priority-section.model';
import type {
  BudgetPrioritySubmissionPayload,
  BudgetPrioritySubmissionResult,
} from '../../../core/domain/budget-priority-submission.model';
import type { IBudgetPriorityApiPort } from '../../../ports/budget-priority-api.port';

interface BackendBudgetPrioritySubmissionResponse {
  bpId: string;
  status: string;
  section: string;
  financialYearPeriod: string;
}

export function buildBudgetPrioritySubmitPath(section: BudgetPrioritySection): string {
  return `/api/v1/public/budget-priorities/${section}`;
}

export function mapBudgetPrioritySubmissionResponse(
  response: BackendBudgetPrioritySubmissionResponse,
  section: BudgetPrioritySection
): BudgetPrioritySubmissionResult {
  return {
    bpId: response.bpId,
    status: response.status,
    section,
    financialYearPeriod: response.financialYearPeriod,
  };
}

export class HttpBudgetPriorityAdapter implements IBudgetPriorityApiPort {
  async submit(
    section: BudgetPrioritySection,
    payload: BudgetPrioritySubmissionPayload
  ): Promise<BudgetPrioritySubmissionResult> {
    const response = await apiFetch<BackendBudgetPrioritySubmissionResponse>(
      buildBudgetPrioritySubmitPath(section),
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );

    return mapBudgetPrioritySubmissionResponse(response, section);
  }
}

export { ApiError };
