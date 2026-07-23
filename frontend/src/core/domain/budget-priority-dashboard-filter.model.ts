import type { AgeGroup, Gender } from './form-validation.model';
import type { BudgetPrioritySection } from './budget-priority-section.model';

/** Mirrors backend Budget Priority dashboard filter query params (AND semantics; no PII). */
export interface BudgetPriorityDashboardFilter {
  section: BudgetPrioritySection | '';
  districtId: string;
  subcountyId: string;
  parishId: string;
  dateFrom: string;
  dateTo: string;
  gender: Gender | '';
  ageGroup: AgeGroup | '';
  financialYearPeriod: string;
}

export const EMPTY_BUDGET_PRIORITY_DASHBOARD_FILTER: BudgetPriorityDashboardFilter = {
  section: '',
  districtId: '',
  subcountyId: '',
  parishId: '',
  dateFrom: '',
  dateTo: '',
  gender: '',
  ageGroup: '',
  financialYearPeriod: '',
};

const FILTER_PARAM_KEYS = [
  'section',
  'districtId',
  'subcountyId',
  'parishId',
  'dateFrom',
  'dateTo',
  'gender',
  'ageGroup',
  'financialYearPeriod',
] as const satisfies ReadonlyArray<keyof BudgetPriorityDashboardFilter>;

export function hasActiveBudgetPriorityDashboardFilters(filter: BudgetPriorityDashboardFilter): boolean {
  return FILTER_PARAM_KEYS.some((key) => filter[key] !== '');
}

export function buildBudgetPriorityDashboardFilterQueryString(
  filter: BudgetPriorityDashboardFilter
): string {
  const params = new URLSearchParams();
  for (const key of FILTER_PARAM_KEYS) {
    const value = filter[key];
    if (value) {
      params.set(key, value);
    }
  }
  const query = params.toString();
  return query ? `?${query}` : '';
}

export function budgetPriorityDashboardFilterFromSearchParams(
  params: URLSearchParams
): BudgetPriorityDashboardFilter {
  return {
    section: (params.get('section') as BudgetPrioritySection | null) ?? '',
    districtId: params.get('districtId') ?? '',
    subcountyId: params.get('subcountyId') ?? '',
    parishId: params.get('parishId') ?? '',
    dateFrom: params.get('dateFrom') ?? '',
    dateTo: params.get('dateTo') ?? '',
    gender: (params.get('gender') as Gender | null) ?? '',
    ageGroup: (params.get('ageGroup') as AgeGroup | null) ?? '',
    financialYearPeriod: params.get('financialYearPeriod') ?? '',
  };
}

export function applyBudgetPriorityDashboardFilterPatch(
  current: BudgetPriorityDashboardFilter,
  patch: Partial<BudgetPriorityDashboardFilter>
): BudgetPriorityDashboardFilter {
  const next = { ...current, ...patch };
  if ('districtId' in patch && patch.districtId !== current.districtId) {
    next.subcountyId = patch.subcountyId ?? '';
    next.parishId = patch.parishId ?? '';
  } else if ('subcountyId' in patch && patch.subcountyId !== current.subcountyId) {
    next.parishId = patch.parishId ?? '';
  }
  return next;
}
