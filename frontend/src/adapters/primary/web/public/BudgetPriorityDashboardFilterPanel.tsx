import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ChevronDown, Filter, X } from 'lucide-react';
import { CascadingLocationSelector } from '../components/CascadingLocationSelector';
import type { LocationFields } from '../../../../core/domain/admin-location.model';
import { EMPTY_DASHBOARD_FILTER } from '../../../../core/domain/dashboard-filter.model';
import { sanitizeDashboardLocationFilter } from '../../../../core/domain/dashboard-filter-location.validation';
import { hasActiveBudgetPriorityDashboardFilters } from '../../../../core/domain/budget-priority-dashboard-filter.model';
import { publicDashboardClasses } from '../../../../core/domain/public-dashboard.theme';
import { useBudgetPriorityDashboardFilterStore } from '../../../../core/store/useBudgetPriorityDashboardFilterStore';
import type { IBudgetPriorityDashboardApiPort } from '../../../../ports/budget-priority-dashboard-api.port';
import type { ILocationRepositoryPort } from '../../../../ports/location-repository.port';
import { locationRepository } from '../../../secondary/location/location-repository.adapter';
import { BudgetPriorityScalarFilters } from './BudgetPriorityScalarFilters';

export interface BudgetPriorityDashboardFilterPanelProps {
  dashboardApi: IBudgetPriorityDashboardApiPort;
  locationRepository?: ILocationRepositoryPort;
}

export function BudgetPriorityDashboardFilterPanel({
  dashboardApi,
  locationRepository: locationRepo = locationRepository,
}: BudgetPriorityDashboardFilterPanelProps) {
  const filter = useBudgetPriorityDashboardFilterStore((state) => state.filter);
  const locationFilterError = useBudgetPriorityDashboardFilterStore((state) => state.locationFilterError);
  const setFilter = useBudgetPriorityDashboardFilterStore((state) => state.setFilter);
  const setLocationFilterError = useBudgetPriorityDashboardFilterStore((state) => state.setLocationFilterError);
  const clearAll = useBudgetPriorityDashboardFilterStore((state) => state.clearAll);
  const [expanded, setExpanded] = useState(true);
  const [financialYearPeriods, setFinancialYearPeriods] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    void dashboardApi
      .fetchFilterOptions(filter.districtId || undefined, filter.subcountyId || undefined)
      .then((options) => {
        if (cancelled) {
          return;
        }
        setFinancialYearPeriods(options.financialYearPeriods ?? []);
      })
      .catch(() => {
        if (!cancelled) {
          setFinancialYearPeriods([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [dashboardApi, filter.districtId, filter.subcountyId]);

  useEffect(() => {
    if (!filter.districtId && !filter.subcountyId && !filter.parishId) {
      return;
    }

    let cancelled = false;
    void sanitizeDashboardLocationFilter({ ...EMPTY_DASHBOARD_FILTER, ...filter }, locationRepo).then(
      (sanitized) => {
        if (cancelled || !sanitized.wasSanitized) {
          return;
        }
        setFilter({
          districtId: sanitized.filter.districtId,
          subcountyId: sanitized.filter.subcountyId,
          parishId: sanitized.filter.parishId,
        });
        setLocationFilterError(sanitized.message ?? 'Outdated location filters were cleared.');
      }
    );

    return () => {
      cancelled = true;
    };
  }, [filter.districtId, filter.subcountyId, filter.parishId, locationRepo, setFilter, setLocationFilterError]);

  const locationValue: LocationFields = useMemo(
    () => ({
      districtId: filter.districtId,
      subcountyId: filter.subcountyId,
      parishId: filter.parishId,
      villageId: '',
    }),
    [filter.districtId, filter.subcountyId, filter.parishId]
  );

  const active = hasActiveBudgetPriorityDashboardFilters(filter);

  return (
    <section
      aria-label="Budget priority dashboard filters"
      data-testid="budget-priority-dashboard-filter-panel"
      className={`${publicDashboardClasses.panel} overflow-hidden`}
    >
      <div className={publicDashboardClasses.panelHeader}>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className={publicDashboardClasses.panelHeaderTitle}
        >
          <Filter className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
          Filters
          <ChevronDown
            className={`ml-auto h-4 w-4 text-text-muted transition ${expanded ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        {active && (
          <button
            type="button"
            onClick={clearAll}
            data-testid="bp-dashboard-filter-clear-all"
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl border border-border/80 px-3 text-xs font-semibold text-text-muted transition hover:border-brand/30 hover:bg-brand-light/40 hover:text-brand"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Clear all
          </button>
        )}
      </div>

      {expanded && (
        <div className={`space-y-5 ${publicDashboardClasses.panelInset}`}>
          {locationFilterError && (
            <div
              role="alert"
              data-testid="bp-dashboard-location-filter-error"
              className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{locationFilterError}</span>
            </div>
          )}

          <div data-testid="bp-filter-location">
            <CascadingLocationSelector
              value={locationValue}
              onChange={(location) =>
                setFilter({
                  districtId: location.districtId,
                  subcountyId: location.subcountyId,
                  parishId: location.parishId,
                })
              }
              repository={locationRepo}
              includeVillage={false}
            />
          </div>

          <BudgetPriorityScalarFilters
            filter={filter}
            financialYearPeriods={financialYearPeriods}
            onChange={setFilter}
          />
        </div>
      )}
    </section>
  );
}
