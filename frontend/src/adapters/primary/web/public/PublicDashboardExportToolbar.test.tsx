import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PublicDashboardExportToolbar } from './PublicDashboardExportToolbar';
import { EMPTY_PUBLIC_DASHBOARD_FILTER } from '../../../../core/domain/public-dashboard-filter.model';
import { KAMPALA_DISTRICT_ID } from '../../../../core/domain/location-seed.constants';
import { usePublicDashboardFilterStore } from '../../../../core/store/usePublicDashboardFilterStore';
import type { IPublicExportApiPort } from '../../../../ports/public-export-api.port';

function createExportApi(
  downloadExport: IPublicExportApiPort['downloadExport'] = vi.fn().mockResolvedValue(undefined)
): IPublicExportApiPort {
  return { downloadExport };
}

describe('PublicDashboardExportToolbar', () => {
  beforeEach(() => {
    usePublicDashboardFilterStore.setState({
      filter: { ...EMPTY_PUBLIC_DASHBOARD_FILTER, districtId: KAMPALA_DISTRICT_ID, gender: 'FEMALE' },
      locationFilterError: null,
    });
    vi.clearAllMocks();
  });

  it('triggers CSV export with the active public dashboard filter (TC-PUB-04-01)', async () => {
    const user = userEvent.setup();
    const downloadExport = vi.fn().mockResolvedValue(undefined);
    render(<PublicDashboardExportToolbar exportApi={createExportApi(downloadExport)} />);

    await user.click(screen.getByTestId('public-export-csv'));

    await waitFor(() => {
      expect(downloadExport).toHaveBeenCalledWith(
        'csv',
        expect.objectContaining({ districtId: KAMPALA_DISTRICT_ID, gender: 'FEMALE' })
      );
    });
  });

  it('works without any auth store or access token (TC-PUB-04-03)', async () => {
    const user = userEvent.setup();
    const downloadExport = vi.fn().mockResolvedValue(undefined);
    render(<PublicDashboardExportToolbar exportApi={createExportApi(downloadExport)} />);

    await user.click(screen.getByTestId('public-export-xlsx'));

    await waitFor(() => {
      expect(downloadExport).toHaveBeenCalledWith('xlsx', expect.any(Object));
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

    render(<PublicDashboardExportToolbar exportApi={createExportApi(downloadExport)} />);

    await user.click(screen.getByTestId('public-export-csv'));

    expect(screen.getByTestId('public-export-xlsx')).toBeDisabled();

    resolveExport?.();

    await waitFor(() => {
      expect(screen.getByTestId('public-export-xlsx')).not.toBeDisabled();
    });
  });

  it('shows an error message when export fails', async () => {
    const user = userEvent.setup();
    const downloadExport = vi.fn().mockRejectedValue(new Error('Export timed out'));
    render(<PublicDashboardExportToolbar exportApi={createExportApi(downloadExport)} />);

    await user.click(screen.getByTestId('public-export-xlsx'));

    await waitFor(() => {
      expect(screen.getByTestId('public-dashboard-export-error')).toHaveTextContent('Export timed out');
    });
  });
});
