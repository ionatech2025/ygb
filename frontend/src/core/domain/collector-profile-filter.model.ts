import type { DashboardFilter } from './dashboard-filter.model';

/** Subset of dashboard filters used on the collector profile page (TC-DASH-06-03). */
export type CollectorProfileFilter = Pick<
  DashboardFilter,
  'districtId' | 'formType' | 'dateFrom' | 'dateTo' | 'financialYearPeriod'
>;

export const EMPTY_COLLECTOR_PROFILE_FILTER: CollectorProfileFilter = {
  districtId: '',
  formType: '',
  dateFrom: '',
  dateTo: '',
  financialYearPeriod: '',
};

const FILTER_KEYS = [
  'districtId',
  'formType',
  'dateFrom',
  'dateTo',
  'financialYearPeriod',
] as const satisfies ReadonlyArray<keyof CollectorProfileFilter>;

export function buildCollectorProfileFilterQueryString(filter: CollectorProfileFilter): string {
  const params = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    const value = filter[key];
    if (value) {
      params.set(key, value);
    }
  }
  const query = params.toString();
  return query ? `?${query}` : '';
}

export function collectorProfileFilterFromSearchParams(params: URLSearchParams): CollectorProfileFilter {
  return {
    districtId: params.get('districtId') ?? '',
    formType: (params.get('formType') as CollectorProfileFilter['formType']) ?? '',
    dateFrom: params.get('dateFrom') ?? '',
    dateTo: params.get('dateTo') ?? '',
    financialYearPeriod: params.get('financialYearPeriod') ?? '',
  };
}
