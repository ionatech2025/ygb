import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { DownloadSession } from '../../../../core/domain/download-session.model';
import type { IDownloadProfileApiPort } from '../../../../ports/download-profile-api.port';
import { chooseFormOptionByValue } from '../../../../test-utils/choose-form-option';
import {
  clearDownloadSession,
  readDownloadSession,
} from '../../../secondary/storage/download-session.store';
import { DownloadProfileDialog } from './DownloadProfileDialog';

function createMockApi(
  overrides: Partial<IDownloadProfileApiPort> = {}
): IDownloadProfileApiPort {
  return {
    registerProfile: vi.fn().mockResolvedValue({
      profileId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      token: 'opaque-download-token',
      expiresAt: '2026-08-04T13:00:00',
    } satisfies DownloadSession),
    ...overrides,
  };
}

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  const dialog = within(screen.getByTestId('download-profile-dialog'));
  await user.type(dialog.getByLabelText(/^email/i), 'analyst@example.com');
  await chooseFormOptionByValue(user, /country of residence/i, 'UG');
  await chooseFormOptionByValue(user, /^gender/i, 'FEMALE');
  await chooseFormOptionByValue(user, /^age group/i, 'AGE_25_29');
  await chooseFormOptionByValue(user, /field of operation/i, 'ACADEMIA_RESEARCH');
  await user.click(dialog.getByRole('checkbox', { name: /i agree/i }));
}

describe('DownloadProfileDialog', () => {
  beforeEach(() => {
    sessionStorage.clear();
    clearDownloadSession();
  });

  it(
    'shows privacy notice with consent checkbox and disables submit until valid',
    async () => {
      const user = userEvent.setup();
      render(
        <DownloadProfileDialog open onCancel={vi.fn()} onSuccess={vi.fn()} api={createMockApi()} />
      );

      expect(screen.getByText(/understand who uses/i)).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: /i agree/i })).toBeInTheDocument();

      const submit = screen.getByRole('button', { name: /continue to download/i });
      expect(submit).toBeDisabled();

      await fillRequiredFields(user);
      expect(submit).toBeEnabled();
    },
    15_000
  );

  it(
    'blocks invalid email client-side without calling the API',
    async () => {
      const user = userEvent.setup();
      const api = createMockApi();
      render(<DownloadProfileDialog open onCancel={vi.fn()} onSuccess={vi.fn()} api={api} />);

      const dialog = within(screen.getByTestId('download-profile-dialog'));
      await user.type(dialog.getByLabelText(/^email/i), 'not-an-email');
      await chooseFormOptionByValue(user, /country of residence/i, 'UG');
      await chooseFormOptionByValue(user, /^gender/i, 'FEMALE');
      await chooseFormOptionByValue(user, /^age group/i, 'AGE_25_29');
      await chooseFormOptionByValue(user, /field of operation/i, 'ACADEMIA_RESEARCH');
      await user.click(dialog.getByRole('checkbox', { name: /i agree/i }));

      expect(screen.getByRole('button', { name: /continue to download/i })).toBeDisabled();
      expect(api.registerProfile).not.toHaveBeenCalled();
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    },
    15_000
  );

  it(
    'stores session token and expiry on successful submit',
    async () => {
      const user = userEvent.setup();
      const onSuccess = vi.fn();
      const api = createMockApi();
      render(<DownloadProfileDialog open onCancel={vi.fn()} onSuccess={onSuccess} api={api} />);

      await fillRequiredFields(user);
      await user.click(screen.getByRole('button', { name: /continue to download/i }));

      await waitFor(() => {
        expect(api.registerProfile).toHaveBeenCalledWith(
          expect.objectContaining({
            email: 'analyst@example.com',
            countryCode: 'UG',
            gender: 'FEMALE',
            ageGroup: 'AGE_25_29',
            fieldOfOperation: 'ACADEMIA_RESEARCH',
            consentGiven: true,
            improvementFeedback: null,
          })
        );
      });

      expect(readDownloadSession()).toEqual({
        profileId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        token: 'opaque-download-token',
        expiresAt: '2026-08-04T13:00:00',
      });
      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ token: 'opaque-download-token' })
      );
    },
    15_000
  );

  it(
    'requires specify text when Other field of operation is selected',
    async () => {
      const user = userEvent.setup();
      const api = createMockApi();
      render(<DownloadProfileDialog open onCancel={vi.fn()} onSuccess={vi.fn()} api={api} />);

      const dialog = within(screen.getByTestId('download-profile-dialog'));
      await user.type(dialog.getByLabelText(/^email/i), 'analyst@example.com');
      await chooseFormOptionByValue(user, /country of residence/i, 'UG');
      await chooseFormOptionByValue(user, /^gender/i, 'FEMALE');
      await chooseFormOptionByValue(user, /^age group/i, 'AGE_25_29');
      await chooseFormOptionByValue(user, /field of operation/i, 'OTHER');
      await user.click(dialog.getByRole('checkbox', { name: /i agree/i }));

      expect(screen.getByRole('button', { name: /continue to download/i })).toBeDisabled();
      expect(dialog.getByLabelText(/please specify/i)).toBeInTheDocument();

      await user.type(dialog.getByLabelText(/please specify/i), 'Independent consultant');
      expect(screen.getByRole('button', { name: /continue to download/i })).toBeEnabled();
    },
    15_000
  );

  it(
    'allows optional improvement feedback and includes it on submit',
    async () => {
      const user = userEvent.setup();
      const api = createMockApi();
      render(<DownloadProfileDialog open onCancel={vi.fn()} onSuccess={vi.fn()} api={api} />);

      await fillRequiredFields(user);
      expect(screen.getByTestId('download-profile-improvement-feedback')).toBeInTheDocument();

      await user.type(
        screen.getByLabelText(/how can we improve downloads/i),
        'Add parish-level Excel templates'
      );
      await user.click(screen.getByRole('button', { name: /continue to download/i }));

      await waitFor(() => {
        expect(api.registerProfile).toHaveBeenCalledWith(
          expect.objectContaining({
            improvementFeedback: 'Add parish-level Excel templates',
          })
        );
      });
    },
    15_000
  );

  it(
    'submits without improvement feedback when left blank',
    async () => {
      const user = userEvent.setup();
      const api = createMockApi();
      render(<DownloadProfileDialog open onCancel={vi.fn()} onSuccess={vi.fn()} api={api} />);

      await fillRequiredFields(user);
      await user.click(screen.getByRole('button', { name: /continue to download/i }));

      await waitFor(() => {
        expect(api.registerProfile).toHaveBeenCalledWith(
          expect.objectContaining({
            improvementFeedback: null,
          })
        );
      });
    },
    15_000
  );
});
