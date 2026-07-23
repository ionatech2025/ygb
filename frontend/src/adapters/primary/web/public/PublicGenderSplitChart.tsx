import type { EChartsOption } from 'echarts';
import type { PublicGenderPieItem } from '../../../../core/domain/public-dashboard-charts.model';
import { PUBLIC_CHART_AXIS, PUBLIC_CHART_PALETTE, publicDashboardClasses } from '../../../../core/domain/public-dashboard.theme';
import { EChart } from '../components/EChart';

export interface PublicGenderSplitChartProps {
  data: PublicGenderPieItem[];
}

function buildOption(data: PublicGenderPieItem[]): EChartsOption {
  return {
    animation: false,
    color: [...PUBLIC_CHART_PALETTE],
    tooltip: { trigger: 'item' },
    legend: {
      bottom: 0,
      textStyle: { color: PUBLIC_CHART_AXIS.label },
    },
    series: [
      {
        type: 'pie',
        radius: ['42%', '68%'],
        center: ['50%', '45%'],
        data: data.map((entry) => ({ name: entry.label, value: entry.count })),
        label: { color: PUBLIC_CHART_AXIS.label },
      },
    ],
  };
}

export function PublicGenderSplitChart({ data }: PublicGenderSplitChartProps) {
  if (data.length === 0) {
    return (
      <p className={publicDashboardClasses.emptyChart} data-testid="chart-gender-empty">
        No gender data for the current filters.
      </p>
    );
  }

  return (
    <EChart
      testId="chart-gender-split"
      ariaLabel="Pie chart of submissions by gender"
      option={buildOption(data)}
    />
  );
}
