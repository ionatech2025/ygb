import type { EChartsOption } from 'echarts';
import type { BudgetPriorityCountBarItem } from '../../../../core/domain/budget-priority-dashboard-charts.model';
import {
  PUBLIC_CHART_AXIS,
  PUBLIC_CHART_COLORS,
  publicDashboardClasses,
} from '../../../../core/domain/public-dashboard.theme';
import { EChart } from '../components/EChart';

export interface BudgetPriorityCountBarChartProps {
  data: BudgetPriorityCountBarItem[];
  emptyTestId: string;
  chartTestId: string;
  ariaLabel: string;
  emptyMessage: string;
}

function buildOption(data: BudgetPriorityCountBarItem[]): EChartsOption {
  return {
    animation: false,
    grid: { left: 48, right: 16, top: 16, bottom: 64 },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: data.map((entry) => entry.label),
      axisLabel: { color: PUBLIC_CHART_AXIS.label, rotate: data.length > 4 ? 30 : 0 },
      axisLine: { lineStyle: { color: PUBLIC_CHART_AXIS.grid } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: PUBLIC_CHART_AXIS.label },
      splitLine: { lineStyle: { color: PUBLIC_CHART_AXIS.grid } },
    },
    series: [
      {
        type: 'bar',
        data: data.map((entry) => entry.count),
        itemStyle: { color: PUBLIC_CHART_COLORS.brand, borderRadius: [4, 4, 0, 0] },
      },
    ],
  };
}

export function BudgetPriorityCountBarChart({
  data,
  emptyTestId,
  chartTestId,
  ariaLabel,
  emptyMessage,
}: BudgetPriorityCountBarChartProps) {
  if (data.length === 0) {
    return (
      <p className={publicDashboardClasses.emptyChart} data-testid={emptyTestId}>
        {emptyMessage}
      </p>
    );
  }

  return <EChart testId={chartTestId} ariaLabel={ariaLabel} option={buildOption(data)} />;
}
