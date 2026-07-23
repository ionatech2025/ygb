import { FormField, formControlClassName } from '../components/forms/FormField';
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
        <select
          id="bp-filter-section"
          data-testid="bp-filter-section"
          value={filter.section}
          onChange={(e) => onChange({ section: e.target.value as BudgetPrioritySection | '' })}
          className={formControlClassName}
        >
          <option value="">All sectors</option>
          {BUDGET_PRIORITY_SECTIONS.map((section) => (
            <option key={section.id} value={section.id}>
              {section.shortLabel}
            </option>
          ))}
        </select>
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
        <select
          id="bp-filter-gender"
          data-testid="bp-filter-gender"
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

      <FormField label="Age group" htmlFor="bp-filter-age-group">
        <select
          id="bp-filter-age-group"
          data-testid="bp-filter-age-group"
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

      <FormField label="Financial year period" htmlFor="bp-filter-financial-year">
        <select
          id="bp-filter-financial-year"
          data-testid="bp-filter-financial-year"
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
