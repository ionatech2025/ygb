import type { AgeGroup } from './form-validation.model';
import type { RespondentFields } from './respondent-fields.model';
import type { SubmissionProvenance } from './respondent-fields.model';
import { EMPTY_RESPONDENT_FIELDS } from './respondent-fields.model';
import { parseFundAmount } from '../lgo-validation';

/** Config-driven sector list — copy may be refined in require-polishing.md. */
export const LGO_BUDGET_ALLOCATION_SECTORS = [
  { id: 'health', label: 'Health' },
  { id: 'education', label: 'Education' },
  { id: 'agriculture', label: 'Agriculture' },
  { id: 'works', label: 'Works & Infrastructure' },
  { id: 'water', label: 'Water & Environment' },
  { id: 'administration', label: 'Administration & Governance' },
  { id: 'other', label: 'Other sectors' },
] as const;

export type LgoBudgetAllocationSectorId = (typeof LGO_BUDGET_ALLOCATION_SECTORS)[number]['id'];

export interface PriorYearSectorAllocationFields {
  amount: string;
  percentage: string;
}

export type PriorYearAllocationFields = Record<LgoBudgetAllocationSectorId, PriorYearSectorAllocationFields>;

export interface LgoBudgetAllocationFormState {
  respondent: RespondentFields;
  priorYearAllocations: PriorYearAllocationFields;
  rationale: string;
  recommendations: string;
}

export interface LgoBudgetAllocationRespondentPayload {
  name: string;
  phone: string;
  gender: string;
  ageGroup: AgeGroup;
  districtId: string;
  subcountyId: string;
  parishId: string;
  villageId: string;
}

export interface LgoBudgetAllocationSubmissionPayload {
  deviceSubmissionId: string;
  formCompletedAt: string;
  respondent: LgoBudgetAllocationRespondentPayload;
  priorYearAllocations: Record<string, { amount: number; percentage?: number }>;
  rationale: string;
  recommendations: string;
}

export interface LgoBudgetAllocationSubmissionResult {
  submissionId: string;
  lbaId: string;
  status: string;
}

function createEmptyPriorYearAllocationFields(): PriorYearAllocationFields {
  return Object.fromEntries(
    LGO_BUDGET_ALLOCATION_SECTORS.map((sector) => [sector.id, { amount: '', percentage: '' }])
  ) as PriorYearAllocationFields;
}

export const EMPTY_LGO_BUDGET_ALLOCATION_FORM_STATE: LgoBudgetAllocationFormState = {
  respondent: EMPTY_RESPONDENT_FIELDS,
  priorYearAllocations: createEmptyPriorYearAllocationFields(),
  rationale: '',
  recommendations: '',
};

export function parseAllocationPercentage(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return null;
  const parsed = Number.parseFloat(trimmed);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) return null;
  return parsed;
}

export function buildLgoBudgetAllocationSubmissionPayload(
  state: LgoBudgetAllocationFormState,
  provenance: SubmissionProvenance
): LgoBudgetAllocationSubmissionPayload {
  const priorYearAllocations: Record<string, { amount: number; percentage?: number }> = {};

  for (const sector of LGO_BUDGET_ALLOCATION_SECTORS) {
    const row = state.priorYearAllocations[sector.id];
    const amount = parseFundAmount(row.amount);
    if (amount == null || amount <= 0) {
      continue;
    }

    const entry: { amount: number; percentage?: number } = { amount };
    const percentage = parseAllocationPercentage(row.percentage);
    if (percentage != null) {
      entry.percentage = percentage;
    }
    priorYearAllocations[sector.id] = entry;
  }

  return {
    deviceSubmissionId: provenance.deviceSubmissionId,
    formCompletedAt: provenance.formCompletedAt,
    respondent: {
      name: state.respondent.respondentName.trim(),
      phone: state.respondent.respondentPhone.trim(),
      gender: state.respondent.respondentGender,
      ageGroup: state.respondent.respondentAgeGroup as AgeGroup,
      districtId: state.respondent.districtId,
      subcountyId: state.respondent.subcountyId,
      parishId: state.respondent.parishId,
      villageId: state.respondent.villageId,
    },
    priorYearAllocations,
    rationale: state.rationale.trim(),
    recommendations: state.recommendations.trim(),
  };
}

/** @deprecated Use EMPTY_LGO_BUDGET_ALLOCATION_FORM_STATE — kept for issue 001 compatibility. */
export type LgoBudgetAllocationFormDraft = Pick<
  LgoBudgetAllocationFormState,
  'priorYearAllocations' | 'rationale' | 'recommendations'
>;

export const EMPTY_LGO_BUDGET_ALLOCATION_FORM_DRAFT: LgoBudgetAllocationFormDraft = {
  priorYearAllocations: createEmptyPriorYearAllocationFields(),
  rationale: '',
  recommendations: '',
};
