import type { EChartsOption } from 'echarts';
import { EChart } from '../components/EChart';

const PIE_COLORS = ['#359966', '#19376d', '#f97316', '#64748b', '#0ea5e9'];

export interface AgeGroupChartItem {
  ageGroup: string;
  label: string;
  count: number;
}

export interface DownloadUsageAgeGroupChartProps {
  data: AgeGroupChartItem[];
}

function buildOption(data: AgeGroupChartItem[]): EChartsOption {
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

export function DownloadUsageAgeGroupChart({ data }: DownloadUsageAgeGroupChartProps) {
  if (data.length === 0) {
    return (
      <p
        className="flex h-64 items-center justify-center text-sm text-text-muted"
        data-testid="download-usage-age-chart-empty"
      >
        No age group data for the current filters.
      </p>
    );
  }

  return (
    <EChart
      testId="download-usage-age-chart"
      ariaLabel="Pie chart of downloaders by age group"
      option={buildOption(data)}
    />
  );
}
