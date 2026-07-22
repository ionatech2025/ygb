import type { FormType } from './form-type.model';

export interface SubmissionSummary {
  id: string;
  formType: FormType;
  respondentName: string;
  districtId: string;
  districtName: string;
  collectorId: string;
  collectorName: string;
  formCompletedAt: string;
  syncedAt: string | null;
  status: string;
  financialYearPeriod: string;
}

export interface SubmissionPage {
  items: SubmissionSummary[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
}

export type SubmissionPayload = Record<string, unknown> & {
  formType: FormType;
};

export interface SubmissionDetail {
  id: string;
  collectorId: string;
  collectorName: string;
  status: string;
  formCompletedAt: string;
  syncedAt: string | null;
  financialYearPeriod: string;
  payload: SubmissionPayload;
}

export interface DetailFieldRow {
  label: string;
  value: string;
}

export interface DetailFieldSection {
  title: string;
  rows: DetailFieldRow[];
}
