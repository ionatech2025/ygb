import type { EChartsOption } from 'echarts';
import type { PublicAgeGroupPieItem } from '../../../../core/domain/public-dashboard-charts.model';
import { EChart } from '../components/EChart';

const PIE_COLORS = ['#19376d', '#359966', '#f97316', '#64748b', '#8b5cf6'];

export interface PublicAgeGroupChartProps {
  data: PublicAgeGroupPieItem[];
}

function buildOption(data: PublicAgeGroupPieItem[]): EChartsOption {
  return {
    animation: false,
    color: PIE_COLORS,
    tooltip: { trigger: 'item' },
    legend: {
      bottom: 0,
      textStyle: { color: '#64748b' },
    },
    series: [
      {
        type: 'pie',
        radius: ['42%', '68%'],
        center: ['50%', '45%'],
        data: data.map((entry) => ({ name: entry.label, value: entry.count })),
        label: { color: '#64748b' },
      },
    ],
  };
}

export function PublicAgeGroupChart({ data }: PublicAgeGroupChartProps) {
  if (data.length === 0) {
    return (
      <p className="flex h-64 items-center justify-center text-sm text-text-muted" data-testid="chart-age-group-empty">
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
