import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SyncStatusBar } from './SyncStatusBar';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { useSyncStore } from '../../../../core/store/useSyncStore';

vi.mock('../../../../core/store/useAuthStore', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('../../../../core/store/useSyncStore', () => ({
  useSyncStore: vi.fn(),
}));

function mockStores({
  isOnline = true,
  pendingCount = 0,
  lastSyncedAt = null as Date | null,
  syncing = false,
}: {
  isOnline?: boolean;
  pendingCount?: number;
  lastSyncedAt?: Date | null;
  syncing?: boolean;
}) {
  vi.mocked(useAuthStore).mockImplementation((selector) =>
    selector({ isOnline } as unknown as ReturnType<typeof useAuthStore.getState>)
  );
  vi.mocked(useSyncStore).mockImplementation((selector) =>
    selector({ pendingCount, lastSyncedAt, syncing } as unknown as ReturnType<typeof useSyncStore.getState>)
  );
}

describe('SyncStatusBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Offline when isOnline is false', () => {
    mockStores({ isOnline: false });
    render(<SyncStatusBar />);
    expect(screen.getByTestId('sync-status-bar')).toHaveTextContent('Offline');
  });

  it('renders Online and hides pending badge when pendingCount is 0', () => {
    mockStores({ isOnline: true, pendingCount: 0 });
    render(<SyncStatusBar />);
    expect(screen.getByTestId('sync-status-bar')).toHaveTextContent('Online');
    expect(screen.queryByTestId('sync-pending-count')).not.toBeInTheDocument();
  });

  it('shows Pending: 3 when pendingCount is 3', () => {
    mockStores({ pendingCount: 3 });
    render(<SyncStatusBar />);
    expect(screen.getByTestId('sync-pending-count')).toHaveTextContent('Pending: 3');
  });

  it('shows Last synced time after a successful sync', () => {
    mockStores({ lastSyncedAt: new Date('2026-07-22T14:30:00') });
    render(<SyncStatusBar />);
    expect(screen.getByTestId('sync-last-synced')).toHaveTextContent(/Last synced:/);
  });
});
