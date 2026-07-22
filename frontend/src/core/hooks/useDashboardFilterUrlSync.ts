import { useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
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

export function isDashboardFilterRoute(pathname: string): boolean {
  return (
    pathname === '/admin/dashboard' ||
    pathname.startsWith('/admin/submissions') ||
    pathname === '/admin/collectors'
  );
}

/** Keeps dashboard filter state in sync with URL search params on dashboard routes only. */
export function useDashboardFilterUrlSync() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = useDashboardFilterStore((state) => state.filter);
  const replaceFilter = useDashboardFilterStore((state) => state.replaceFilter);
  const hydratingRef = useRef(true);
  const syncEnabled = isDashboardFilterRoute(location.pathname);

  useEffect(() => {
    if (!syncEnabled) {
      hydratingRef.current = false;
      return;
    }

    const fromUrl = dashboardFilterFromSearchParams(searchParams);
    if (!filtersEqual(fromUrl, filter)) {
      replaceFilter(fromUrl);
    }
    hydratingRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once from initial URL
  }, [syncEnabled]);

  useEffect(() => {
    if (!syncEnabled || hydratingRef.current) {
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
  }, [filter, searchParams, setSearchParams, syncEnabled]);
}

export function resetDashboardFilterUrlSyncForTests() {
  useDashboardFilterStore.setState({ filter: EMPTY_DASHBOARD_FILTER, locationFilterError: null });
}
