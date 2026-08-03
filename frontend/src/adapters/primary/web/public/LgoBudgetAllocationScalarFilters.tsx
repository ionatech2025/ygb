import { FormField, FormSelect, formControlClassName } from '../components/forms';
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
        <FormSelect
          id="lgo-filter-gender"
          testId="lgo-filter-gender"
          value={filter.gender}
          onChange={(value) => onChange({ gender: value as typeof filter.gender })}
          options={GENDER_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
          placeholder="Select All"
        />
      </FormField>

      <FormField label="Age group" htmlFor="lgo-filter-age-group">
        <FormSelect
          id="lgo-filter-age-group"
          testId="lgo-filter-age-group"
          value={filter.ageGroup}
          onChange={(value) => onChange({ ageGroup: value as typeof filter.ageGroup })}
          options={AGE_GROUP_VALUES.map((value) => ({ value, label: AGE_GROUP_LABELS[value] }))}
          placeholder="Select All"
        />
      </FormField>

      <FormField label="Financial year period" htmlFor="lgo-filter-financial-year">
        <FormSelect
          id="lgo-filter-financial-year"
          testId="lgo-filter-financial-year"
          value={filter.financialYearPeriod}
          onChange={(value) => onChange({ financialYearPeriod: value })}
          options={financialYearPeriods.map((period) => ({
            value: period,
            label: labelFromFinancialYearPeriodKey(period),
          }))}
          placeholder="Select All"
        />
      </FormField>
    </div>
  );
}
