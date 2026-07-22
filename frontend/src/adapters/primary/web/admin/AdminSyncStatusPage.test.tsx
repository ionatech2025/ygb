import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminSyncStatusPage } from './AdminSyncStatusPage';
import type { IAdminSyncStatusApiPort } from '../../../../ports/admin-sync-status-api.port';

const receiptStatus = {
  totalSynced: 18,
  totalFlagged: 2,
  totalDuplicate: 1,
  byCollector: [
    {
      collectorId: 'collector-active',
      fullName: 'Default Collector',
      syncedCount: 6,
      flaggedCount: 1,
      duplicateCount: 0,
      lastReceivedAt: '2026-03-15T10:00:00',
      stale: false,
    },
    {
      collectorId: 'collector-stale',
      fullName: 'Stale Collector',
      syncedCount: 1,
      flaggedCount: 0,
      duplicateCount: 1,
      lastReceivedAt: '2026-03-10T10:00:00',
      stale: true,
    },
  ],
};

function createSyncStatusApi(
  fetchReceiptStatus = vi.fn().mockResolvedValue(receiptStatus)
): IAdminSyncStatusApiPort {
  return { fetchReceiptStatus };
}

describe('AdminSyncStatusPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders status counts from the receipt status API', async () => {
    render(<AdminSyncStatusPage syncStatusApi={createSyncStatusApi()} />);

    await waitFor(() => {
      expect(screen.getByTestId('receipt-status-summary')).toBeInTheDocument();
      expect(screen.getByTestId('stat-card-receipt-synced')).toHaveTextContent('18');
      expect(screen.getByTestId('stat-card-receipt-flagged')).toHaveTextContent('2');
      expect(screen.getByTestId('stat-card-receipt-duplicate')).toHaveTextContent('1');
    });
  });

  it('applies warning styling to stale collector rows (TC-DASH-08-02)', async () => {
    render(<AdminSyncStatusPage syncStatusApi={createSyncStatusApi()} />);

    await waitFor(() => {
      expect(screen.getByTestId('collector-receipt-row-collector-stale')).toHaveAttribute('data-stale', 'true');
      expect(screen.getByTestId('collector-receipt-stale-badge-collector-stale')).toBeInTheDocument();
      expect(screen.getByTestId('collector-receipt-row-collector-active')).toHaveAttribute('data-stale', 'false');
    });
  });

  it('shows an info banner that device pending queues are client-side only', async () => {
    render(<AdminSyncStatusPage syncStatusApi={createSyncStatusApi()} />);

    await waitFor(() => {
      expect(screen.getByTestId('receipt-status-pending-info')).toHaveTextContent(/pending on a collector device/i);
      expect(screen.getByTestId('receipt-status-pending-info')).toHaveTextContent(/IndexedDB/i);
      expect(screen.getByTestId('receipt-status-pending-info')).toHaveTextContent(/not visible here/i);
    });
  });
});
