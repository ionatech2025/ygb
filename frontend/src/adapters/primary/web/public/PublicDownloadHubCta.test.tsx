import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { PublicDownloadHubCta } from './PublicDownloadHubCta';

describe('PublicDownloadHubCta', () => {
  it('links to the general download hub when no dataset is provided', () => {
    render(
      <MemoryRouter>
        <PublicDownloadHubCta />
      </MemoryRouter>
    );

    expect(screen.getByTestId('public-download-hub-cta-link')).toHaveAttribute('href', '/download');
  });

  it('deep-links a specific tool when dataset is provided', () => {
    render(
      <MemoryRouter>
        <PublicDownloadHubCta dataset="BUDGET_PRIORITIES" />
      </MemoryRouter>
    );

    expect(screen.getByTestId('public-download-hub-cta-link')).toHaveAttribute(
      'href',
      '/download?dataset=BUDGET_PRIORITIES'
    );
  });
});
