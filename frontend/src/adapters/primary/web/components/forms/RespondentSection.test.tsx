import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { AdminLocation } from '../../../../../core/domain/admin-location.model';
import type { ILocationRepositoryPort } from '../../../../../ports/location-repository.port';
import { EMPTY_RESPONDENT_FIELDS } from '../../../../../core/domain/respondent-fields.model';
import { RespondentSection } from './RespondentSection';

vi.mock('../../../../../core/LocationService', () => ({
  locationService: {
    ensureLoaded: vi.fn().mockResolvedValue(undefined),
  },
}));

const district: AdminLocation = {
  id: 'district-1',
  name: 'Kampala',
  parentId: null,
  level: 'DISTRICT',
};

function createMockRepository(): ILocationRepositoryPort {
  return {
    save: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
    hasData: vi.fn().mockResolvedValue(true),
    findByLevel: vi.fn().mockImplementation(async (level) => (level === 'DISTRICT' ? [district] : [])),
    findByParentId: vi.fn().mockResolvedValue([]),
  };
}

describe('RespondentSection', () => {
  it('renders name, phone, gender, and age group fields (TC-FORM-06-03 partial)', () => {
    render(
      <RespondentSection
        value={EMPTY_RESPONDENT_FIELDS}
        onChange={() => undefined}
        locationRepository={createMockRepository()}
      />
    );

    expect(screen.getByLabelText(/name of respondent/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/age group/i)).toBeInTheDocument();
  });

  it('renders programme target age brackets', () => {
    render(
      <RespondentSection
        value={EMPTY_RESPONDENT_FIELDS}
        onChange={() => undefined}
        locationRepository={createMockRepository()}
      />
    );

    const ageSelect = screen.getByLabelText(/age group/i);
    expect(within(ageSelect).getByRole('option', { name: '18-24' })).toBeInTheDocument();
    expect(within(ageSelect).getByRole('option', { name: '25-29' })).toBeInTheDocument();
    expect(within(ageSelect).getByRole('option', { name: '30-35' })).toBeInTheDocument();
    expect(within(ageSelect).getByRole('option', { name: 'Above 35' })).toBeInTheDocument();
  });

  it('does not require respondent name', () => {
    render(
      <RespondentSection
        value={EMPTY_RESPONDENT_FIELDS}
        onChange={() => undefined}
        locationRepository={createMockRepository()}
      />
    );

    expect(screen.getByLabelText(/name of respondent/i)).not.toBeRequired();
  });

  it('renders CascadingLocationSelector selects instead of text inputs for location', async () => {
    render(
      <RespondentSection
        value={EMPTY_RESPONDENT_FIELDS}
        onChange={() => undefined}
        locationRepository={createMockRepository()}
      />
    );

    const selector = await screen.findByTestId('cascading-location-selector');
    const selects = within(selector).getAllByRole('combobox');
    expect(selects).toHaveLength(4);
    expect(screen.queryByRole('textbox', { name: /district/i })).not.toBeInTheDocument();
  });

  it('does not expose manual provenance inputs', () => {
    render(
      <RespondentSection
        value={EMPTY_RESPONDENT_FIELDS}
        onChange={() => undefined}
        locationRepository={createMockRepository()}
      />
    );

    expect(screen.queryByLabelText(/collector id/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/submitted at/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/device submission id/i)).not.toBeInTheDocument();
  });

  it('does not render an exact age field', () => {
    render(
      <RespondentSection
        value={EMPTY_RESPONDENT_FIELDS}
        onChange={() => undefined}
        locationRepository={createMockRepository()}
      />
    );

    expect(screen.queryByLabelText(/exact age/i)).not.toBeInTheDocument();
  });
});
