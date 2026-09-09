import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IDownloadProfileApiPort } from '../../../../ports/download-profile-api.port';
import type { IPublicToolDownloadApiPort } from '../../../../ports/public-tool-download-api.port';
import { chooseFormOptionByValue } from '../../../../test-utils/choose-form-option';
import {
  clearDownloadSession,
  writeDownloadSession,
} from '../../../secondary/storage/download-session.store';
import { PublicDownloadHubPage } from './PublicDownloadHubPage';

vi.mock('../components/CascadingLocationSelector', () => ({
  CascadingLocationSelector: () => <div data-testid="download-hub-location-selector" />,
}));

function createDownloadApi(
  downloadToolDataset: IPublicToolDownloadApiPort['downloadToolDataset'] = vi
    .fn()
    .mockResolvedValue(undefined)
): IPublicToolDownloadApiPort {
  return { downloadToolDataset };
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

function renderHub(
  initialEntry = '/download',
  props: {
    downloadApi?: IPublicToolDownloadApiPort;
    profileApi?: IDownloadProfileApiPort;
  } = {}
) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/download"
          element={
            <PublicDownloadHubPage
              downloadApi={props.downloadApi ?? createDownloadApi()}
              profileApi={props.profileApi ?? createProfileApi()}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

async function fillDownloadProfileForm(user: ReturnType<typeof userEvent.setup>) {
  const dialog = within(screen.getByTestId('download-profile-dialog'));
  await user.type(dialog.getByLabelText(/^email/i), 'analyst@example.com');
  await chooseFormOptionByValue(user, /country of residence/i, 'UG', dialog);
  await chooseFormOptionByValue(user, /^gender/i, 'FEMALE', dialog);
  await chooseFormOptionByValue(user, /^age group/i, 'AGE_25_29', dialog);
  await chooseFormOptionByValue(user, /field of operation/i, 'ACADEMIA_RESEARCH', dialog);
  await user.click(dialog.getByRole('checkbox', { name: /i agree/i }));
}

describe('PublicDownloadHubPage', () => {
  beforeEach(() => {
    sessionStorage.clear();
    clearDownloadSession();
    vi.clearAllMocks();
  });

  it('renders tool picker, filters, and format actions', () => {
    renderHub();

    expect(screen.getByTestId('public-download-hub-page')).toBeInTheDocument();
    expect(screen.getByTestId('public-download-hub-tool-picker')).toBeInTheDocument();
    expect(screen.getByTestId('download-hub-tool-BYP')).toBeInTheDocument();
    expect(screen.getByTestId('download-hub-tool-LGO_BUDGET_ALLOCATION')).toBeInTheDocument();
    expect(screen.getByTestId('public-download-hub-filters')).toBeInTheDocument();
    expect(screen.getByTestId('download-hub-location-selector')).toBeInTheDocument();
    expect(screen.getByTestId('download-hub-export-csv')).toBeDisabled();
    expect(screen.getByTestId('download-hub-export-xlsx')).toBeDisabled();
  });

  it('preselects a tool from ?dataset= deep link', () => {
    renderHub('/download?dataset=BYP');

    expect(screen.getByTestId('download-hub-tool-BYP')).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByTestId('download-hub-export-csv')).toBeEnabled();
  });

  it('enables downloads after selecting a tool and applies optional filters', async () => {
    const user = userEvent.setup();
    seedValidSession();
    const downloadApi = createDownloadApi();
    renderHub('/download', { downloadApi });

    await user.click(screen.getByTestId('download-hub-tool-IYP'));
    await chooseFormOptionByValue(user, /^gender$/i, 'FEMALE');
    await user.click(screen.getByTestId('download-hub-export-csv'));

    await waitFor(() => {
      expect(downloadApi.downloadToolDataset).toHaveBeenCalledWith(
        'IYP',
        'csv',
        expect.objectContaining({ gender: 'FEMALE' }),
        'opaque-download-token'
      );
    });
  });

  it('opens the download profile gate when no session exists', async () => {
    const user = userEvent.setup();
    const downloadApi = createDownloadApi();
    renderHub('/download?dataset=PC', { downloadApi });

    await user.click(screen.getByTestId('download-hub-export-xlsx'));

    expect(await screen.findByTestId('download-profile-dialog')).toBeInTheDocument();
    expect(downloadApi.downloadToolDataset).not.toHaveBeenCalled();
  });

  it(
    'continues Excel download after profile success including optional feedback',
    async () => {
      const user = userEvent.setup();
      const downloadApi = createDownloadApi();
      const profileApi = createProfileApi();
      renderHub('/download?dataset=LGO', { downloadApi, profileApi });

      await user.click(screen.getByTestId('download-hub-export-xlsx'));
      expect(await screen.findByTestId('download-profile-dialog')).toBeInTheDocument();

      await fillDownloadProfileForm(user);
      await user.type(
        within(screen.getByTestId('download-profile-dialog')).getByLabelText(
          /how can we improve downloads/i
        ),
        'More parish filters'
      );
      await user.click(screen.getByRole('button', { name: /continue to download/i }));

      await waitFor(() => {
        expect(profileApi.registerProfile).toHaveBeenCalledWith(
          expect.objectContaining({ improvementFeedback: 'More parish filters' })
        );
        expect(downloadApi.downloadToolDataset).toHaveBeenCalledWith(
          'LGO',
          'xlsx',
          expect.any(Object),
          'new-download-token'
        );
      });
    },
    20_000
  );
});
