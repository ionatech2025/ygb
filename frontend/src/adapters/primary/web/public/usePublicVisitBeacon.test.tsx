import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IPublicVisitBeaconApiPort } from '../../../../ports/public-visit-beacon-api.port';
import { clearPublicVisitBeaconState } from '../../../secondary/storage/public-visit-session.store';
import { usePublicVisitBeacon } from './usePublicVisitBeacon';

function PublicShell({ api }: { api: IPublicVisitBeaconApiPort }) {
  usePublicVisitBeacon(api);
  return (
    <div>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/resources">Resources</Link>
      </nav>
      <Routes>
        <Route path="/dashboard" element={<div data-testid="dashboard-page">Dashboard page</div>} />
        <Route path="/resources" element={<div data-testid="resources-page">Resources page</div>} />
      </Routes>
    </div>
  );
}

function CollectorShell({ api }: { api: IPublicVisitBeaconApiPort }) {
  usePublicVisitBeacon(api);
  return <div data-testid="collector-shell">collector</div>;
}

describe('usePublicVisitBeacon', () => {
  beforeEach(() => {
    sessionStorage.clear();
    clearPublicVisitBeaconState();
    vi.clearAllMocks();
  });

  it('sends a beacon when the public dashboard mounts', async () => {
    const recordVisit = vi.fn().mockResolvedValue(undefined);
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <PublicShell api={{ recordVisit }} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(recordVisit).toHaveBeenCalledTimes(1);
    });
    expect(recordVisit).toHaveBeenCalledWith(
      expect.objectContaining({
        routeGroup: 'public-dashboard',
        anonymousSessionId: expect.any(String),
      })
    );
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });

  it('dedupes repeat navigations to the same route group within the anonymous session', async () => {
    const user = userEvent.setup();
    const recordVisit = vi.fn().mockResolvedValue(undefined);

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <PublicShell api={{ recordVisit }} />
      </MemoryRouter>
    );

    await waitFor(() => expect(recordVisit).toHaveBeenCalledTimes(1));
    expect(recordVisit).toHaveBeenCalledWith(
      expect.objectContaining({ routeGroup: 'public-dashboard' })
    );

    await user.click(screen.getByRole('link', { name: 'Resources' }));
    await waitFor(() => expect(screen.getByTestId('resources-page')).toBeInTheDocument());
    await waitFor(() => expect(recordVisit).toHaveBeenCalledTimes(2));
    expect(recordVisit).toHaveBeenLastCalledWith(
      expect.objectContaining({ routeGroup: 'resources' })
    );

    await user.click(screen.getByRole('link', { name: 'Dashboard' }));
    await waitFor(() => expect(screen.getByTestId('dashboard-page')).toBeInTheDocument());
    expect(recordVisit).toHaveBeenCalledTimes(2);
  });

  it('does not send a public visit beacon on collector dashboard', async () => {
    const recordVisit = vi.fn().mockResolvedValue(undefined);
    render(
      <MemoryRouter initialEntries={['/collector/dashboard']}>
        <Routes>
          <Route path="/collector/dashboard" element={<CollectorShell api={{ recordVisit }} />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('collector-shell')).toBeInTheDocument();
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(recordVisit).not.toHaveBeenCalled();
  });

  it('fails open when the beacon API rejects', async () => {
    const recordVisit = vi.fn().mockRejectedValue(new Error('network down'));
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <PublicShell api={{ recordVisit }} />
      </MemoryRouter>
    );

    await waitFor(() => expect(recordVisit).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });
});
