import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DownloadUsageDatasetChart } from './DownloadUsageDatasetChart';

const setOptionSpy = vi.fn();

vi.mock('../components/EChart', () => ({
  EChart: ({
    testId,
    option,
  }: {
    testId?: string;
    option: { xAxis?: { data?: string[] } };
  }) => {
    setOptionSpy(option);
    return <div data-testid={testId} />;
  },
}));

describe('DownloadUsageDatasetChart', () => {
  it('labels hub tools and PDM legacy on the category axis', () => {
    render(
      <DownloadUsageDatasetChart
        data={[
          { dataset: 'PDM', count: 3 },
          { dataset: 'BYP', count: 2 },
          { dataset: 'LGO_BUDGET_ALLOCATION', count: 1 },
        ]}
      />
    );

    expect(screen.getByTestId('download-usage-dataset-chart')).toBeInTheDocument();
    expect(setOptionSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        xAxis: expect.objectContaining({
          data: ['PDM (legacy)', 'BYP', 'Budget Allocations'],
        }),
      })
    );
  });
});
