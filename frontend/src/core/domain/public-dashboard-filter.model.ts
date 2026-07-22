import type { AgeGroup, Gender } from './form-validation.model';
import type { FormType } from './form-type.model';

/** Mirrors backend PublicDashboardFilter query params (AND semantics; no collector). */
export interface PublicDashboardFilter {
  districtId: string;
  subcountyId: string;
  parishId: string;
  formType: FormType | '';
  dateFrom: string;
  dateTo: string;
  gender: Gender | '';
  ageGroup: AgeGroup | '';
  financialYearPeriod: string;
  programmeArea: string;
}

export const EMPTY_PUBLIC_DASHBOARD_FILTER: PublicDashboardFilter = {
  districtId: '',
  subcountyId: '',
  parishId: '',
  formType: '',
  dateFrom: '',
  dateTo: '',
  gender: '',
  ageGroup: '',
  financialYearPeriod: '',
  programmeArea: '',
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
  'financialYearPeriod',
  'programmeArea',
] as const satisfies ReadonlyArray<keyof PublicDashboardFilter>;

export function hasActivePublicDashboardFilters(filter: PublicDashboardFilter): boolean {
  return FILTER_PARAM_KEYS.some((key) => filter[key] !== '');
}

export function buildPublicDashboardFilterQueryString(filter: PublicDashboardFilter): string {
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

export function publicDashboardFilterFromSearchParams(params: URLSearchParams): PublicDashboardFilter {
  return {
    districtId: params.get('districtId') ?? '',
    subcountyId: params.get('subcountyId') ?? '',
    parishId: params.get('parishId') ?? '',
    formType: (params.get('formType') as FormType | null) ?? '',
    dateFrom: params.get('dateFrom') ?? '',
    dateTo: params.get('dateTo') ?? '',
    gender: (params.get('gender') as Gender | null) ?? '',
    ageGroup: (params.get('ageGroup') as AgeGroup | null) ?? '',
    financialYearPeriod: params.get('financialYearPeriod') ?? '',
    programmeArea: params.get('programmeArea') ?? '',
  };
}

export function applyPublicDashboardFilterPatch(
  current: PublicDashboardFilter,
  patch: Partial<PublicDashboardFilter>
): PublicDashboardFilter {
  const next = { ...current, ...patch };
  if ('districtId' in patch && patch.districtId !== current.districtId) {
    next.subcountyId = patch.subcountyId ?? '';
    next.parishId = patch.parishId ?? '';
  } else if ('subcountyId' in patch && patch.subcountyId !== current.subcountyId) {
    next.parishId = patch.parishId ?? '';
  }
  return next;
}
