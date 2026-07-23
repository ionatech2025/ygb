import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ChevronDown, Filter, X } from 'lucide-react';
import { CascadingLocationSelector } from '../components/CascadingLocationSelector';
import type { LocationFields } from '../../../../core/domain/admin-location.model';
import { EMPTY_DASHBOARD_FILTER } from '../../../../core/domain/dashboard-filter.model';
import { sanitizeDashboardLocationFilter } from '../../../../core/domain/dashboard-filter-location.validation';
import { hasActivePublicDashboardFilters } from '../../../../core/domain/public-dashboard-filter.model';
import { publicDashboardClasses } from '../../../../core/domain/public-dashboard.theme';
import { usePublicDashboardFilterStore } from '../../../../core/store/usePublicDashboardFilterStore';
import type { IPublicDashboardApiPort } from '../../../../ports/public-dashboard-api.port';
import type { ILocationRepositoryPort } from '../../../../ports/location-repository.port';
import { locationRepository } from '../../../secondary/location/location-repository.adapter';
import { PublicDashboardScalarFilters } from './PublicDashboardScalarFilters';

export interface PublicDashboardFilterPanelProps {
  dashboardApi: IPublicDashboardApiPort;
  locationRepository?: ILocationRepositoryPort;
}

export function PublicDashboardFilterPanel({
  dashboardApi,
  locationRepository: locationRepo = locationRepository,
}: PublicDashboardFilterPanelProps) {
  const filter = usePublicDashboardFilterStore((state) => state.filter);
  const locationFilterError = usePublicDashboardFilterStore((state) => state.locationFilterError);
  const setFilter = usePublicDashboardFilterStore((state) => state.setFilter);
  const setLocationFilterError = usePublicDashboardFilterStore((state) => state.setLocationFilterError);
  const clearAll = usePublicDashboardFilterStore((state) => state.clearAll);
  const [expanded, setExpanded] = useState(true);
  const [financialYearPeriods, setFinancialYearPeriods] = useState<string[]>([]);
  const [programmeAreas, setProgrammeAreas] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    void dashboardApi
      .fetchFilterOptions(filter.districtId || undefined, filter.subcountyId || undefined)
      .then((options) => {
        if (cancelled) {
          return;
        }
        setFinancialYearPeriods(options.financialYearPeriods);
        setProgrammeAreas(options.programmeAreas);
      })
      .catch(() => {
        if (!cancelled) {
          setFinancialYearPeriods([]);
          setProgrammeAreas([]);
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

  const active = hasActivePublicDashboardFilters(filter);

  return (
    <section
      aria-label="Dashboard filters"
      data-testid="public-dashboard-filter-panel"
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
            data-testid="public-dashboard-filter-clear-all"
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl border border-border px-3 text-xs font-semibold text-text-muted transition hover:bg-surface-muted hover:text-text"
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
              data-testid="public-dashboard-location-filter-error"
              className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{locationFilterError}</span>
            </div>
          )}

          <div data-testid="filter-location">
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

          <PublicDashboardScalarFilters
            filter={filter}
            financialYearPeriods={financialYearPeriods}
            programmeAreas={programmeAreas}
            onChange={setFilter}
          />
        </div>
      )}
    </section>
  );
}
