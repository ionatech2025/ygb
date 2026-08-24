import type { FormType } from './form-type.model';

export interface CollectorSubmissionListFilter {
  formType: FormType | '';
  dateFrom: string;
  dateTo: string;
  financialYearPeriod: string;
}

export const EMPTY_COLLECTOR_SUBMISSION_FILTER: CollectorSubmissionListFilter = {
  formType: '',
  dateFrom: '',
  dateTo: '',
  financialYearPeriod: '',
};

export function respondentNameFromPendingPayload(payload: object): string {
  if (
    'respondentName' in payload &&
    typeof payload.respondentName === 'string' &&
    payload.respondentName.trim()
  ) {
    return payload.respondentName.trim();
  }
  return 'Unnamed respondent';
}
