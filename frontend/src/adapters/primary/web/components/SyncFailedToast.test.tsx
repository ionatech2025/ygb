import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SyncFailedToast } from './SyncFailedToast';
import { useSyncStore } from '../../../../core/store/useSyncStore';

const clearSyncErrorMock = vi.fn();

vi.mock('../../../../core/store/useSyncStore', () => ({
  useSyncStore: vi.fn(),
}));

function mockSyncStore(lastSyncError: string | null) {
  vi.mocked(useSyncStore).mockImplementation((selector) =>
    selector({
      lastSyncError,
      clearSyncError: clearSyncErrorMock,
    } as unknown as ReturnType<typeof useSyncStore.getState>)
  );
}

describe('SyncFailedToast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not render when lastSyncError is null', () => {
    mockSyncStore(null);
    render(<SyncFailedToast />);
    expect(screen.queryByTestId('sync-failed-toast')).not.toBeInTheDocument();
  });

  it('appears when lastSyncError is set', () => {
    mockSyncStore('Server unavailable');
    render(<SyncFailedToast />);
    expect(screen.getByTestId('sync-failed-toast')).toHaveTextContent('Server unavailable');
  });

  it('auto-dismisses after 5 seconds', () => {
    mockSyncStore('Network error');
    render(<SyncFailedToast />);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(clearSyncErrorMock).toHaveBeenCalledTimes(1);
  });

  it('dismisses immediately when close button is clicked', async () => {
    vi.useRealTimers();
    mockSyncStore('Network error');
    const user = userEvent.setup();
    render(<SyncFailedToast />);

    await user.click(screen.getByRole('button', { name: /dismiss sync error/i }));
    expect(clearSyncErrorMock).toHaveBeenCalledTimes(1);
  });
});
