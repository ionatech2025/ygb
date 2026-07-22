import type { EChartsOption } from 'echarts';
import type { DashboardChartDrillDownEvent, GenderPieItem } from '../../../../core/domain/dashboard-charts.model';
import { EChart } from '../components/EChart';

const PIE_COLORS = ['#359966', '#19376d', '#f97316', '#64748b'];

export interface GenderSplitChartProps {
  data: GenderPieItem[];
  onDrillDown?: (event: DashboardChartDrillDownEvent) => void;
}

function buildOption(data: GenderPieItem[]): EChartsOption {
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
        cursor: 'pointer',
      },
    ],
  };
}

export function GenderSplitChart({ data, onDrillDown }: GenderSplitChartProps) {
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
      onSegmentClick={(params) => {
        const entry = data[params.dataIndex ?? -1];
        if (entry) {
          onDrillDown?.({ dimension: 'gender', value: entry.gender });
        }
      }}
    />
  );
}
