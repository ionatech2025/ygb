import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CascadingLocationSelector } from './CascadingLocationSelector';
import { EMPTY_LOCATION_FIELDS } from '../../../../core/domain/admin-location.model';
import type { AdminLocation } from '../../../../core/domain/admin-location.model';
import type { ILocationRepositoryPort } from '../../../../ports/location-repository.port';

vi.mock('../../../../core/LocationService', () => ({
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

const subcounty: AdminLocation = {
  id: 'subcounty-1',
  name: 'Central Division',
  parentId: district.id,
  level: 'SUBCOUNTY',
};

function createRepository(): ILocationRepositoryPort {
  return {
    save: vi.fn(),
    clear: vi.fn(),
    hasData: vi.fn().mockResolvedValue(true),
    findByLevel: vi.fn().mockImplementation(async (level) => (level === 'DISTRICT' ? [district] : [])),
    findByParentId: vi.fn().mockImplementation(async (parentId) =>
      parentId === district.id ? [subcounty] : []
    ),
  };
}

describe('CascadingLocationSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders only select elements for location levels', async () => {
    const repository = createRepository();
    render(
      <CascadingLocationSelector
        value={EMPTY_LOCATION_FIELDS}
        onChange={vi.fn()}
        repository={repository}
      />
    );

    await waitFor(() => expect(screen.getByLabelText(/^District/i)).not.toBeDisabled());

    expect(screen.getByLabelText(/^District/i).tagName).toBe('SELECT');
    expect(screen.getByLabelText(/Sub-county/i).tagName).toBe('SELECT');
    expect(screen.getByLabelText(/^Parish/i).tagName).toBe('SELECT');
    expect(screen.getByLabelText(/^Village/i).tagName).toBe('SELECT');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('populates sub-counties after a district is selected (TC-FORM-07-01)', async () => {
    const repository = createRepository();
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(
      <CascadingLocationSelector
        value={EMPTY_LOCATION_FIELDS}
        onChange={onChange}
        repository={repository}
      />
    );

    await waitFor(() => expect(screen.getByLabelText(/^District/i)).not.toBeDisabled());
    await user.selectOptions(screen.getByLabelText(/^District/i), district.id);

    expect(onChange).toHaveBeenCalledWith({
      districtId: district.id,
      subcountyId: '',
      parishId: '',
      villageId: '',
    });
  });
});
