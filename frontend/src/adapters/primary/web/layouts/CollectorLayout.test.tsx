import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '../../../../core/store/useAuthStore';
import { CollectorLayout } from './CollectorLayout';

vi.mock('../components/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

vi.mock('../components/SubmissionCountBadge', () => ({
  SubmissionCountBadge: () => <div data-testid="submission-count-badge" />,
}));

vi.mock('../components/PwaInstallBanner', () => ({
  PwaInstallBanner: () => null,
}));

vi.mock('../components/SyncFailedToast', () => ({
  SyncFailedToast: () => null,
}));

vi.mock('../components/SyncStatusBar', () => ({
  SyncStatusBar: () => <div data-testid="sync-status-bar" />,
}));

const collectorUser = {
  id: '22222222-2222-2222-2222-222222222222',
  fullName: 'Default Collector',
  phoneNumber: '0771111111',
  role: 'DATA_COLLECTOR' as const,
};

describe('CollectorLayout', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: collectorUser,
      tokens: null,
      isAuthenticated: true,
      isInitialized: true,
      isOnline: true,
      logout: vi.fn(),
      getAccessToken: () => 'token',
    });
  });

  afterEach(() => {
    useAuthStore.getState().logout();
    useAuthStore.setState({ isInitialized: true });
  });

  it('shows collector full name in the header', () => {
    render(
      <MemoryRouter initialEntries={['/collector/dashboard']}>
        <Routes>
          <Route element={<CollectorLayout />}>
            <Route path="/collector/dashboard" element={<div>Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Default Collector')).toBeInTheDocument();
    expect(screen.queryByText('Field Collector')).not.toBeInTheDocument();
    expect(screen.getByText('0771111111')).toBeInTheDocument();
  });
});
