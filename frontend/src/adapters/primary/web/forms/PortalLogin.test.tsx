import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PortalLogin } from './PortalLogin';
import { useAuthStore } from '../../../../core/store/useAuthStore';

const loginMock = vi.fn();
const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('../components/PwaInstallBanner', () => ({
  PwaInstallBanner: () => null,
}));

describe('PortalLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loginMock.mockResolvedValue(undefined);
    useAuthStore.setState({
      login: loginMock,
      user: {
        id: '11111111-1111-1111-1111-111111111111',
        fullName: 'Administrator',
        phoneNumber: '0770000000',
        role: 'ADMIN',
      },
    });
  });

  it('submits the entered password when signing in', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <PortalLogin />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/^phone number/i), '0770000000');
    await user.type(screen.getByLabelText(/^password/i), 'password');
    await user.click(screen.getByRole('button', { name: /open my portal/i }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('0770000000', 'password');
    });
  });

  it('renders a password visibility toggle', () => {
    render(
      <MemoryRouter>
        <PortalLogin />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument();
  });
});
