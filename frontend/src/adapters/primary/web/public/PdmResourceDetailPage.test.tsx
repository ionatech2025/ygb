import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { PdmResourceDetailPage } from './PdmResourceDetailPage';

function renderDetail(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/resources/:slug" element={<PdmResourceDetailPage />} />
        <Route path="/resources" element={<div>Resources index</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('PdmResourceDetailPage', () => {
  it('renders programme overview heading and excerpt from source doc', () => {
    renderDetail('/resources/programme-overview');

    expect(screen.getByRole('heading', { name: 'Programme Overview' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'About the Parish Development Model (PDM)' })).toBeInTheDocument();
    expect(screen.getAllByText(/3\.5 million/).length).toBeGreaterThan(0);
    expect(screen.getByRole('navigation', { name: 'On this page' })).toBeInTheDocument();
  });

  it('redirects unknown slugs back to the resources index', () => {
    renderDetail('/resources/not-a-real-page');
    expect(screen.getByText('Resources index')).toBeInTheDocument();
  });
});
