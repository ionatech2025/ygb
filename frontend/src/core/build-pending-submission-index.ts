import type { PendingSubmission, PendingSubmissionInput } from './domain/pending-submission.model';
import { deriveFinancialYearPeriod, toFinancialYearPeriodKey } from './financial-year-period';
import { normalizeUgandaPhoneLocal } from './utils/phone-utils';

interface SubmissionPayloadIndexSource {
  respondentPhone?: string;
  formCompletedAt?: string;
}

export function buildPendingSubmissionIndexFields(
  payload: object,
  createdAt: string
): Pick<PendingSubmission, 'respondentPhone' | 'financialYearPeriod'> {
  const source = payload as SubmissionPayloadIndexSource;
  const respondentPhone = normalizeUgandaPhoneLocal(source.respondentPhone ?? '');
  const completedAt = source.formCompletedAt ?? createdAt;
  const financialYearPeriod = toFinancialYearPeriodKey(
    deriveFinancialYearPeriod(new Date(completedAt))
  );

  return { respondentPhone, financialYearPeriod };
}

export function enrichPendingSubmission(
  submission: PendingSubmissionInput
): Omit<PendingSubmission, 'localId'> {
  return {
    ...submission,
    ...buildPendingSubmissionIndexFields(submission.payload, submission.createdAt),
  };
}
