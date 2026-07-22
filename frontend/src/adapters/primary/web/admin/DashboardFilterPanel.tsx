import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Filter, X } from 'lucide-react';
import { CascadingLocationSelector } from '../components/CascadingLocationSelector';
import { FormField, formControlClassName } from '../components/forms/FormField';
import type { LocationFields } from '../../../../core/domain/admin-location.model';
import { FORM_TYPE_OPTIONS } from '../../../../core/domain/form-type.model';
import {
  AGE_GROUP_LABELS,
  AGE_GROUP_VALUES,
  GENDER_OPTIONS,
} from '../../../../core/domain/form-validation.model';
import { formatFinancialYearPeriodLabel } from '../../../../core/financial-year-period';
import type { FinancialYearPeriodHalf } from '../../../../core/domain/financial-year-period.model';
import { hasActiveDashboardFilters } from '../../../../core/domain/dashboard-filter.model';
import { useDashboardFilterStore } from '../../../../core/store/useDashboardFilterStore';
import type { IDashboardApiPort } from '../../../../ports/dashboard-api.port';
import type { ILocationRepositoryPort } from '../../../../ports/location-repository.port';

export interface DashboardFilterPanelProps {
  dashboardApi: IDashboardApiPort;
  locationRepository?: ILocationRepositoryPort;
}

function labelFromFinancialYearPeriodKey(key: string): string {
  const match = key.match(/^(JAN_JUN|JUL_DEC)_(\d+)$/);
  if (!match) {
    return key;
  }
  return formatFinancialYearPeriodLabel({
    period: match[1] as FinancialYearPeriodHalf,
    year: Number(match[2]),
  });
}

export function DashboardFilterPanel({ dashboardApi, locationRepository }: DashboardFilterPanelProps) {
  const filter = useDashboardFilterStore((state) => state.filter);
  const setFilter = useDashboardFilterStore((state) => state.setFilter);
  const clearAll = useDashboardFilterStore((state) => state.clearAll);
  const [expanded, setExpanded] = useState(true);
  const [collectors, setCollectors] = useState<Array<{ id: string; fullName: string }>>([]);
  const [financialYearPeriods, setFinancialYearPeriods] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    void dashboardApi
      .fetchFilterOptions(filter.districtId || undefined, filter.subcountyId || undefined)
      .then((options) => {
        if (!cancelled) {
          setCollectors(options.collectors);
          setFinancialYearPeriods(options.financialYearPeriods);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCollectors([]);
          setFinancialYearPeriods([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [dashboardApi, filter.districtId, filter.subcountyId]);

  const locationValue: LocationFields = useMemo(
    () => ({
      districtId: filter.districtId,
      subcountyId: filter.subcountyId,
      parishId: filter.parishId,
      villageId: '',
    }),
    [filter.districtId, filter.subcountyId, filter.parishId]
  );

  const handleLocationChange = (location: LocationFields) => {
    setFilter({
      districtId: location.districtId,
      subcountyId: location.subcountyId,
      parishId: location.parishId,
    });
  };

  const active = hasActiveDashboardFilters(filter);

  return (
    <section
      aria-label="Dashboard filters"
      data-testid="dashboard-filter-panel"
      className="rounded-2xl border border-border bg-surface shadow-sm"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="inline-flex min-h-11 flex-1 items-center gap-2 text-left text-sm font-bold text-text"
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
            data-testid="dashboard-filter-clear-all"
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl border border-border px-3 text-xs font-semibold text-text-muted transition hover:bg-surface-muted hover:text-text"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Clear all
          </button>
        )}
      </div>

      {expanded && (
        <div className="space-y-5 px-4 py-4 sm:px-5 sm:py-5">
          <div data-testid="filter-location">
            <CascadingLocationSelector
              value={locationValue}
              onChange={handleLocationChange}
              repository={locationRepository}
              includeVillage={false}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField label="Form type" htmlFor="filter-form-type">
              <select
                id="filter-form-type"
                data-testid="filter-form-type"
                value={filter.formType}
                onChange={(e) => setFilter({ formType: e.target.value as typeof filter.formType })}
                className={formControlClassName}
              >
                <option value="">All form types</option>
                {FORM_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Date from" htmlFor="filter-date-from">
              <input
                id="filter-date-from"
                data-testid="filter-date-from"
                type="date"
                value={filter.dateFrom}
                onChange={(e) => setFilter({ dateFrom: e.target.value })}
                className={formControlClassName}
              />
            </FormField>

            <FormField label="Date to" htmlFor="filter-date-to">
              <input
                id="filter-date-to"
                data-testid="filter-date-to"
                type="date"
                value={filter.dateTo}
                onChange={(e) => setFilter({ dateTo: e.target.value })}
                className={formControlClassName}
              />
            </FormField>

            <FormField label="Gender" htmlFor="filter-gender">
              <select
                id="filter-gender"
                data-testid="filter-gender"
                value={filter.gender}
                onChange={(e) => setFilter({ gender: e.target.value as typeof filter.gender })}
                className={formControlClassName}
              >
                <option value="">All genders</option>
                {GENDER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Age group" htmlFor="filter-age-group">
              <select
                id="filter-age-group"
                data-testid="filter-age-group"
                value={filter.ageGroup}
                onChange={(e) => setFilter({ ageGroup: e.target.value as typeof filter.ageGroup })}
                className={formControlClassName}
              >
                <option value="">All age groups</option>
                {AGE_GROUP_VALUES.map((value) => (
                  <option key={value} value={value}>
                    {AGE_GROUP_LABELS[value]}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Collector" htmlFor="filter-collector">
              <select
                id="filter-collector"
                data-testid="filter-collector"
                value={filter.collectorId}
                onChange={(e) => setFilter({ collectorId: e.target.value })}
                className={formControlClassName}
              >
                <option value="">All collectors</option>
                {collectors.map((collector) => (
                  <option key={collector.id} value={collector.id}>
                    {collector.fullName}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Financial year period" htmlFor="filter-financial-year">
              <select
                id="filter-financial-year"
                data-testid="filter-financial-year"
                value={filter.financialYearPeriod}
                onChange={(e) => setFilter({ financialYearPeriod: e.target.value })}
                className={formControlClassName}
              >
                <option value="">All periods</option>
                {financialYearPeriods.map((period) => (
                  <option key={period} value={period}>
                    {labelFromFinancialYearPeriodKey(period)}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
        </div>
      )}
    </section>
  );
}
