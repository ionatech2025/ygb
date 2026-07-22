import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SubmissionsByDistrictChart } from './SubmissionsByDistrictChart';
import { GenderSplitChart } from './GenderSplitChart';
import { SubmissionsOverTimeChart } from './SubmissionsOverTimeChart';

vi.mock('../components/EChart', () => ({
  EChart: ({
    testId,
    onSegmentClick,
  }: {
    testId: string;
    onSegmentClick?: (params: { dataIndex: number }) => void;
  }) => (
    <div data-testid={testId}>
      <button
        type="button"
        data-testid={`${testId}-segment`}
        onClick={() => onSegmentClick?.({ dataIndex: 0 })}
      >
        segment
      </button>
    </div>
  ),
}));

describe('chart drill-down callbacks', () => {
  it('fires district drill-down when a bar segment is clicked', async () => {
    const user = userEvent.setup();
    const onDrillDown = vi.fn();

    render(
      <SubmissionsByDistrictChart
        data={[{ districtId: 'district-1', districtName: 'Kampala', count: 12 }]}
        onDrillDown={onDrillDown}
      />
    );

    await user.click(screen.getByTestId('chart-submissions-by-district-segment'));

    expect(onDrillDown).toHaveBeenCalledWith({ dimension: 'district', value: 'district-1' });
  });

  it('fires gender drill-down when a pie segment is clicked', async () => {
    const user = userEvent.setup();
    const onDrillDown = vi.fn();

    render(
      <GenderSplitChart
        data={[{ gender: 'FEMALE', label: 'Female', count: 8 }]}
        onDrillDown={onDrillDown}
      />
    );

    await user.click(screen.getByTestId('chart-gender-split-segment'));

    expect(onDrillDown).toHaveBeenCalledWith({ dimension: 'gender', value: 'FEMALE' });
  });

  it('fires date drill-down when a line point is clicked', async () => {
    const user = userEvent.setup();
    const onDrillDown = vi.fn();

    render(
      <SubmissionsOverTimeChart
        data={[{ date: '2026-03-15', label: '15 Mar 2026', count: 5 }]}
        onDrillDown={onDrillDown}
      />
    );

    await user.click(screen.getByTestId('chart-submissions-over-time-segment'));

    expect(onDrillDown).toHaveBeenCalledWith({ dimension: 'date', value: '2026-03-15' });
  });
});
