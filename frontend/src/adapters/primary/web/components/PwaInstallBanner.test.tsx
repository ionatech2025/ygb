import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PwaInstallBanner } from './PwaInstallBanner';
import { usePwaInstallPrompt } from '../../../../core/hooks/usePwaInstallPrompt';

vi.mock('../../../../core/hooks/usePwaInstallPrompt', () => ({
  usePwaInstallPrompt: vi.fn(),
}));

function mockHook(overrides: Partial<ReturnType<typeof usePwaInstallPrompt>> = {}) {
  vi.mocked(usePwaInstallPrompt).mockReturnValue({
    canInstall: true,
    shouldShow: true,
    installMode: 'deferred',
    isIos: false,
    isAndroid: false,
    iosHelpOpen: false,
    setIosHelpOpen: vi.fn(),
    browserHelpOpen: false,
    setBrowserHelpOpen: vi.fn(),
    promptInstall: vi.fn().mockResolvedValue(undefined),
    dismiss: vi.fn(),
    ...overrides,
  });
}

describe('PwaInstallBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when shouldShow is false', () => {
    mockHook({ shouldShow: false, canInstall: false });
    render(<PwaInstallBanner />);
    expect(screen.queryByTestId('pwa-install-banner')).not.toBeInTheDocument();
  });

  it('renders Install and Not now when install is available', () => {
    mockHook();
    render(<PwaInstallBanner />);
    expect(screen.getByRole('button', { name: 'Install' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Not now' })).toBeInTheDocument();
  });

  it('calls deferred prompt when Install is clicked', async () => {
    const promptInstall = vi.fn().mockResolvedValue(undefined);
    mockHook({ promptInstall });
    const user = userEvent.setup();

    render(<PwaInstallBanner />);
    await user.click(screen.getByRole('button', { name: 'Install' }));

    expect(promptInstall).toHaveBeenCalledTimes(1);
  });

  it('shows iOS help content when primary action is clicked on iOS', async () => {
    const promptInstall = vi.fn();
    mockHook({ isIos: true, installMode: 'ios', promptInstall, iosHelpOpen: true });
    render(<PwaInstallBanner />);

    expect(screen.getByRole('button', { name: 'How to install' })).toBeInTheDocument();
    expect(screen.getByTestId('pwa-ios-help')).toBeInTheDocument();
    expect(screen.getByText(/Add to Home Screen/i)).toBeInTheDocument();
  });

  it('shows browser install help when using manual install mode', () => {
    mockHook({ installMode: 'browser', browserHelpOpen: true, isAndroid: true });
    render(<PwaInstallBanner />);

    expect(screen.getByRole('button', { name: 'How to install' })).toBeInTheDocument();
    expect(screen.getByTestId('pwa-browser-help')).toBeInTheDocument();
  });

  it('dismisses when Not now is clicked', async () => {
    const dismiss = vi.fn();
    mockHook({ dismiss });
    const user = userEvent.setup();

    render(<PwaInstallBanner />);
    await user.click(screen.getByRole('button', { name: 'Not now' }));

    expect(dismiss).toHaveBeenCalledTimes(1);
  });

  it('uses a compact dismiss control on the fixed login banner', () => {
    mockHook();
    render(<PwaInstallBanner placement="fixed" />);

    expect(screen.getByRole('button', { name: 'Not now' })).toBeInTheDocument();
    expect(screen.queryByText('Not now')).not.toBeInTheDocument();
  });

  it('does not render for standalone collectors', () => {
    mockHook({ shouldShow: false, canInstall: false });
    render(<PwaInstallBanner />);
    expect(screen.queryByTestId('pwa-install-banner')).not.toBeInTheDocument();
  });
});
