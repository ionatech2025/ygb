import { FormField, formControlClassName } from '../components/forms/FormField';
import {
  AGE_GROUP_LABELS,
  AGE_GROUP_VALUES,
  GENDER_OPTIONS,
} from '../../../../core/domain/form-validation.model';
import type { LgoBudgetAllocationDashboardFilter } from '../../../../core/domain/lgo-budget-allocation-dashboard-filter.model';
import { formatFinancialYearPeriodLabel } from '../../../../core/financial-year-period';
import type { FinancialYearPeriodHalf } from '../../../../core/domain/financial-year-period.model';

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

export interface LgoBudgetAllocationScalarFiltersProps {
  filter: LgoBudgetAllocationDashboardFilter;
  financialYearPeriods: string[];
  onChange: (patch: Partial<LgoBudgetAllocationDashboardFilter>) => void;
}

export function LgoBudgetAllocationScalarFilters({
  filter,
  financialYearPeriods,
  onChange,
}: LgoBudgetAllocationScalarFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <FormField label="Date from" htmlFor="lgo-filter-date-from">
        <input
          id="lgo-filter-date-from"
          data-testid="lgo-filter-date-from"
          type="date"
          value={filter.dateFrom}
          onChange={(e) => onChange({ dateFrom: e.target.value })}
          className={formControlClassName}
        />
      </FormField>

      <FormField label="Date to" htmlFor="lgo-filter-date-to">
        <input
          id="lgo-filter-date-to"
          data-testid="lgo-filter-date-to"
          type="date"
          value={filter.dateTo}
          onChange={(e) => onChange({ dateTo: e.target.value })}
          className={formControlClassName}
        />
      </FormField>

      <FormField label="Gender" htmlFor="lgo-filter-gender">
        <select
          id="lgo-filter-gender"
          data-testid="lgo-filter-gender"
          value={filter.gender}
          onChange={(e) => onChange({ gender: e.target.value as typeof filter.gender })}
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

      <FormField label="Age group" htmlFor="lgo-filter-age-group">
        <select
          id="lgo-filter-age-group"
          data-testid="lgo-filter-age-group"
          value={filter.ageGroup}
          onChange={(e) => onChange({ ageGroup: e.target.value as typeof filter.ageGroup })}
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

      <FormField label="Financial year period" htmlFor="lgo-filter-financial-year">
        <select
          id="lgo-filter-financial-year"
          data-testid="lgo-filter-financial-year"
          value={filter.financialYearPeriod}
          onChange={(e) => onChange({ financialYearPeriod: e.target.value })}
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
  );
}
