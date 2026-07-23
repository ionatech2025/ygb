import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { PublicGeographicHeatmap } from './PublicGeographicHeatmap';

describe('PublicGeographicHeatmap', () => {
  it('shows tooltip with count for a region (TC-PUB-03-03)', async () => {
    const user = userEvent.setup();
    render(
      <PublicGeographicHeatmap
        data={[{ districtId: 'district-1', parishId: null, label: 'Kampala', count: 12 }]}
      />
    );

    await user.hover(screen.getByTestId('heatmap-region-district-1'));

    expect(screen.getByTestId('public-heatmap-tooltip')).toHaveTextContent('Kampala: 12 submissions');
  });
});
