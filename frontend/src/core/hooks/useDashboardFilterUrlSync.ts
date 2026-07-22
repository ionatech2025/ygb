import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  buildDashboardFilterQueryString,
  dashboardFilterFromSearchParams,
  DashboardFilter,
  EMPTY_DASHBOARD_FILTER,
} from '../domain/dashboard-filter.model';
import { useDashboardFilterStore } from '../store/useDashboardFilterStore';

function filtersEqual(a: DashboardFilter, b: DashboardFilter): boolean {
  return buildDashboardFilterQueryString(a) === buildDashboardFilterQueryString(b);
}

/** Keeps dashboard filter state in sync with URL search params on admin routes. */
export function useDashboardFilterUrlSync() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = useDashboardFilterStore((state) => state.filter);
  const replaceFilter = useDashboardFilterStore((state) => state.replaceFilter);
  const hydratingRef = useRef(true);

  useEffect(() => {
    const fromUrl = dashboardFilterFromSearchParams(searchParams);
    if (!filtersEqual(fromUrl, filter)) {
      replaceFilter(fromUrl);
    }
    hydratingRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once from initial URL
  }, []);

  useEffect(() => {
    if (hydratingRef.current) {
      return;
    }
    const fromUrl = dashboardFilterFromSearchParams(searchParams);
    if (filtersEqual(fromUrl, filter)) {
      return;
    }
    const nextParams = new URLSearchParams(searchParams);
    for (const key of [
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
    ] as const) {
      nextParams.delete(key);
    }
    for (const [key, value] of Object.entries(filter)) {
      if (value) {
        nextParams.set(key, value);
      }
    }
    setSearchParams(nextParams, { replace: true });
  }, [filter, searchParams, setSearchParams]);
}

export function resetDashboardFilterUrlSyncForTests() {
  useDashboardFilterStore.setState({ filter: EMPTY_DASHBOARD_FILTER, locationFilterError: null });
}
