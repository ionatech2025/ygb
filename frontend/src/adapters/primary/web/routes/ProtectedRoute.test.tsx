import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuthStore } from '../../../../core/store/useAuthStore';

vi.mock('../../../../core/store/useAuthStore', () => ({
  useAuthStore: vi.fn(),
}));

function mockAuth(state: Partial<ReturnType<typeof useAuthStore.getState>>) {
  vi.mocked(useAuthStore).mockImplementation((selector) =>
    selector({
      isInitialized: true,
      isAuthenticated: true,
      user: { id: '1', fullName: 'Test', phoneNumber: '0771000000', role: 'DATA_COLLECTOR' },
      ...state,
    } as ReturnType<typeof useAuthStore.getState>)
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects DATA_COLLECTOR away from admin routes', () => {
    mockAuth({ user: { id: '2', fullName: 'Collector', phoneNumber: '0772000000', role: 'DATA_COLLECTOR' } });

    render(
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<div>Admin only</div>} />
          </Route>
          <Route path="/collector/dashboard" element={<div>Collector home</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText('Admin only')).not.toBeInTheDocument();
    expect(screen.getByText('Collector home')).toBeInTheDocument();
  });
});
