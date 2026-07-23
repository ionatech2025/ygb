import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LGO_BUDGET_ALLOCATION_ROUTES } from '../../../../core/domain/lgo-budget-allocation.routes';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { CollectorDashboard } from './CollectorDashboard';

vi.mock('../../../../core/store/useSyncStore', () => ({
  useSyncStore: (selector: (state: Record<string, unknown>) => unknown) =>
    selector({
      pendingCount: 0,
      lastSyncedAt: null,
      syncing: false,
      triggerSync: vi.fn(),
      initialize: vi.fn(),
    }),
}));

vi.mock('../../../../core/store/useSubmissionCountStore', () => ({
  useSubmissionCountStore: (selector: (state: Record<string, unknown>) => unknown) =>
    selector({
      todayCount: 0,
      refreshFromLocal: vi.fn(),
      reconcileWithServer: vi.fn(),
    }),
}));

vi.mock('./PDMSurveyView', () => ({
  PDMSurveyView: () => <div data-testid="pdm-survey-view" />,
}));

const collectorUser = {
  id: '22222222-2222-2222-2222-222222222222',
  fullName: 'Field Collector',
  phoneNumber: '0771111111',
  role: 'DATA_COLLECTOR' as const,
};

describe('CollectorDashboard', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: collectorUser,
      tokens: null,
      isAuthenticated: true,
      isInitialized: true,
      isOnline: true,
      getAccessToken: () => 'token',
    });
  });

  afterEach(() => {
    useAuthStore.getState().logout();
    useAuthStore.setState({ isInitialized: true });
  });

  it('includes an LGO Budget Allocation entry point distinct from the PDM survey', () => {
    render(
      <MemoryRouter>
        <CollectorDashboard />
      </MemoryRouter>
    );

    const entry = screen.getByTestId('lgo-budget-allocation-entry');
    expect(entry).toHaveAttribute('href', LGO_BUDGET_ALLOCATION_ROUTES.index);
    expect(screen.getByText('LGO Budget Allocation')).toBeInTheDocument();
    expect(screen.getByText(/not the LGO Questionnaire/i)).toBeInTheDocument();
    expect(screen.getByTestId('pdm-survey-view')).toBeInTheDocument();
  });
});
