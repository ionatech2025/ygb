import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { PdmResourcesIndexPage } from './PdmResourcesIndexPage';

describe('PdmResourcesIndexPage', () => {
  it('renders three resource links without an auth wrapper', () => {
    render(
      <MemoryRouter>
        <PdmResourcesIndexPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'PDM Information & Resources' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Programme Overview/i })).toHaveAttribute(
      'href',
      '/resources/programme-overview'
    );
    expect(screen.getByRole('link', { name: /Budget Allocations/i })).toHaveAttribute(
      'href',
      '/resources/budget-allocations'
    );
    expect(screen.getByRole('link', { name: /Priorities & Resources/i })).toHaveAttribute(
      'href',
      '/resources/priorities'
    );
    expect(screen.queryByRole('link', { name: /sign in/i })).not.toBeInTheDocument();
  });
});
