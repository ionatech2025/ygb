import type { AdminLocation } from './admin-location.model';
import {
  KAMPALA_CENTRAL_DIVISION_ID,
  KAMPALA_DISTRICT_ID,
  KAMPALA_KAMWOKYA_I_PARISH_ID,
} from './location-seed.constants';

/** Legacy label from V9 seed — mixed-case roman numeral. */
export const LEGACY_KAMWOKYA_I_PARISH_LABEL = 'Kamwokya I';

/** Client-approved label (Jul 2026): lowercase roman numerals. */
export const CORRECTED_KAMWOKYA_I_PARISH_LABEL = 'Kamwokya i';

/** Spot-check parish used in component tests for Kampala naming corrections. */
export const KAMPALA_KAMWOKYA_I_PARISH: AdminLocation = {
  id: KAMPALA_KAMWOKYA_I_PARISH_ID,
  name: CORRECTED_KAMWOKYA_I_PARISH_LABEL,
  parentId: KAMPALA_CENTRAL_DIVISION_ID,
  level: 'PARISH',
};

/** Minimal Kampala chain for cascading dropdown tests. */
export function buildKampalaCentralDivisionLocations(): AdminLocation[] {
  return [
    { id: KAMPALA_DISTRICT_ID, name: 'Kampala', parentId: null, level: 'DISTRICT' },
    {
      id: KAMPALA_CENTRAL_DIVISION_ID,
      name: 'Central Division',
      parentId: KAMPALA_DISTRICT_ID,
      level: 'SUBCOUNTY',
    },
    KAMPALA_KAMWOKYA_I_PARISH,
  ];
}
