import { useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import {
  buildPublicDashboardFilterQueryString,
  EMPTY_PUBLIC_DASHBOARD_FILTER,
  publicDashboardFilterFromSearchParams,
  PublicDashboardFilter,
} from '../domain/public-dashboard-filter.model';
import { usePublicDashboardFilterStore } from '../store/usePublicDashboardFilterStore';

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
] as const;

function filtersEqual(a: PublicDashboardFilter, b: PublicDashboardFilter): boolean {
  return buildPublicDashboardFilterQueryString(a) === buildPublicDashboardFilterQueryString(b);
}

export function isPublicDashboardFilterRoute(pathname: string): boolean {
  return pathname === '/dashboard';
}

/** Keeps public dashboard filter state in sync with URL search params on `/dashboard` only. */
export function usePublicDashboardFilterUrlSync() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = usePublicDashboardFilterStore((state) => state.filter);
  const replaceFilter = usePublicDashboardFilterStore((state) => state.replaceFilter);
  const hydratingRef = useRef(true);
  const syncEnabled = isPublicDashboardFilterRoute(location.pathname);

  useEffect(() => {
    if (!syncEnabled) {
      hydratingRef.current = false;
      return;
    }

    const fromUrl = publicDashboardFilterFromSearchParams(searchParams);
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
    const fromUrl = publicDashboardFilterFromSearchParams(searchParams);
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

export function resetPublicDashboardFilterUrlSyncForTests() {
  usePublicDashboardFilterStore.setState({
    filter: EMPTY_PUBLIC_DASHBOARD_FILTER,
    locationFilterError: null,
  });
}
