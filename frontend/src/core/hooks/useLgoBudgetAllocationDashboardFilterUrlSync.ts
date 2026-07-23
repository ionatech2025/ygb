import { useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import {
  buildLgoBudgetAllocationDashboardFilterQueryString,
  EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_FILTER,
  lgoBudgetAllocationDashboardFilterFromSearchParams,
  type LgoBudgetAllocationDashboardFilter,
} from '../domain/lgo-budget-allocation-dashboard-filter.model';
import { LGO_BUDGET_ALLOCATION_ROUTES } from '../domain/lgo-budget-allocation.routes';
import { useLgoBudgetAllocationDashboardFilterStore } from '../store/useLgoBudgetAllocationDashboardFilterStore';

const FILTER_PARAM_KEYS = [
  'districtId',
  'subcountyId',
  'parishId',
  'dateFrom',
  'dateTo',
  'gender',
  'ageGroup',
  'financialYearPeriod',
] as const;

function filtersEqual(a: LgoBudgetAllocationDashboardFilter, b: LgoBudgetAllocationDashboardFilter): boolean {
  return buildLgoBudgetAllocationDashboardFilterQueryString(a) === buildLgoBudgetAllocationDashboardFilterQueryString(b);
}

export function isLgoBudgetAllocationDashboardFilterRoute(pathname: string): boolean {
  return pathname === LGO_BUDGET_ALLOCATION_ROUTES.dashboard;
}

/** Keeps LGO Budget Allocation dashboard filter state in sync with URL search params. */
export function useLgoBudgetAllocationDashboardFilterUrlSync() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = useLgoBudgetAllocationDashboardFilterStore((state) => state.filter);
  const replaceFilter = useLgoBudgetAllocationDashboardFilterStore((state) => state.replaceFilter);
  const hydratingRef = useRef(true);
  const syncEnabled = isLgoBudgetAllocationDashboardFilterRoute(location.pathname);

  useEffect(() => {
    if (!syncEnabled) {
      hydratingRef.current = false;
      return;
    }

    const fromUrl = lgoBudgetAllocationDashboardFilterFromSearchParams(searchParams);
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
    const fromUrl = lgoBudgetAllocationDashboardFilterFromSearchParams(searchParams);
    if (filtersEqual(fromUrl, filter)) {
      return;
    }
    const nextParams = new URLSearchParams(searchParams);
    for (const key of FILTER_PARAM_KEYS) {
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

export function resetLgoBudgetAllocationDashboardFilterUrlSyncForTests() {
  useLgoBudgetAllocationDashboardFilterStore.setState({
    filter: EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_FILTER,
    locationFilterError: null,
  });
}
