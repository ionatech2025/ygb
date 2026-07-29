import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CascadingLocationSelector } from './CascadingLocationSelector';
import { EMPTY_LOCATION_FIELDS } from '../../../../core/domain/admin-location.model';
import type { AdminLocation } from '../../../../core/domain/admin-location.model';
import {
  buildKampalaCentralDivisionLocations,
  CORRECTED_KAMWOKYA_I_PARISH_LABEL,
  LEGACY_KAMWOKYA_I_PARISH_LABEL,
} from '../../../../core/domain/location-label-fixtures';
import {
  KAMPALA_CENTRAL_DIVISION_ID,
  KAMPALA_DISTRICT_ID,
} from '../../../../core/domain/location-seed.constants';
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

  it('renders corrected parish labels from an updated dataset fixture (Jul 2026 naming fix)', async () => {
    const locations = buildKampalaCentralDivisionLocations();
    const repository: ILocationRepositoryPort = {
      save: vi.fn(),
      clear: vi.fn(),
      hasData: vi.fn().mockResolvedValue(true),
      findByLevel: vi.fn().mockImplementation(async (level: AdminLocation['level']) =>
        locations.filter((location) => location.level === level)
      ),
      findByParentId: vi.fn().mockImplementation(async (parentId: string | null) =>
        locations.filter((location) => location.parentId === parentId)
      ),
    };
    const user = userEvent.setup();

    function ControlledSelector() {
      const [value, setValue] = useState(EMPTY_LOCATION_FIELDS);
      return (
        <CascadingLocationSelector value={value} onChange={setValue} repository={repository} />
      );
    }

    render(<ControlledSelector />);

    await waitFor(() => expect(screen.getByLabelText(/^District/i)).not.toBeDisabled());
    await user.selectOptions(screen.getByLabelText(/^District/i), KAMPALA_DISTRICT_ID);
    await waitFor(() => expect(screen.getByLabelText(/Sub-county/i)).not.toBeDisabled());
    await user.selectOptions(screen.getByLabelText(/Sub-county/i), KAMPALA_CENTRAL_DIVISION_ID);
    await waitFor(() => expect(screen.getByLabelText(/^Parish/i)).not.toBeDisabled());

    const parishSelect = screen.getByLabelText(/^Parish/i);
    expect(within(parishSelect).getByRole('option', { name: CORRECTED_KAMWOKYA_I_PARISH_LABEL })).toBeInTheDocument();
    expect(within(parishSelect).queryByRole('option', { name: LEGACY_KAMWOKYA_I_PARISH_LABEL })).not.toBeInTheDocument();
  });
});
