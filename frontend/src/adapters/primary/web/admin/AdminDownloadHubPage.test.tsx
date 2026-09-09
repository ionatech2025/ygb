import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IAdminToolDownloadApiPort } from '../../../../ports/admin-tool-download-api.port';
import { chooseFormOptionByValue } from '../../../../test-utils/choose-form-option';
import { AdminDownloadHubPage } from './AdminDownloadHubPage';

vi.mock('../components/CascadingLocationSelector', () => ({
  CascadingLocationSelector: () => <div data-testid="admin-download-hub-location-selector" />,
}));

function createDownloadApi(
  downloadToolDataset: IAdminToolDownloadApiPort['downloadToolDataset'] = vi
    .fn()
    .mockResolvedValue(undefined)
): IAdminToolDownloadApiPort {
  return { downloadToolDataset };
}

function renderHub(
  initialEntry = '/admin/downloads',
  downloadApi: IAdminToolDownloadApiPort = createDownloadApi()
) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/admin/downloads"
          element={<AdminDownloadHubPage downloadApi={downloadApi} />}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('AdminDownloadHubPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders tool picker, filters, and format actions without a profile dialog', () => {
    renderHub();

    expect(screen.getByTestId('admin-download-hub-page')).toBeInTheDocument();
    expect(screen.getByTestId('admin-download-hub-tool-picker')).toBeInTheDocument();
    expect(screen.getByTestId('admin-download-hub-tool-BYP')).toBeInTheDocument();
    expect(screen.getByTestId('admin-download-hub-filters')).toBeInTheDocument();
    expect(screen.getByTestId('admin-download-hub-export-csv')).toBeDisabled();
    expect(screen.queryByTestId('download-profile-dialog')).not.toBeInTheDocument();
  });

  it('preselects a tool from ?dataset= deep link', () => {
    renderHub('/admin/downloads?dataset=BUDGET_PRIORITIES');

    expect(screen.getByTestId('admin-download-hub-tool-BUDGET_PRIORITIES')).toHaveAttribute(
      'aria-checked',
      'true'
    );
    expect(screen.getByTestId('admin-download-hub-export-csv')).toBeEnabled();
  });

  it('downloads via admin API with optional filters and no profile gate', async () => {
    const user = userEvent.setup();
    const downloadApi = createDownloadApi();
    renderHub('/admin/downloads', downloadApi);

    await user.click(screen.getByTestId('admin-download-hub-tool-IYP'));
    await chooseFormOptionByValue(user, /^gender$/i, 'FEMALE');
    await user.click(screen.getByTestId('admin-download-hub-export-xlsx'));

    await waitFor(() => {
      expect(downloadApi.downloadToolDataset).toHaveBeenCalledWith(
        'IYP',
        'xlsx',
        expect.objectContaining({ gender: 'FEMALE' })
      );
    });
    expect(screen.queryByTestId('download-profile-dialog')).not.toBeInTheDocument();
  });
});
