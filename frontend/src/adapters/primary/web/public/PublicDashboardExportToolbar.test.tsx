import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../../../../core/api/api-client';
import { DOWNLOAD_SESSION_REJECTED_MESSAGE } from '../../../../core/domain/download-session-headers';
import { EMPTY_PUBLIC_DASHBOARD_FILTER } from '../../../../core/domain/public-dashboard-filter.model';
import { KAMPALA_DISTRICT_ID } from '../../../../core/domain/location-seed.constants';
import { usePublicDashboardFilterStore } from '../../../../core/store/usePublicDashboardFilterStore';
import type { IDownloadProfileApiPort } from '../../../../ports/download-profile-api.port';
import type { IPublicExportApiPort } from '../../../../ports/public-export-api.port';
import { chooseFormOptionByValue } from '../../../../test-utils/choose-form-option';
import {
  clearDownloadSession,
  readDownloadSession,
  writeDownloadSession,
} from '../../../secondary/storage/download-session.store';
import { PublicDashboardExportToolbar } from './PublicDashboardExportToolbar';

function createExportApi(
  downloadExport: IPublicExportApiPort['downloadExport'] = vi.fn().mockResolvedValue(undefined)
): IPublicExportApiPort {
  return { downloadExport };
}

function createProfileApi(
  registerProfile: IDownloadProfileApiPort['registerProfile'] = vi.fn().mockResolvedValue({
    profileId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    token: 'new-download-token',
    expiresAt: '2099-01-01T00:00:00',
  })
): IDownloadProfileApiPort {
  return { registerProfile };
}

function seedValidSession(token = 'opaque-download-token') {
  writeDownloadSession({
    profileId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    token,
    expiresAt: '2099-01-01T00:00:00',
  });
}

async function fillDownloadProfileForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/email/i), 'analyst@example.com');
  await chooseFormOptionByValue(user, /country/i, 'UG');
  await chooseFormOptionByValue(user, /^gender/i, 'FEMALE');
  await chooseFormOptionByValue(user, /age/i, 'AGE_25_29');
  await chooseFormOptionByValue(user, /field of operation/i, 'ACADEMIA_RESEARCH');
  await user.click(screen.getByRole('checkbox', { name: /i agree/i }));
}

describe('PublicDashboardExportToolbar', () => {
  beforeEach(() => {
    sessionStorage.clear();
    clearDownloadSession();
    usePublicDashboardFilterStore.setState({
      filter: { ...EMPTY_PUBLIC_DASHBOARD_FILTER, districtId: KAMPALA_DISTRICT_ID, gender: 'FEMALE' },
      locationFilterError: null,
    });
    vi.clearAllMocks();
  });

  it('opens the download profile form when no session exists (no naked export)', async () => {
    const user = userEvent.setup();
    const downloadExport = vi.fn().mockResolvedValue(undefined);
    renderToolbar(createExportApi(downloadExport));

    await user.click(screen.getByTestId('public-export-csv'));

    expect(await screen.findByTestId('download-profile-dialog')).toBeInTheDocument();
    expect(downloadExport).not.toHaveBeenCalled();
  });

  it('exports with the active filter and session token when a valid session exists (TC-PUB-04-01)', async () => {
    const user = userEvent.setup();
    seedValidSession('opaque-download-token');
    const downloadExport = vi.fn().mockResolvedValue(undefined);
    renderToolbar(createExportApi(downloadExport));

    await user.click(screen.getByTestId('public-export-csv'));

    await waitFor(() => {
      expect(downloadExport).toHaveBeenCalledWith(
        'csv',
        expect.objectContaining({ districtId: KAMPALA_DISTRICT_ID, gender: 'FEMALE' }),
        'opaque-download-token'
      );
    });
    expect(screen.queryByTestId('download-profile-dialog')).not.toBeInTheDocument();
  });

  it('auto-continues the original CSV download after profile success', async () => {
    const user = userEvent.setup();
    const downloadExport = vi.fn().mockResolvedValue(undefined);
    const profileApi = createProfileApi();
    renderToolbar(createExportApi(downloadExport), profileApi);

    await user.click(screen.getByTestId('public-export-csv'));
    expect(await screen.findByTestId('download-profile-dialog')).toBeInTheDocument();

    await fillDownloadProfileForm(user);
    await user.click(screen.getByRole('button', { name: /continue to download/i }));

    await waitFor(() => {
      expect(downloadExport).toHaveBeenCalledWith(
        'csv',
        expect.objectContaining({ districtId: KAMPALA_DISTRICT_ID }),
        'new-download-token'
      );
    });
    expect(readDownloadSession()?.token).toBe('new-download-token');
    expect(screen.queryByTestId('download-profile-dialog')).not.toBeInTheDocument();
  });

  it('works without auth store / access token when download session is present (TC-PUB-04-03)', async () => {
    const user = userEvent.setup();
    seedValidSession();
    const downloadExport = vi.fn().mockResolvedValue(undefined);
    renderToolbar(createExportApi(downloadExport));

    await user.click(screen.getByTestId('public-export-xlsx'));

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

    renderToolbar(createExportApi(downloadExport));

    await user.click(screen.getByTestId('public-export-csv'));

    await waitFor(() => {
      expect(screen.getByTestId('public-export-xlsx')).toBeDisabled();
    });

    resolveExport?.();

    await waitFor(() => {
      expect(screen.getByTestId('public-export-xlsx')).not.toBeDisabled();
    });
  });

  it('shows a clear error and clears session when the backend rejects the download session', async () => {
    const user = userEvent.setup();
    seedValidSession('stale-token');
    const downloadExport = vi
      .fn()
      .mockRejectedValue(new ApiError('Download session expired', 401));
    renderToolbar(createExportApi(downloadExport));

    await user.click(screen.getByTestId('public-export-xlsx'));

    await waitFor(() => {
      expect(screen.getByTestId('public-dashboard-export-error')).toHaveTextContent(
        DOWNLOAD_SESSION_REJECTED_MESSAGE
      );
    });
    expect(readDownloadSession()).toBeNull();
  });

  it('shows an error message when export fails for other reasons', async () => {
    const user = userEvent.setup();
    seedValidSession();
    const downloadExport = vi.fn().mockRejectedValue(new Error('Export timed out'));
    renderToolbar(createExportApi(downloadExport));

    await user.click(screen.getByTestId('public-export-xlsx'));

    await waitFor(() => {
      expect(screen.getByTestId('public-dashboard-export-error')).toHaveTextContent('Export timed out');
    });
  });
});

function renderToolbar(exportApi: IPublicExportApiPort, profileApi?: IDownloadProfileApiPort) {
  return render(
    <PublicDashboardExportToolbar exportApi={exportApi} profileApi={profileApi} />
  );
}
