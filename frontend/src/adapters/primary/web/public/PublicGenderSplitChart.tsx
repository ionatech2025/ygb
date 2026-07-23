import type { EChartsOption } from 'echarts';
import type { PublicGenderPieItem } from '../../../../core/domain/public-dashboard-charts.model';
import { EChart } from '../components/EChart';

const PIE_COLORS = ['#359966', '#19376d', '#f97316', '#64748b'];

export interface PublicGenderSplitChartProps {
  data: PublicGenderPieItem[];
}

function buildOption(data: PublicGenderPieItem[]): EChartsOption {
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

export function PublicGenderSplitChart({ data }: PublicGenderSplitChartProps) {
  if (data.length === 0) {
    return (
      <p className="flex h-64 items-center justify-center text-sm text-text-muted" data-testid="chart-gender-empty">
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
