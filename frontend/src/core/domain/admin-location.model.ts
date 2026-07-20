export type AdminLocationLevel = 'DISTRICT' | 'SUBCOUNTY' | 'PARISH' | 'VILLAGE';

export interface AdminLocation {
  id: string;
  name: string;
  parentId: string | null;
  level: AdminLocationLevel;
}

export interface LocationFields {
  districtId: string;
  subcountyId: string;
  parishId: string;
  villageId: string;
}

export const EMPTY_LOCATION_FIELDS: LocationFields = {
  districtId: '',
  subcountyId: '',
  parishId: '',
  villageId: '',
};
