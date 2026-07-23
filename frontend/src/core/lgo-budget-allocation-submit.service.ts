import type { LgoBudgetAllocationSubmissionPayload } from './domain/lgo-budget-allocation-form.model';
import { DuplicateRespondentError } from './duplicate-respondent.error';
import { validateRespondentUniqueness } from './respondent-uniqueness.validation';
import { submitSurvey } from './submission-submit.service';

export async function submitLgoBudgetAllocation(
  payload: LgoBudgetAllocationSubmissionPayload,
  collectorId: string
): Promise<number> {
  const uniqueness = await validateRespondentUniqueness({
    formType: 'LGO_BUDGET_ALLOCATION',
    respondentPhone: payload.respondent.phone,
    completedAt: payload.formCompletedAt,
  });

  if (!uniqueness.valid) {
    throw new DuplicateRespondentError(uniqueness.message);
  }

  return submitSurvey({
    formType: 'LGO_BUDGET_ALLOCATION',
    collectorId,
    deviceSubmissionId: payload.deviceSubmissionId,
    status: 'PENDING',
    retryCount: 0,
    createdAt: payload.formCompletedAt,
    payload,
  });
}
