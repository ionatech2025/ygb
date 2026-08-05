import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EMPTY_BUDGET_PRIORITY_DASHBOARD_FILTER } from '../../../../core/domain/budget-priority-dashboard-filter.model';
import { KAMPALA_DISTRICT_ID } from '../../../../core/domain/location-seed.constants';
import { useBudgetPriorityDashboardFilterStore } from '../../../../core/store/useBudgetPriorityDashboardFilterStore';
import type { IBudgetPriorityExportApiPort } from '../../../../ports/budget-priority-export-api.port';
import {
  clearDownloadSession,
  writeDownloadSession,
} from '../../../secondary/storage/download-session.store';
import { BudgetPriorityExportToolbar } from './BudgetPriorityExportToolbar';

function createExportApi(
  downloadExport: IBudgetPriorityExportApiPort['downloadExport'] = vi.fn().mockResolvedValue(undefined)
): IBudgetPriorityExportApiPort {
  return { downloadExport };
}

function seedValidSession(token = 'opaque-download-token') {
  writeDownloadSession({
    profileId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    token,
    expiresAt: '2099-01-01T00:00:00',
  });
}

describe('BudgetPriorityExportToolbar', () => {
  beforeEach(() => {
    sessionStorage.clear();
    clearDownloadSession();
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

  it('opens the download profile form when no session exists (shared gate)', async () => {
    const user = userEvent.setup();
    const downloadExport = vi.fn().mockResolvedValue(undefined);
    render(<BudgetPriorityExportToolbar exportApi={createExportApi(downloadExport)} />);

    await user.click(screen.getByTestId('bp-export-csv'));

    expect(await screen.findByTestId('download-profile-dialog')).toBeInTheDocument();
    expect(downloadExport).not.toHaveBeenCalled();
  });

  it('triggers CSV export with filter and session token when session is valid (TC-BP-02-02)', async () => {
    const user = userEvent.setup();
    seedValidSession();
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
        }),
        'opaque-download-token'
      );
    });
  });

  it('triggers Excel export with xlsx format when session is valid', async () => {
    const user = userEvent.setup();
    seedValidSession();
    const downloadExport = vi.fn().mockResolvedValue(undefined);
    render(<BudgetPriorityExportToolbar exportApi={createExportApi(downloadExport)} />);

    await user.click(screen.getByTestId('bp-export-xlsx'));

    await waitFor(() => {
      expect(downloadExport).toHaveBeenCalledWith('xlsx', expect.any(Object), expect.any(String));
    });
  });

  it('disables export buttons while a download is in progress', async () => {
    const user = userEvent.setup();
    seedValidSession();
    let resolveExport: (() => void) | undefined;
    const downloadExport = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveExport = resolve;
        })
    );

    render(<BudgetPriorityExportToolbar exportApi={createExportApi(downloadExport)} />);

    await user.click(screen.getByTestId('bp-export-csv'));

    await waitFor(() => {
      expect(screen.getByTestId('bp-export-xlsx')).toBeDisabled();
    });

    resolveExport?.();

    await waitFor(() => {
      expect(screen.getByTestId('bp-export-xlsx')).not.toBeDisabled();
    });
  });

  it('shows an error message when export fails', async () => {
    const user = userEvent.setup();
    seedValidSession();
    const downloadExport = vi.fn().mockRejectedValue(new Error('Export timed out'));
    render(<BudgetPriorityExportToolbar exportApi={createExportApi(downloadExport)} />);

    await user.click(screen.getByTestId('bp-export-xlsx'));

    await waitFor(() => {
      expect(screen.getByTestId('budget-priority-export-error')).toHaveTextContent('Export timed out');
    });
  });
});
