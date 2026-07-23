import type { LgoBudgetAllocationDashboardFilter } from './domain/lgo-budget-allocation-dashboard-filter.model';
import type { StatCardViewModel } from './domain/dashboard-summary.model';
import type { LgoBudgetAllocationDashboardSummary } from './domain/lgo-budget-allocation-dashboard-summary.model';
import type {
  LgoBudgetAllocationChartSeries,
  LgoBudgetAllocationDashboardChartsViewModel,
} from './domain/lgo-budget-allocation-dashboard-charts.model';
import { LGO_BUDGET_ALLOCATION_SECTORS } from './domain/lgo-budget-allocation-form.model';
import type { ILgoBudgetAllocationDashboardApiPort } from '../ports/lgo-budget-allocation-dashboard-api.port';

function formatCount(count: number): string {
  return count.toLocaleString('en-UG');
}

function formatChartDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }
  return parsed.toLocaleDateString('en-UG', { day: 'numeric', month: 'short', year: 'numeric' });
}

function sanitizeAggregateLabel(label: string, fallback: string): string {
  return /(\+256|0)?7\d{8}/.test(label) ? fallback : label;
}

function labelForSector(sector: string): string {
  const label = LGO_BUDGET_ALLOCATION_SECTORS.find((entry) => entry.id === sector)?.label ?? sector;
  return sanitizeAggregateLabel(label, 'Unknown sector');
}

export function mapLgoBudgetAllocationSummaryToSummaryCards(
  summary: LgoBudgetAllocationDashboardSummary
): StatCardViewModel[] {
  return [
    {
      id: 'total-submissions',
      title: 'Total submissions',
      primaryValue: formatCount(summary.totalSubmissions),
    },
    {
      id: 'by-district',
      title: 'By district',
      items: summary.byDistrict.map((entry) => ({
        label: sanitizeAggregateLabel(entry.districtLabel, 'District'),
        value: formatCount(entry.count),
      })),
    },
    {
      id: 'top-sectors',
      title: 'Top sectors',
      items: summary.topSectors.map((entry) => ({
        label: labelForSector(entry.sector),
        value: formatCount(entry.count),
      })),
    },
  ];
}

export function mapLgoBudgetAllocationChartSeriesToViewModel(
  byDistrict: LgoBudgetAllocationChartSeries,
  bySector: LgoBudgetAllocationChartSeries,
  overTime: LgoBudgetAllocationChartSeries
): LgoBudgetAllocationDashboardChartsViewModel {
  return {
    byDistrict: byDistrict.data.map((point) => ({
      label: sanitizeAggregateLabel(point.label, 'District'),
      count: point.count,
    })),
    bySector: bySector.data.map((point) => ({
      label: labelForSector(point.label),
      count: point.count,
    })),
    overTime: [...overTime.data]
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
  };
}

export class LgoBudgetAllocationDashboardService {
  constructor(private readonly api: ILgoBudgetAllocationDashboardApiPort) {}

  async loadSummaryCards(filter: LgoBudgetAllocationDashboardFilter): Promise<StatCardViewModel[]> {
    const summary = await this.api.fetchSummary(filter);
    return mapLgoBudgetAllocationSummaryToSummaryCards(summary);
  }

  async loadCharts(filter: LgoBudgetAllocationDashboardFilter): Promise<LgoBudgetAllocationDashboardChartsViewModel> {
    const [byDistrict, bySector, overTime] = await Promise.all([
      this.api.fetchChart('by-district', filter),
      this.api.fetchChart('by-sector', filter),
      this.api.fetchChart('over-time', filter),
    ]);

    return mapLgoBudgetAllocationChartSeriesToViewModel(byDistrict, bySector, overTime);
  }
}
