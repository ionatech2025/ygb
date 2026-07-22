import type { DashboardFilter } from './dashboard-filter.model';
import type { DashboardFilterOptions } from '../../ports/dashboard-api.port';
import type { ILocationRepositoryPort } from '../../ports/location-repository.port';

const LOCATION_FILTER_ERROR_SNIPPETS = [
  'Location not found',
  'Parish location not found',
  'Sub-county location not found',
  'Parish does not belong',
  'Sub-county does not belong',
] as const;

export function isDashboardLocationFilterError(message: string): boolean {
  return LOCATION_FILTER_ERROR_SNIPPETS.some((snippet) => message.includes(snippet));
}

export function formatLocationFilterRecoveryMessage(apiMessage: string): string {
  return `${apiMessage} Location filters were cleared — please re-select district, sub-county, and parish.`;
}

export interface SanitizedLocationFilterResult {
  filter: DashboardFilter;
  wasSanitized: boolean;
  message?: string;
}

export async function sanitizeDashboardLocationFilter(
  filter: DashboardFilter,
  repository: ILocationRepositoryPort
): Promise<SanitizedLocationFilterResult> {
  const { districtId, subcountyId, parishId } = filter;

  if (!districtId && !subcountyId && !parishId) {
    return { filter, wasSanitized: false };
  }

  let nextDistrict = districtId;
  let nextSubcounty = subcountyId;
  let nextParish = parishId;
  let message: string | undefined;

  if (districtId) {
    const districts = await repository.findByLevel('DISTRICT');
    if (!districts.some((entry) => entry.id === districtId)) {
      nextDistrict = '';
      nextSubcounty = '';
      nextParish = '';
      message = 'The selected district is not available in your location dataset.';
    }
  }

  if (nextDistrict && subcountyId) {
    const subcounties = await repository.findByParentId(nextDistrict);
    if (!subcounties.some((entry) => entry.id === subcountyId)) {
      nextSubcounty = '';
      nextParish = '';
      message ??= 'The selected sub-county is not valid for the chosen district.';
    }
  } else if (subcountyId && !nextDistrict) {
    nextSubcounty = '';
    nextParish = '';
    message ??= 'Sub-county filter requires a valid district.';
  }

  if (nextSubcounty && parishId) {
    const parishes = await repository.findByParentId(nextSubcounty);
    if (!parishes.some((entry) => entry.id === parishId)) {
      nextParish = '';
      message ??= 'The selected parish is not valid for the chosen sub-county.';
    }
  } else if (parishId && !nextSubcounty) {
    nextParish = '';
    message ??= 'Parish filter requires a valid sub-county.';
  }

  const wasSanitized =
    nextDistrict !== districtId || nextSubcounty !== subcountyId || nextParish !== parishId;

  return {
    filter: {
      ...filter,
      districtId: nextDistrict,
      subcountyId: nextSubcounty,
      parishId: nextParish,
    },
    wasSanitized,
    message: wasSanitized ? (message ?? 'Invalid location filters were cleared.') : undefined,
  };
}

export function clearDashboardLocationFields(filter: DashboardFilter): DashboardFilter {
  return {
    ...filter,
    districtId: '',
    subcountyId: '',
    parishId: '',
  };
}

function includesId(options: Array<{ id: string }>, id: string): boolean {
  return options.some((entry) => entry.id === id);
}

/** Validates location IDs against dashboard filter-options API (submission locations table). */
export function sanitizeDashboardLocationFilterFromApiOptions(
  filter: DashboardFilter,
  options: Pick<DashboardFilterOptions, 'districts' | 'subcounties' | 'parishes'>
): SanitizedLocationFilterResult {
  const { districtId, subcountyId, parishId } = filter;

  if (!districtId && !subcountyId && !parishId) {
    return { filter, wasSanitized: false };
  }

  let nextDistrict = districtId;
  let nextSubcounty = subcountyId;
  let nextParish = parishId;
  let message: string | undefined;

  if (districtId && !includesId(options.districts, districtId)) {
    nextDistrict = '';
    nextSubcounty = '';
    nextParish = '';
    message = 'Saved district filter is no longer available and was cleared.';
  }

  if (nextDistrict && subcountyId && !includesId(options.subcounties, subcountyId)) {
    nextSubcounty = '';
    nextParish = '';
    message ??= 'Saved sub-county filter is no longer valid and was cleared.';
  } else if (subcountyId && !nextDistrict) {
    nextSubcounty = '';
    nextParish = '';
    message ??= 'Sub-county filter requires a valid district.';
  }

  if (nextSubcounty && parishId && !includesId(options.parishes, parishId)) {
    nextParish = '';
    message ??= 'Saved parish filter is no longer valid and was cleared.';
  } else if (parishId && !nextSubcounty) {
    nextParish = '';
    message ??= 'Parish filter requires a valid sub-county.';
  }

  const wasSanitized =
    nextDistrict !== districtId || nextSubcounty !== subcountyId || nextParish !== parishId;

  return {
    filter: {
      ...filter,
      districtId: nextDistrict,
      subcountyId: nextSubcounty,
      parishId: nextParish,
    },
    wasSanitized,
    message: wasSanitized ? (message ?? 'Outdated location filters were cleared.') : undefined,
  };
}
