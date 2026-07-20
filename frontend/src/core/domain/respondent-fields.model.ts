import type { AgeGroup } from './form-validation.model';
import type { LocationFields } from './admin-location.model';
import { EMPTY_LOCATION_FIELDS } from './admin-location.model';

export interface RespondentFields extends LocationFields {
  respondentName: string;
  respondentPhone: string;
  respondentGender: string;
  respondentAgeGroup: AgeGroup | '';
  exactAge?: number;
}

export const EMPTY_RESPONDENT_FIELDS: RespondentFields = {
  ...EMPTY_LOCATION_FIELDS,
  respondentName: '',
  respondentPhone: '',
  respondentGender: '',
  respondentAgeGroup: '',
};

export interface SubmissionProvenance {
  deviceSubmissionId: string;
  formCompletedAt: string;
  collectorId: string;
}

export interface AuthProvenanceSnapshot {
  collectorId: string;
}
