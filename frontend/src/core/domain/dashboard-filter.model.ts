import type { AgeGroup } from './form-validation.model';
import type { FormType } from './form-type.model';
import type { Gender } from './form-validation.model';

/** Mirrors backend DashboardFilter query params (AND semantics). */
export interface DashboardFilter {
  districtId: string;
  subcountyId: string;
  parishId: string;
  formType: FormType | '';
  dateFrom: string;
  dateTo: string;
  gender: Gender | '';
  ageGroup: AgeGroup | '';
  collectorId: string;
  financialYearPeriod: string;
}

export const EMPTY_DASHBOARD_FILTER: DashboardFilter = {
  districtId: '',
  subcountyId: '',
  parishId: '',
  formType: '',
  dateFrom: '',
  dateTo: '',
  gender: '',
  ageGroup: '',
  collectorId: '',
  financialYearPeriod: '',
};

const FILTER_PARAM_KEYS = [
  'districtId',
  'subcountyId',
  'parishId',
  'formType',
  'dateFrom',
  'dateTo',
  'gender',
  'ageGroup',
  'collectorId',
  'financialYearPeriod',
] as const satisfies ReadonlyArray<keyof DashboardFilter>;

export function hasActiveDashboardFilters(filter: DashboardFilter): boolean {
  return FILTER_PARAM_KEYS.some((key) => filter[key] !== '');
}

export function buildDashboardFilterQueryString(filter: DashboardFilter): string {
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

export function dashboardFilterFromSearchParams(params: URLSearchParams): DashboardFilter {
  return {
    districtId: params.get('districtId') ?? '',
    subcountyId: params.get('subcountyId') ?? '',
    parishId: params.get('parishId') ?? '',
    formType: (params.get('formType') as FormType | null) ?? '',
    dateFrom: params.get('dateFrom') ?? '',
    dateTo: params.get('dateTo') ?? '',
    gender: (params.get('gender') as Gender | null) ?? '',
    ageGroup: (params.get('ageGroup') as AgeGroup | null) ?? '',
    collectorId: params.get('collectorId') ?? '',
    financialYearPeriod: params.get('financialYearPeriod') ?? '',
  };
}

export function applyDashboardFilterPatch(
  current: DashboardFilter,
  patch: Partial<DashboardFilter>
): DashboardFilter {
  const next = { ...current, ...patch };
  if ('districtId' in patch && patch.districtId !== current.districtId) {
    next.subcountyId = patch.subcountyId ?? '';
    next.parishId = patch.parishId ?? '';
  } else if ('subcountyId' in patch && patch.subcountyId !== current.subcountyId) {
    next.parishId = patch.parishId ?? '';
  }
  return next;
}
