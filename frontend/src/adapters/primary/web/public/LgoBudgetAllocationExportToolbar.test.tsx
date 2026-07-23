import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_FILTER } from '../../../../core/domain/lgo-budget-allocation-dashboard-filter.model';
import { KAMPALA_DISTRICT_ID } from '../../../../core/domain/location-seed.constants';
import { useLgoBudgetAllocationDashboardFilterStore } from '../../../../core/store/useLgoBudgetAllocationDashboardFilterStore';
import type { ILgoBudgetAllocationExportApiPort } from '../../../../ports/lgo-budget-allocation-export-api.port';
import { LgoBudgetAllocationExportToolbar } from './LgoBudgetAllocationExportToolbar';

function createExportApi(
  downloadCsv: ILgoBudgetAllocationExportApiPort['downloadCsv'] = vi.fn().mockResolvedValue(undefined)
): ILgoBudgetAllocationExportApiPort {
  return { downloadCsv };
}

describe('LgoBudgetAllocationExportToolbar', () => {
  beforeEach(() => {
    useLgoBudgetAllocationDashboardFilterStore.setState({
      filter: {
        ...EMPTY_LGO_BUDGET_ALLOCATION_DASHBOARD_FILTER,
        districtId: KAMPALA_DISTRICT_ID,
        gender: 'FEMALE',
        financialYearPeriod: 'JAN_JUN_2026',
      },
      locationFilterError: null,
    });
    vi.clearAllMocks();
  });

  it('renders Download CSV control', () => {
    render(<LgoBudgetAllocationExportToolbar exportApi={createExportApi()} />);

    expect(screen.getByTestId('lgo-budget-allocation-export-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('lgo-export-csv')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download csv/i })).toBeInTheDocument();
  });

  it('triggers CSV export with the active LGO budget allocation filter (TC-LGOB-02-02)', async () => {
    const user = userEvent.setup();
    const downloadCsv = vi.fn().mockResolvedValue(undefined);
    render(<LgoBudgetAllocationExportToolbar exportApi={createExportApi(downloadCsv)} />);

    await user.click(screen.getByTestId('lgo-export-csv'));

    await waitFor(() => {
      expect(downloadCsv).toHaveBeenCalledWith(
        expect.objectContaining({
          districtId: KAMPALA_DISTRICT_ID,
          gender: 'FEMALE',
          financialYearPeriod: 'JAN_JUN_2026',
        })
      );
    });
  });

  it('disables export button while a download is in progress', async () => {
    const user = userEvent.setup();
    let resolveExport: (() => void) | undefined;
    const downloadCsv = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveExport = resolve;
        })
    );

    render(<LgoBudgetAllocationExportToolbar exportApi={createExportApi(downloadCsv)} />);

    await user.click(screen.getByTestId('lgo-export-csv'));

    expect(screen.getByTestId('lgo-export-csv')).toBeDisabled();

    resolveExport?.();

    await waitFor(() => {
      expect(screen.getByTestId('lgo-export-csv')).not.toBeDisabled();
    });
  });

  it('shows an error message when export fails', async () => {
    const user = userEvent.setup();
    const downloadCsv = vi.fn().mockRejectedValue(new Error('Export timed out'));
    render(<LgoBudgetAllocationExportToolbar exportApi={createExportApi(downloadCsv)} />);

    await user.click(screen.getByTestId('lgo-export-csv'));

    await waitFor(() => {
      expect(screen.getByTestId('lgo-budget-allocation-export-error')).toHaveTextContent('Export timed out');
    });
  });
});
