import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DashboardExportToolbar } from './DashboardExportToolbar';
import { EMPTY_DASHBOARD_FILTER } from '../../../../core/domain/dashboard-filter.model';
import { KAMPALA_DISTRICT_ID } from '../../../../core/domain/location-seed.constants';
import { useDashboardFilterStore } from '../../../../core/store/useDashboardFilterStore';
import type { ISubmissionExportApiPort } from '../../../../ports/submission-export-api.port';

function createExportApi(
  downloadExport: ISubmissionExportApiPort['downloadExport'] = vi.fn().mockResolvedValue(undefined)
): ISubmissionExportApiPort {
  return { downloadExport };
}

describe('DashboardExportToolbar', () => {
  beforeEach(() => {
    useDashboardFilterStore.setState({
      filter: { ...EMPTY_DASHBOARD_FILTER, districtId: KAMPALA_DISTRICT_ID, gender: 'FEMALE' },
      locationFilterError: null,
    });
    vi.clearAllMocks();
  });

  it('triggers CSV export with the active dashboard filter (TC-DASH-05-01)', async () => {
    const user = userEvent.setup();
    const downloadExport = vi.fn().mockResolvedValue(undefined);
    render(<DashboardExportToolbar exportApi={createExportApi(downloadExport)} />);

    await user.click(screen.getByTestId('export-csv'));

    await waitFor(() => {
      expect(downloadExport).toHaveBeenCalledWith(
        'csv',
        expect.objectContaining({ districtId: KAMPALA_DISTRICT_ID, gender: 'FEMALE' })
      );
    });
  });

  it('disables export buttons while a download is in progress', async () => {
    const user = userEvent.setup();
    let resolveExport: (() => void) | undefined;
    const downloadExport = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveExport = resolve;
        })
    );

    render(<DashboardExportToolbar exportApi={createExportApi(downloadExport)} />);

    await user.click(screen.getByTestId('export-xlsx'));

    expect(screen.getByTestId('export-csv')).toBeDisabled();
    expect(screen.getByTestId('export-pdf')).toBeDisabled();

    resolveExport?.();

    await waitFor(() => {
      expect(screen.getByTestId('export-csv')).not.toBeDisabled();
    });
  });

  it('shows an error message when export fails', async () => {
    const user = userEvent.setup();
    const downloadExport = vi.fn().mockRejectedValue(new Error('Export timed out'));
    render(<DashboardExportToolbar exportApi={createExportApi(downloadExport)} />);

    await user.click(screen.getByTestId('export-pdf'));

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-export-error')).toHaveTextContent('Export timed out');
    });
  });
});
