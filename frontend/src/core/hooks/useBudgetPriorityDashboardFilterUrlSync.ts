import { useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import {
  buildBudgetPriorityDashboardFilterQueryString,
  budgetPriorityDashboardFilterFromSearchParams,
  BudgetPriorityDashboardFilter,
  EMPTY_BUDGET_PRIORITY_DASHBOARD_FILTER,
} from '../domain/budget-priority-dashboard-filter.model';
import { useBudgetPriorityDashboardFilterStore } from '../store/useBudgetPriorityDashboardFilterStore';

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
] as const;

function filtersEqual(a: BudgetPriorityDashboardFilter, b: BudgetPriorityDashboardFilter): boolean {
  return buildBudgetPriorityDashboardFilterQueryString(a) === buildBudgetPriorityDashboardFilterQueryString(b);
}

export function isBudgetPriorityDashboardFilterRoute(pathname: string): boolean {
  return pathname === '/dashboard/budget-priorities';
}

/** Keeps Budget Priority dashboard filter state in sync with URL search params. */
export function useBudgetPriorityDashboardFilterUrlSync() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = useBudgetPriorityDashboardFilterStore((state) => state.filter);
  const replaceFilter = useBudgetPriorityDashboardFilterStore((state) => state.replaceFilter);
  const hydratingRef = useRef(true);
  const syncEnabled = isBudgetPriorityDashboardFilterRoute(location.pathname);

  useEffect(() => {
    if (!syncEnabled) {
      hydratingRef.current = false;
      return;
    }

    const fromUrl = budgetPriorityDashboardFilterFromSearchParams(searchParams);
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
    const fromUrl = budgetPriorityDashboardFilterFromSearchParams(searchParams);
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

export function resetBudgetPriorityDashboardFilterUrlSyncForTests() {
  useBudgetPriorityDashboardFilterStore.setState({
    filter: EMPTY_BUDGET_PRIORITY_DASHBOARD_FILTER,
    locationFilterError: null,
  });
}
