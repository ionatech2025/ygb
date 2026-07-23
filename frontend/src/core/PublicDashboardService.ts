import type { PublicDashboardFilter } from './domain/public-dashboard-filter.model';
import type { StatCardViewModel } from './domain/dashboard-summary.model';
import type { PublicDashboardSummary } from './domain/public-dashboard-summary.model';
import type {
  PublicChartSeries,
  PublicDashboardChartsViewModel,
  PublicHeatmapEntry,
} from './domain/public-dashboard-charts.model';
import { FORM_TYPE_OPTIONS } from './domain/form-type.model';
import { AGE_GROUP_LABELS, GENDER_OPTIONS } from './domain/form-validation.model';
import type { FinancialYearPeriodHalf } from './domain/financial-year-period.model';
import { formatFinancialYearPeriodLabel } from './financial-year-period';
import type { IPublicDashboardApiPort } from '../ports/public-dashboard-api.port';

const FORM_TYPE_LABELS = Object.fromEntries(
  FORM_TYPE_OPTIONS.map((option) => [option.value, option.label])
) as Record<string, string>;

const GENDER_LABELS = Object.fromEntries(
  GENDER_OPTIONS.map((option) => [option.value, option.label])
) as Record<string, string>;

function formatChartDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }
  return parsed.toLocaleDateString('en-UG', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function mapPublicChartSeriesToViewModel(
  byDistrict: PublicChartSeries,
  byGender: PublicChartSeries,
  byAgeGroup: PublicChartSeries,
  trend: PublicChartSeries,
  heatmap: PublicHeatmapEntry[]
): PublicDashboardChartsViewModel {
  return {
    byDistrict: byDistrict.data
      .filter((point) => point.locationId)
      .map((point) => ({
        districtId: point.locationId as string,
        districtName: point.label,
        count: point.count,
      }))
      .sort((a, b) => b.count - a.count),
    byGender: byGender.data.map((point) => ({
      gender: point.label,
      label: GENDER_LABELS[point.label] ?? point.label,
      count: point.count,
    })),
    byAgeGroup: byAgeGroup.data.map((point) => ({
      ageGroup: point.label,
      label: AGE_GROUP_LABELS[point.label as keyof typeof AGE_GROUP_LABELS] ?? point.label,
      count: point.count,
    })),
    overTime: [...trend.data]
      .filter((point) => point.date ?? point.label)
      .map((point) => {
        const date = point.date ?? point.label;
        return {
          date,
          label: formatChartDate(date),
          count: point.count,
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date)),
    heatmap,
  };
}

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

  async loadCharts(filter: PublicDashboardFilter): Promise<PublicDashboardChartsViewModel> {
    const [byDistrict, byGender, byAgeGroup, trend, heatmap] = await Promise.all([
      this.api.fetchChart('by-district', filter),
      this.api.fetchChart('by-gender', filter),
      this.api.fetchChart('by-age-group', filter),
      this.api.fetchChart('trend', filter),
      this.api.fetchHeatmap(filter),
    ]);

    return mapPublicChartSeriesToViewModel(byDistrict, byGender, byAgeGroup, trend, heatmap);
  }
}
