import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { PublicLayout } from './PublicLayout';

vi.mock('../components/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

function renderPublicLayout(initialPath = '/dashboard') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/dashboard" element={<div>Dashboard page</div>} />
          <Route path="/resources" element={<div>Resources page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('PublicLayout', () => {
  it('renders Dashboard and Resources links without auth context', () => {
    renderPublicLayout();

    expect(screen.getByRole('navigation', { name: 'Public sections' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/dashboard');
    expect(screen.getByRole('link', { name: 'Resources' })).toHaveAttribute('href', '/resources');
    expect(screen.queryByRole('link', { name: /sign in/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /log out/i })).not.toBeInTheDocument();
  });

  it('renders the active route outlet', () => {
    renderPublicLayout('/resources');
    expect(screen.getByText('Resources page')).toBeInTheDocument();
  });

  it('opens mobile navigation menu on small screens', async () => {
    const user = userEvent.setup();
    renderPublicLayout();

    const menuButton = screen.getByRole('button', { name: 'Open menu' });
    expect(screen.queryByTestId('public-mobile-nav')).not.toBeInTheDocument();

    await user.click(menuButton);

    expect(screen.getByTestId('public-mobile-nav')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close menu' })).toBeInTheDocument();
  });

  it('includes NAC attribution in the footer', () => {
    renderPublicLayout();
    expect(screen.getByText(/National Association of Councillors/i)).toBeInTheDocument();
  });
});
