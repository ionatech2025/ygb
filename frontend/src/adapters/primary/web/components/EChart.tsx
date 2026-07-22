import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';

export interface EChartProps {
  option: EChartsOption;
  ariaLabel: string;
  testId: string;
  className?: string;
  onSegmentClick?: (params: echarts.ECElementEvent) => void;
}

export function EChart({ option, ariaLabel, testId, className, onSegmentClick }: EChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const onSegmentClickRef = useRef(onSegmentClick);

  onSegmentClickRef.current = onSegmentClick;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const chart = echarts.init(container);
    chartRef.current = chart;

    const handleClick = (params: echarts.ECElementEvent) => {
      onSegmentClickRef.current?.(params);
    };

    chart.on('click', handleClick);

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.off('click', handleClick);
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    chartRef.current?.setOption(option, true);
  }, [option]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={ariaLabel}
      data-testid={testId}
      className={className ?? 'h-64 w-full'}
    />
  );
}
