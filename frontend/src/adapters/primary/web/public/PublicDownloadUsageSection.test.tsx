import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { PublicDownloadUsageAggregates } from '../../../../core/domain/public-download-usage.model';
import type { IPublicDownloadUsageApiPort } from '../../../../ports/public-download-usage-api.port';
import { PublicDownloadUsageSection } from './PublicDownloadUsageSection';

vi.mock('../components/EChart', () => ({
  EChart: ({ testId, ariaLabel }: { testId: string; ariaLabel: string }) => (
    <div data-testid={testId} aria-label={ariaLabel} />
  ),
}));

function createAggregates(): PublicDownloadUsageAggregates {
  return {
    totalDownloads: 125,
    byDataset: [
      { dataset: 'PUBLIC_SUBMISSIONS', count: 60 },
      { dataset: 'BUDGET_PRIORITIES', count: 40 },
      { dataset: 'LGO_BUDGET_ALLOCATION', count: 25 },
    ],
    downloadsOverTime: [
      { bucketStart: '2026-08-01', count: 30 },
      { bucketStart: '2026-08-02', count: 45 },
      { bucketStart: '2026-08-03', count: 50 },
    ],
  };
}

function createMockApi(
  data: PublicDownloadUsageAggregates = createAggregates(),
  shouldFail = false
): IPublicDownloadUsageApiPort {
  return {
    fetchPublicDownloadUsage: shouldFail
      ? vi.fn().mockRejectedValue(new Error('Network error loading download usage'))
      : vi.fn().mockResolvedValue(data),
  };
}

describe('PublicDownloadUsageSection', () => {
  it('renders section and fetches anonymised public download aggregates without login', async () => {
    const api = createMockApi();
    render(<PublicDownloadUsageSection downloadUsageApi={api} />);

    expect(screen.getByTestId('public-download-usage-section')).toBeInTheDocument();
    expect(screen.getByTestId('public-download-usage-skeleton')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('public-total-downloads-badge')).toHaveTextContent(
        'Total Open Data Downloads: 125'
      );
    });

    expect(api.fetchPublicDownloadUsage).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('panel-public-downloads-over-time')).toBeInTheDocument();
    expect(screen.getByTestId('panel-public-dataset-comparison')).toBeInTheDocument();
    expect(screen.getByTestId('public-download-over-time-chart')).toBeInTheDocument();
    expect(screen.getByTestId('public-download-dataset-chart')).toBeInTheDocument();
  });

  it('renders dataset comparison chart for PDM, Budget Priorities, and LGO', async () => {
    const api = createMockApi();
    render(<PublicDownloadUsageSection downloadUsageApi={api} />);

    await waitFor(() => {
      expect(screen.getByTestId('public-download-dataset-chart')).toBeInTheDocument();
    });

    expect(screen.getByTestId('panel-public-dataset-comparison')).toHaveTextContent(
      'Dataset comparison (PDM vs Budget Priorities vs LGO)'
    );
  });

  it('handles error state gracefully when API fails', async () => {
    const api = createMockApi(createAggregates(), true);
    render(<PublicDownloadUsageSection downloadUsageApi={api} />);

    await waitFor(() => {
      expect(screen.getByTestId('public-download-usage-error')).toBeInTheDocument();
    });

    expect(screen.getByTestId('public-download-usage-error')).toHaveTextContent(
      'Network error loading download usage'
    );
  });

  it('ensures no PII (emails, names, phone numbers) are rendered in the public UI', async () => {
    const api = createMockApi();
    const { container } = render(<PublicDownloadUsageSection downloadUsageApi={api} />);

    await waitFor(() => {
      expect(screen.getByTestId('public-total-downloads-badge')).toBeInTheDocument();
    });

    const html = container.innerHTML;
    expect(html).not.toMatch(/@/);
    expect(html).not.toContain('email');
    expect(html).not.toContain('phoneNumber');
    expect(html).not.toContain('optionalName');
  });
});
