import type { PublicDashboardFilter } from './domain/public-dashboard-filter.model';
import type { StatCardViewModel } from './domain/dashboard-summary.model';
import type { PublicDashboardSummary } from './domain/public-dashboard-summary.model';
import { FORM_TYPE_OPTIONS } from './domain/form-type.model';
import { GENDER_OPTIONS } from './domain/form-validation.model';
import type { FinancialYearPeriodHalf } from './domain/financial-year-period.model';
import { formatFinancialYearPeriodLabel } from './financial-year-period';
import type { IPublicDashboardApiPort } from '../ports/public-dashboard-api.port';

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

export function mapPublicSummaryToSummaryCards(summary: PublicDashboardSummary): StatCardViewModel[] {
  return [
    {
      id: 'total-submissions',
      title: 'Total submissions',
      primaryValue: formatCount(summary.totalSubmissions),
    },
    {
      id: 'by-form-type',
      title: 'By form type',
      items: summary.byFormType.map((entry) => ({
        label: FORM_TYPE_LABELS[entry.formType] ?? entry.formType,
        value: formatCount(entry.count),
      })),
    },
    {
      id: 'gender-split',
      title: 'Gender split',
      items: summary.byGender.map((entry) => ({
        label: GENDER_LABELS[entry.gender] ?? entry.gender,
        value: formatCount(entry.count),
      })),
    },
    {
      id: 'by-financial-year',
      title: 'By financial year period',
      items: summary.byFinancialYearPeriod.map((entry) => ({
        label: labelFromFinancialYearPeriodKey(entry.financialYearPeriod),
        value: formatCount(entry.count),
      })),
    },
  ];
}

export class PublicDashboardService {
  constructor(private readonly api: IPublicDashboardApiPort) {}

  async loadSummaryCards(filter: PublicDashboardFilter): Promise<StatCardViewModel[]> {
    const summary = await this.api.fetchSummary(filter);
    return mapPublicSummaryToSummaryCards(summary);
  }
}
