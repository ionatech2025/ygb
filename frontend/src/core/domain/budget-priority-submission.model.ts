import type { AgeGroup, Gender } from './form-validation.model';
import type { BudgetPrioritySection } from './budget-priority-section.model';

export interface BudgetPriorityDemographicsFields {
  fullName: string;
  phoneNumber: string;
  ageGroup: AgeGroup | '';
  gender: Gender | '';
  districtId: string;
}

export interface BudgetPrioritySubmissionPayload {
  demographics: {
    fullName: string;
    phoneNumber: string;
    ageGroup: AgeGroup;
    gender: Gender;
    districtId: string;
  };
  priorityAreas: {
    rankedAreas: string[];
  };
}

export interface BudgetPrioritySubmissionResult {
  bpId: string;
  status: string;
  section: BudgetPrioritySection;
  financialYearPeriod: string;
}

export const EMPTY_BUDGET_PRIORITY_DEMOGRAPHICS: BudgetPriorityDemographicsFields = {
  fullName: '',
  phoneNumber: '',
  ageGroup: '',
  gender: '',
  districtId: '',
};

export function buildBudgetPrioritySubmissionPayload(
  demographics: BudgetPriorityDemographicsFields,
  rankedAreas: string[]
): BudgetPrioritySubmissionPayload {
  return {
    demographics: {
      fullName: demographics.fullName.trim(),
      phoneNumber: demographics.phoneNumber.trim(),
      ageGroup: demographics.ageGroup as AgeGroup,
      gender: demographics.gender as Gender,
      districtId: demographics.districtId,
    },
    priorityAreas: { rankedAreas: [...rankedAreas] },
  };
}
