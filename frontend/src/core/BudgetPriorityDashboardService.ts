import type { BudgetPriorityDashboardFilter } from './domain/budget-priority-dashboard-filter.model';
import type { StatCardViewModel } from './domain/dashboard-summary.model';
import type { BudgetPriorityDashboardSummary } from './domain/budget-priority-dashboard-summary.model';
import type {
  BudgetPriorityChartSeries,
  BudgetPriorityDashboardChartsViewModel,
} from './domain/budget-priority-dashboard-charts.model';
import { getBudgetPriorityAreaLabel } from './domain/budget-priority-form-config';
import { getBudgetPrioritySection } from './domain/budget-priority-section.model';
import type { IBudgetPriorityDashboardApiPort } from '../ports/budget-priority-dashboard-api.port';

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

function labelForSection(section: string): string {
  const label = getBudgetPrioritySection(section)?.shortLabel ?? section;
  return /(\+256|0)?7\d{8}/.test(label) ? 'Unknown sector' : label;
}

function sanitizeAggregateLabel(label: string, fallback: string): string {
  return /(\+256|0)?7\d{8}/.test(label) ? fallback : label;
}

export function mapBudgetPrioritySummaryToSummaryCards(
  summary: BudgetPriorityDashboardSummary
): StatCardViewModel[] {
  return [
    {
      id: 'total-submissions',
      title: 'Total submissions',
      primaryValue: formatCount(summary.totalSubmissions),
    },
    {
      id: 'by-section',
      title: 'By sector',
      items: summary.bySection.map((entry) => ({
        label: labelForSection(entry.section),
        value: formatCount(entry.count),
      })),
    },
    {
      id: 'top-priority-areas',
      title: 'Top priority areas',
      items: summary.topPriorityAreas.map((entry) => ({
        label: sanitizeAggregateLabel(
          getBudgetPriorityAreaLabel(entry.priorityArea),
          'Priority area'
        ),
        value: formatCount(entry.count),
      })),
    },
  ];
}

export function mapBudgetPriorityChartSeriesToViewModel(
  byPriorityArea: BudgetPriorityChartSeries,
  bySector: BudgetPriorityChartSeries,
  overTime: BudgetPriorityChartSeries
): BudgetPriorityDashboardChartsViewModel {
  return {
    byPriorityArea: byPriorityArea.data.map((point) => ({
      label: getBudgetPriorityAreaLabel(point.label),
      count: point.count,
    })),
    bySector: bySector.data.map((point) => ({
      label: labelForSection(point.label),
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

export class BudgetPriorityDashboardService {
  constructor(private readonly api: IBudgetPriorityDashboardApiPort) {}

  async loadSummaryCards(filter: BudgetPriorityDashboardFilter): Promise<StatCardViewModel[]> {
    const summary = await this.api.fetchSummary(filter);
    return mapBudgetPrioritySummaryToSummaryCards(summary);
  }

  async loadCharts(filter: BudgetPriorityDashboardFilter): Promise<BudgetPriorityDashboardChartsViewModel> {
    const [byPriorityArea, bySector, overTime] = await Promise.all([
      this.api.fetchChart('by-priority-area', filter),
      this.api.fetchChart('by-sector', filter),
      this.api.fetchChart('over-time', filter),
    ]);

    return mapBudgetPriorityChartSeriesToViewModel(byPriorityArea, bySector, overTime);
  }
}
