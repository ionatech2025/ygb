import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BudgetPriorityExportToolbar } from './BudgetPriorityExportToolbar';
import { EMPTY_BUDGET_PRIORITY_DASHBOARD_FILTER } from '../../../../core/domain/budget-priority-dashboard-filter.model';
import { KAMPALA_DISTRICT_ID } from '../../../../core/domain/location-seed.constants';
import { useBudgetPriorityDashboardFilterStore } from '../../../../core/store/useBudgetPriorityDashboardFilterStore';
import type { IBudgetPriorityExportApiPort } from '../../../../ports/budget-priority-export-api.port';

function createExportApi(
  downloadExport: IBudgetPriorityExportApiPort['downloadExport'] = vi.fn().mockResolvedValue(undefined)
): IBudgetPriorityExportApiPort {
  return { downloadExport };
}

describe('BudgetPriorityExportToolbar', () => {
  beforeEach(() => {
    useBudgetPriorityDashboardFilterStore.setState({
      filter: {
        ...EMPTY_BUDGET_PRIORITY_DASHBOARD_FILTER,
        section: 'health',
        districtId: KAMPALA_DISTRICT_ID,
        gender: 'FEMALE',
      },
      locationFilterError: null,
    });
    vi.clearAllMocks();
  });

  it('triggers CSV export with the active budget priority filter (TC-BP-02-02)', async () => {
    const user = userEvent.setup();
    const downloadExport = vi.fn().mockResolvedValue(undefined);
    render(<BudgetPriorityExportToolbar exportApi={createExportApi(downloadExport)} />);

    await user.click(screen.getByTestId('bp-export-csv'));

    await waitFor(() => {
      expect(downloadExport).toHaveBeenCalledWith(
        'csv',
        expect.objectContaining({
          section: 'health',
          districtId: KAMPALA_DISTRICT_ID,
          gender: 'FEMALE',
        })
      );
    });
  });

  it('triggers Excel export with xlsx format', async () => {
    const user = userEvent.setup();
    const downloadExport = vi.fn().mockResolvedValue(undefined);
    render(<BudgetPriorityExportToolbar exportApi={createExportApi(downloadExport)} />);

    await user.click(screen.getByTestId('bp-export-xlsx'));

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

    render(<BudgetPriorityExportToolbar exportApi={createExportApi(downloadExport)} />);

    await user.click(screen.getByTestId('bp-export-csv'));

    expect(screen.getByTestId('bp-export-xlsx')).toBeDisabled();

    resolveExport?.();

    await waitFor(() => {
      expect(screen.getByTestId('bp-export-xlsx')).not.toBeDisabled();
    });
  });

  it('shows an error message when export fails', async () => {
    const user = userEvent.setup();
    const downloadExport = vi.fn().mockRejectedValue(new Error('Export timed out'));
    render(<BudgetPriorityExportToolbar exportApi={createExportApi(downloadExport)} />);

    await user.click(screen.getByTestId('bp-export-xlsx'));

    await waitFor(() => {
      expect(screen.getByTestId('budget-priority-export-error')).toHaveTextContent('Export timed out');
    });
  });
});
