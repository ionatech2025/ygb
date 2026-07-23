import type { EChartsOption } from 'echarts';
import type { PublicAgeGroupPieItem } from '../../../../core/domain/public-dashboard-charts.model';
import { PUBLIC_CHART_AXIS, PUBLIC_CHART_PALETTE, publicDashboardClasses } from '../../../../core/domain/public-dashboard.theme';
import { EChart } from '../components/EChart';

export interface PublicAgeGroupChartProps {
  data: PublicAgeGroupPieItem[];
}

function buildOption(data: PublicAgeGroupPieItem[]): EChartsOption {
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

export function PublicAgeGroupChart({ data }: PublicAgeGroupChartProps) {
  if (data.length === 0) {
    return (
      <p className={publicDashboardClasses.emptyChart} data-testid="chart-age-group-empty">
        No age group data for the current filters.
      </p>
    );
  }

  return (
    <EChart
      testId="chart-age-group"
      ariaLabel="Pie chart of submissions by age group"
      option={buildOption(data)}
    />
  );
}
