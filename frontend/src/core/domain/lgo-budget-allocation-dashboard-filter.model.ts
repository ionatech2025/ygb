import type { AgeGroup, Gender } from './form-validation.model';

/** Mirrors backend LGO Budget Allocation dashboard filter query params (AND semantics; no PII). */
export interface LgoBudgetAllocationDashboardFilter {
  districtId: string;
  subcountyId: string;
  parishId: string;
  dateFrom: string;
  dateTo: string;
  gender: Gender | '';
  ageGroup: AgeGroup | '';
  financialYearPeriod: string;
}

export const EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_FILTER: LgoBudgetAllocationDashboardFilter = {
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
  'districtId',
  'subcountyId',
  'parishId',
  'dateFrom',
  'dateTo',
  'gender',
  'ageGroup',
  'financialYearPeriod',
] as const satisfies ReadonlyArray<keyof LgoBudgetAllocationDashboardFilter>;

export function hasActiveLgoBudgetAllocationDashboardFilters(
  filter: LgoBudgetAllocationDashboardFilter
): boolean {
  return FILTER_PARAM_KEYS.some((key) => filter[key] !== '');
}

export function buildLgoBudgetAllocationDashboardFilterQueryString(
  filter: LgoBudgetAllocationDashboardFilter
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

export function lgoBudgetAllocationDashboardFilterFromSearchParams(
  params: URLSearchParams
): LgoBudgetAllocationDashboardFilter {
  return {
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

export function applyLgoBudgetAllocationDashboardFilterPatch(
  current: LgoBudgetAllocationDashboardFilter,
  patch: Partial<LgoBudgetAllocationDashboardFilter>
): LgoBudgetAllocationDashboardFilter {
  const next = { ...current, ...patch };
  if ('districtId' in patch && patch.districtId !== current.districtId) {
    next.subcountyId = patch.subcountyId ?? '';
    next.parishId = patch.parishId ?? '';
  } else if ('subcountyId' in patch && patch.subcountyId !== current.subcountyId) {
    next.parishId = patch.parishId ?? '';
  }
  return next;
}
