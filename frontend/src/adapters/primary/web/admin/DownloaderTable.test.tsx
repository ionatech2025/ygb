import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { DownloaderSummary } from '../../../../core/domain/download-usage-analytics.model';
import { DownloaderTable } from './DownloaderTable';

function row(overrides: Partial<DownloaderSummary> = {}): DownloaderSummary {
  return {
    profileId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    email: 'partner@example.com',
    optionalName: null,
    countryCode: 'KE',
    gender: 'MALE',
    ageGroup: 'AGE_25_29',
    fieldOfOperation: 'NGO_CSO',
    fieldOfOperationSpecify: null,
    improvementFeedback: null,
    registeredAt: '2026-08-01T10:00:00',
    downloadCount: 1,
    lastDownloadedAt: null,
    ...overrides,
  };
}

describe('DownloaderTable', () => {
  it('shows improvement feedback when present and an em dash when absent', () => {
    render(
      <DownloaderTable
        rows={[
          row({
            profileId: 'with-feedback',
            improvementFeedback: 'More parish filters',
          }),
          row({ profileId: 'without-feedback', improvementFeedback: null }),
        ]}
        loading={false}
        page={0}
        totalPages={1}
        totalElements={2}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getByTestId('downloader-feedback-with-feedback')).toHaveTextContent(
      'More parish filters'
    );
    expect(screen.getByTestId('downloader-feedback-without-feedback')).toHaveTextContent('—');
    expect(screen.getByRole('columnheader', { name: /improvement feedback/i })).toBeInTheDocument();
  });
});
