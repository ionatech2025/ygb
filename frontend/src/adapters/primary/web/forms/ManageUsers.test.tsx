import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ManageUsers from './ManageUsers';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import type { IUserRepositoryPort } from '../../../../ports/user-repository.port';
import type { UserProfile } from '../../../../core/domain/user.model';

const collector: UserProfile = {
  id: 'collector-1',
  fullName: 'Jane Nakato',
  phoneNumber: '0772123456',
  role: 'DATA_COLLECTOR',
  createdAt: Date.now(),
  isActive: true,
};

function createUserAdmin(overrides: Partial<IUserRepositoryPort> = {}): IUserRepositoryPort {
  return {
    fetchActiveCollectors: vi.fn().mockResolvedValue([collector]),
    createDataCollector: vi.fn(),
    deactivateUser: vi.fn().mockResolvedValue({ ...collector, isActive: false }),
    reactivateUser: vi.fn(),
    resetPassword: vi.fn().mockResolvedValue({ temporaryPassword: 'TempPass1234' }),
    getCollectorSubmissions: vi.fn(),
    ...overrides,
  };
}

describe('ManageUsers lifecycle actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      isAuthenticated: true,
      getAccessToken: () => 'admin-token',
    });
    vi.stubGlobal('navigator', {
      ...navigator,
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('deactivate button calls API and refreshes the active list (TC-DASH-06-01)', async () => {
    const user = userEvent.setup();
    const userAdmin = createUserAdmin();
    render(
      <MemoryRouter>
        <ManageUsers userAdmin={userAdmin} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('collector-card-collector-1')).toBeInTheDocument();
    });

    await user.click(screen.getAllByTestId('deactivate-collector-1')[0]!);
    await user.click(screen.getByTestId('confirm-action-confirm'));

    await waitFor(() => {
      expect(userAdmin.deactivateUser).toHaveBeenCalledWith('collector-1');
      expect(screen.getByTestId('deactivated-collectors-section')).toBeInTheDocument();
      expect(screen.getByTestId('collector-table-deactivated')).toBeInTheDocument();
      expect(screen.getByText('No active data collectors found. Register one using the form.')).toBeInTheDocument();
    });
  });

  it('reset password shows success with the new temporary password (TC-DASH-06-02)', async () => {
    const user = userEvent.setup();
    const userAdmin = createUserAdmin();
    render(
      <MemoryRouter>
        <ManageUsers userAdmin={userAdmin} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByTestId('reset-password-collector-1')[0]).toBeInTheDocument();
    });

    await user.click(screen.getAllByTestId('reset-password-collector-1')[0]!);
    await user.click(screen.getByTestId('confirm-action-confirm'));

    await waitFor(() => {
      expect(userAdmin.resetPassword).toHaveBeenCalledWith('collector-1');
      expect(screen.getByTestId('reset-password-result')).toHaveTextContent('TempPass1234');
    });
  });

  it('auto-dismisses success messages after five seconds', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const userAdmin = createUserAdmin();

    render(
      <MemoryRouter>
        <ManageUsers userAdmin={userAdmin} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('collector-card-collector-1')).toBeInTheDocument();
    });

    await user.click(screen.getAllByTestId('deactivate-collector-1')[0]!);
    await user.click(screen.getByTestId('confirm-action-confirm'));

    await waitFor(() => {
      expect(screen.getByTestId('manage-users-success-message')).toHaveTextContent('has been deactivated.');
    });

    vi.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(screen.queryByTestId('manage-users-success-message')).not.toBeInTheDocument();
    });

    vi.useRealTimers();
  });
});
