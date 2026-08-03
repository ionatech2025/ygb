import { FormField, FormSelect, formControlClassName } from '../components/forms';
import {
  AGE_GROUP_LABELS,
  AGE_GROUP_VALUES,
  GENDER_OPTIONS,
} from '../../../../core/domain/form-validation.model';
import { BUDGET_PRIORITY_SECTIONS } from '../../../../core/domain/budget-priority-section.model';
import type { BudgetPriorityDashboardFilter } from '../../../../core/domain/budget-priority-dashboard-filter.model';
import { formatFinancialYearPeriodLabel } from '../../../../core/financial-year-period';
import type { FinancialYearPeriodHalf } from '../../../../core/domain/financial-year-period.model';
import type { BudgetPrioritySection } from '../../../../core/domain/budget-priority-section.model';

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

export interface BudgetPriorityScalarFiltersProps {
  filter: BudgetPriorityDashboardFilter;
  financialYearPeriods: string[];
  onChange: (patch: Partial<BudgetPriorityDashboardFilter>) => void;
}

export function BudgetPriorityScalarFilters({
  filter,
  financialYearPeriods,
  onChange,
}: BudgetPriorityScalarFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <FormField label="Sector" htmlFor="bp-filter-section">
        <FormSelect
          id="bp-filter-section"
          testId="bp-filter-section"
          value={filter.section}
          onChange={(value) => onChange({ section: value as BudgetPrioritySection | '' })}
          options={BUDGET_PRIORITY_SECTIONS.map((section) => ({
            value: section.id,
            label: section.shortLabel,
          }))}
          placeholder="Select All"
        />
      </FormField>

      <FormField label="Date from" htmlFor="bp-filter-date-from">
        <input
          id="bp-filter-date-from"
          data-testid="bp-filter-date-from"
          type="date"
          value={filter.dateFrom}
          onChange={(e) => onChange({ dateFrom: e.target.value })}
          className={formControlClassName}
        />
      </FormField>

      <FormField label="Date to" htmlFor="bp-filter-date-to">
        <input
          id="bp-filter-date-to"
          data-testid="bp-filter-date-to"
          type="date"
          value={filter.dateTo}
          onChange={(e) => onChange({ dateTo: e.target.value })}
          className={formControlClassName}
        />
      </FormField>

      <FormField label="Gender" htmlFor="bp-filter-gender">
        <FormSelect
          id="bp-filter-gender"
          testId="bp-filter-gender"
          value={filter.gender}
          onChange={(value) => onChange({ gender: value as typeof filter.gender })}
          options={GENDER_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
          placeholder="Select All"
        />
      </FormField>

      <FormField label="Age group" htmlFor="bp-filter-age-group">
        <FormSelect
          id="bp-filter-age-group"
          testId="bp-filter-age-group"
          value={filter.ageGroup}
          onChange={(value) => onChange({ ageGroup: value as typeof filter.ageGroup })}
          options={AGE_GROUP_VALUES.map((value) => ({ value, label: AGE_GROUP_LABELS[value] }))}
          placeholder="Select All"
        />
      </FormField>

      <FormField label="Financial year period" htmlFor="bp-filter-financial-year">
        <FormSelect
          id="bp-filter-financial-year"
          testId="bp-filter-financial-year"
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
