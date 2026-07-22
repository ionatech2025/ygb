import type { DashboardAggregates } from './domain/dashboard-aggregates.model';
import type { DashboardFilter } from './domain/dashboard-filter.model';
import type { StatCardViewModel } from './domain/dashboard-summary.model';
import { FORM_TYPE_OPTIONS } from './domain/form-type.model';
import { GENDER_OPTIONS } from './domain/form-validation.model';
import type { FinancialYearPeriodHalf } from './domain/financial-year-period.model';
import { formatFinancialYearPeriodLabel } from './financial-year-period';
import type { IDashboardApiPort } from '../ports/dashboard-api.port';

export const TOP_DISTRICTS_LIMIT = 5;

const FORM_TYPE_LABELS = Object.fromEntries(
  FORM_TYPE_OPTIONS.map((option) => [option.value, option.label])
) as Record<string, string>;

const GENDER_LABELS = Object.fromEntries(
  GENDER_OPTIONS.map((option) => [option.value, option.label])
) as Record<string, string>;

function formatCount(count: number): string {
  return count.toLocaleString('en-UG');
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

export function mapAggregatesToSummaryCards(aggregates: DashboardAggregates): StatCardViewModel[] {
  const topDistricts = [...aggregates.byDistrict]
    .sort((a, b) => b.count - a.count)
    .slice(0, TOP_DISTRICTS_LIMIT);

  return [
    {
      id: 'total-submissions',
      title: 'Total submissions',
      primaryValue: formatCount(aggregates.totalSubmissions),
    },
    {
      id: 'by-form-type',
      title: 'By form type',
      items: aggregates.byFormType.map((entry) => ({
        label: FORM_TYPE_LABELS[entry.formType] ?? entry.formType,
        value: formatCount(entry.count),
      })),
    },
    {
      id: 'top-districts',
      title: `Top districts (top ${TOP_DISTRICTS_LIMIT})`,
      items: topDistricts.map((entry) => ({
        label: entry.districtName,
        value: formatCount(entry.count),
      })),
    },
    {
      id: 'gender-split',
      title: 'Gender split',
      items: aggregates.byGender.map((entry) => ({
        label: GENDER_LABELS[entry.gender] ?? entry.gender,
        value: formatCount(entry.count),
      })),
    },
    {
      id: 'by-financial-year',
      title: 'By financial year period',
      items: aggregates.byFinancialYearPeriod.map((entry) => ({
        label: labelFromFinancialYearPeriodKey(entry.financialYearPeriod),
        value: formatCount(entry.count),
      })),
    },
  ];
}

export class DashboardService {
  constructor(private readonly api: IDashboardApiPort) {}

  async loadSummaryCards(filter: DashboardFilter): Promise<StatCardViewModel[]> {
    const aggregates = await this.api.fetchAggregates(filter);
    return mapAggregatesToSummaryCards(aggregates);
  }
}
