import { FormField, formControlClassName } from '../components/forms/FormField';
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
  programmeAreas: string[];
  onChange: (patch: Partial<PublicDashboardFilter>) => void;
}

export function PublicDashboardScalarFilters({
  filter,
  financialYearPeriods,
  programmeAreas,
  onChange,
}: PublicDashboardScalarFiltersProps) {
  const programmeAreaDisabled = programmeAreas.length === 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <FormField label="Form type" htmlFor="public-filter-form-type">
        <select
          id="public-filter-form-type"
          data-testid="filter-form-type"
          value={filter.formType}
          onChange={(e) => onChange({ formType: e.target.value as typeof filter.formType })}
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
        <select
          id="public-filter-gender"
          data-testid="filter-gender"
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

      <FormField label="Age group" htmlFor="public-filter-age-group">
        <select
          id="public-filter-age-group"
          data-testid="filter-age-group"
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

      <FormField label="Financial year period" htmlFor="public-filter-financial-year">
        <select
          id="public-filter-financial-year"
          data-testid="filter-financial-year"
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

      <FormField label="Programme area" htmlFor="public-filter-programme-area">
        <select
          id="public-filter-programme-area"
          data-testid="filter-programme-area"
          value={filter.programmeArea}
          disabled={programmeAreaDisabled}
          onChange={(e) => onChange({ programmeArea: e.target.value })}
          className={`${formControlClassName} disabled:cursor-not-allowed disabled:opacity-60`}
        >
          <option value="">
            {programmeAreaDisabled ? 'Programme areas coming soon' : 'All programme areas'}
          </option>
          {programmeAreas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </FormField>
    </div>
  );
}
