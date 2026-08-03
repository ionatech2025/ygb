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
    canNativeInstall: true,
    shouldShow: true,
    installMode: 'deferred',
    isIos: false,
    isAndroid: false,
    iosHelpOpen: false,
    setIosHelpOpen: vi.fn(),
    browserHelpOpen: false,
    setBrowserHelpOpen: vi.fn(),
    promptInstall: vi.fn().mockResolvedValue(undefined),
    showInstallGuide: vi.fn(),
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

  it('renders Install, How to install, and Not now when native install is available', () => {
    mockHook();
    render(<PwaInstallBanner />);
    expect(screen.getByRole('button', { name: 'Install' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'How to install' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Not now' })).toBeInTheDocument();
  });

  it('opens the install guide when How to install is clicked', async () => {
    const showInstallGuide = vi.fn();
    mockHook({ showInstallGuide });
    const user = userEvent.setup();

    render(<PwaInstallBanner />);
    await user.click(screen.getByRole('button', { name: 'How to install' }));

    expect(showInstallGuide).toHaveBeenCalledTimes(1);
  });

  it('calls deferred prompt when Install is clicked', async () => {
    const promptInstall = vi.fn().mockResolvedValue(undefined);
    mockHook({ promptInstall });
    const user = userEvent.setup();

    render(<PwaInstallBanner />);
    await user.click(screen.getByRole('button', { name: 'Install' }));

    expect(promptInstall).toHaveBeenCalledTimes(1);
  });

  it('keeps the download icon as an active install control when native install is unavailable', async () => {
    const promptInstall = vi.fn().mockResolvedValue(undefined);
    mockHook({
      canNativeInstall: false,
      installMode: 'ios',
      isIos: true,
      promptInstall,
    });
    const user = userEvent.setup();

    render(<PwaInstallBanner />);

    const installControl = screen.getByRole('button', { name: 'Install' });
    expect(installControl).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'How to install' })).toBeInTheDocument();

    await user.click(installControl);
    expect(promptInstall).toHaveBeenCalledTimes(1);
  });

  it('opens iOS install help when How to install is clicked on iOS', () => {
    const showInstallGuide = vi.fn();
    mockHook({ isIos: true, installMode: 'ios', canNativeInstall: false, showInstallGuide, iosHelpOpen: true });
    render(<PwaInstallBanner />);

    expect(screen.getByRole('button', { name: 'How to install' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Install' })).toBeInTheDocument();
    expect(screen.getByTestId('pwa-ios-help')).toBeInTheDocument();
    expect(screen.getByText(/Safari \(iPhone \/ iPad\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Add to Home Screen/i)).toBeInTheDocument();
  });

  it('opens browser install help when How to install is clicked in browser mode', () => {
    mockHook({ installMode: 'browser', canNativeInstall: false, browserHelpOpen: true, isAndroid: false });
    render(<PwaInstallBanner />);

    expect(screen.getByRole('button', { name: 'How to install' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Install' })).toBeInTheDocument();
    expect(screen.getByTestId('pwa-browser-help')).toBeInTheDocument();
    expect(screen.getByText('Chrome')).toBeInTheDocument();
    expect(screen.getByText('Edge')).toBeInTheDocument();
    expect(screen.getByText('Safari')).toBeInTheDocument();
    expect(screen.getByText(/More tools/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Install Youth Go Budget App/i).length).toBeGreaterThanOrEqual(1);
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
