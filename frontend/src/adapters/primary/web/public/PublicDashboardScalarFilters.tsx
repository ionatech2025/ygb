import { FormField, FormSelect, formControlClassName } from '../components/forms';
import { FORM_TYPE_OPTIONS } from '../../../../core/domain/form-type.model';
import {
  AGE_GROUP_LABELS,
  AGE_GROUP_VALUES,
  GENDER_OPTIONS,
} from '../../../../core/domain/form-validation.model';
import { formatFinancialYearPeriodLabel } from '../../../../core/financial-year-period';
import type { FinancialYearPeriodHalf } from '../../../../core/domain/financial-year-period.model';
import type { PublicDashboardFilter } from '../../../../core/domain/public-dashboard-filter.model';

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

export interface PublicDashboardScalarFiltersProps {
  filter: PublicDashboardFilter;
  financialYearPeriods: string[];
  onChange: (patch: Partial<PublicDashboardFilter>) => void;
}

export function PublicDashboardScalarFilters({
  filter,
  financialYearPeriods,
  onChange,
}: PublicDashboardScalarFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <FormField label="Form type" htmlFor="public-filter-form-type">
        <FormSelect
          id="public-filter-form-type"
          testId="filter-form-type"
          value={filter.formType}
          onChange={(value) => onChange({ formType: value as typeof filter.formType })}
          options={[
            { value: '', label: 'All form types' },
            ...FORM_TYPE_OPTIONS.map((option) => ({ value: option.value, label: option.label })),
          ]}
          placeholder="All form types"
        />
      </FormField>

      <FormField label="Date from" htmlFor="public-filter-date-from">
        <input
          id="public-filter-date-from"
          data-testid="filter-date-from"
          type="date"
          value={filter.dateFrom}
          onChange={(e) => onChange({ dateFrom: e.target.value })}
          className={formControlClassName}
        />
      </FormField>

      <FormField label="Date to" htmlFor="public-filter-date-to">
        <input
          id="public-filter-date-to"
          data-testid="filter-date-to"
          type="date"
          value={filter.dateTo}
          onChange={(e) => onChange({ dateTo: e.target.value })}
          className={formControlClassName}
        />
      </FormField>

      <FormField label="Gender" htmlFor="public-filter-gender">
        <FormSelect
          id="public-filter-gender"
          testId="filter-gender"
          value={filter.gender}
          onChange={(value) => onChange({ gender: value as typeof filter.gender })}
          options={[
            { value: '', label: 'All genders' },
            ...GENDER_OPTIONS.map((option) => ({ value: option.value, label: option.label })),
          ]}
          placeholder="All genders"
        />
      </FormField>

      <FormField label="Age group" htmlFor="public-filter-age-group">
        <FormSelect
          id="public-filter-age-group"
          testId="filter-age-group"
          value={filter.ageGroup}
          onChange={(value) => onChange({ ageGroup: value as typeof filter.ageGroup })}
          options={[
            { value: '', label: 'All age groups' },
            ...AGE_GROUP_VALUES.map((value) => ({ value, label: AGE_GROUP_LABELS[value] })),
          ]}
          placeholder="All age groups"
        />
      </FormField>

      <FormField label="Financial year period" htmlFor="public-filter-financial-year">
        <FormSelect
          id="public-filter-financial-year"
          testId="filter-financial-year"
          value={filter.financialYearPeriod}
          onChange={(value) => onChange({ financialYearPeriod: value })}
          options={[
            { value: '', label: 'All periods' },
            ...financialYearPeriods.map((period) => ({
              value: period,
              label: labelFromFinancialYearPeriodKey(period),
            })),
          ]}
          placeholder="All periods"
        />
      </FormField>
    </div>
  );
}
