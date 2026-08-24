import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { KAMPALA_DISTRICT_ID } from '../../../../core/domain/location-seed.constants';
import type { CollectorBreakdown } from '../../../../core/domain/collector-tracker.model';
import type { ICollectorSubmissionsApiPort } from '../../../../ports/collector-submissions-api.port';
import type { ISubmissionQueuePort } from '../../../../ports/submission-queue.port';
import { CollectorSubmissionsHistoryPage } from './CollectorSubmissionsHistoryPage';

const sampleBreakdown: CollectorBreakdown = {
  byFormType: [
    { formType: 'BYP', count: 35 },
    { formType: 'IYP', count: 29 },
  ],
  byDistrict: [{ districtId: KAMPALA_DISTRICT_ID, districtName: 'Kampala', count: 64 }],
};

function createApi(overrides: Partial<ICollectorSubmissionsApiPort> = {}): ICollectorSubmissionsApiPort {
  return {
    fetchMine: vi.fn().mockResolvedValue({
      items: [],
      totalElements: 0,
      page: 0,
      size: 25,
      totalPages: 0,
    }),
    fetchMineBreakdown: vi.fn().mockResolvedValue(sampleBreakdown),
    ...overrides,
  };
}

function createQueue(overrides: Partial<ISubmissionQueuePort> = {}): ISubmissionQueuePort {
  return {
    enqueue: vi.fn(),
    dequeueAll: vi.fn().mockResolvedValue([]),
    markSynced: vi.fn(),
    markFailed: vi.fn(),
    countPending: vi.fn().mockResolvedValue(0),
    countTodayLocal: vi.fn().mockResolvedValue(0),
    getLastSyncedAt: vi.fn().mockResolvedValue(null),
    listPending: vi.fn().mockResolvedValue([]),
    ...overrides,
  };
}

function renderPage(api: ICollectorSubmissionsApiPort, queue: ISubmissionQueuePort) {
  return render(
    <MemoryRouter initialEntries={['/collector/submissions']}>
      <Routes>
        <Route
          path="/collector/submissions"
          element={<CollectorSubmissionsHistoryPage submissionsApi={api} queue={queue} />}
        />
        <Route path="/collector/dashboard" element={<div>Field dashboard</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('CollectorSubmissionsHistoryPage', () => {
  it('loads form-type breakdown from the backend API and hides district rows', async () => {
    const api = createApi();
    renderPage(api, createQueue());

    await waitFor(() => {
      expect(screen.getByTestId('collector-breakdown-total')).toHaveTextContent('64');
    });

    expect(api.fetchMineBreakdown).toHaveBeenCalled();
    expect(api.fetchMine).not.toHaveBeenCalled();
    expect(screen.getByTestId('collector-breakdown-form-type-count')).toHaveTextContent('2');
    expect(screen.getByText('Beneficiary Young Person (BYP)')).toBeInTheDocument();
    expect(screen.getByText('Individual Young Person (IYP)')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
    expect(screen.getByText('29')).toBeInTheDocument();
    expect(screen.queryByText('Kampala')).not.toBeInTheDocument();
    expect(screen.queryByTestId('collector-breakdown-districts')).not.toBeInTheDocument();
    expect(screen.queryByTestId('collector-breakdown-district-count')).not.toBeInTheDocument();
    expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument();
  });

  it('shows server total plus the local pending count', async () => {
    renderPage(
      createApi(),
      createQueue({
        countPending: vi.fn().mockResolvedValue(2),
      })
    );

    await waitFor(() => {
      expect(screen.getByText(/64 on server/i)).toBeInTheDocument();
    });
    expect(screen.getByTestId('collector-waiting-to-sync')).toHaveTextContent(/2 waiting to sync/i);
  });

  it('shows waiting-to-sync summary even when the breakdown API fails', async () => {
    renderPage(
      createApi({
        fetchMineBreakdown: vi.fn().mockRejectedValue(new Error('Network down')),
      }),
      createQueue({
        countPending: vi.fn().mockResolvedValue(1),
      })
    );

    await waitFor(() => {
      expect(screen.getByTestId('collector-waiting-to-sync')).toBeInTheDocument();
    });

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
