import type { AdminLocation } from './admin-location.model';

/** Temporary sample zones — mirror V7__Seed_Sample_Village_Zones.sql until real data is loaded. */
export const SAMPLE_VILLAGES_BY_PARISH_ID: Record<string, AdminLocation[]> = {
  // Bwaise I
  'b2a5c167-07dd-46e4-ba34-469268af5121': [
    {
      id: 'e2a5c167-07dd-46e4-ba34-469268af5241',
      name: 'Bwaise Central Zone',
      parentId: 'b2a5c167-07dd-46e4-ba34-469268af5121',
      level: 'VILLAGE',
    },
    {
      id: 'e2a5c167-07dd-46e4-ba34-469268af5242',
      name: 'Kinawataka Zone',
      parentId: 'b2a5c167-07dd-46e4-ba34-469268af5121',
      level: 'VILLAGE',
    },
    {
      id: 'e2a5c167-07dd-46e4-ba34-469268af5243',
      name: 'Apollo Zone',
      parentId: 'b2a5c167-07dd-46e4-ba34-469268af5121',
      level: 'VILLAGE',
    },
    {
      id: 'e2a5c167-07dd-46e4-ba34-469268af5244',
      name: 'Congo Zone',
      parentId: 'b2a5c167-07dd-46e4-ba34-469268af5121',
      level: 'VILLAGE',
    },
  ],
  // Nakasero II
  'b2a5c167-07dd-46e4-ba34-469268af5112': [
    {
      id: 'e2a5c167-07dd-46e4-ba34-469268af5141',
      name: 'Nakasero Hill Zone',
      parentId: 'b2a5c167-07dd-46e4-ba34-469268af5112',
      level: 'VILLAGE',
    },
    {
      id: 'e2a5c167-07dd-46e4-ba34-469268af5142',
      name: 'Rwenzori Courts Zone',
      parentId: 'b2a5c167-07dd-46e4-ba34-469268af5112',
      level: 'VILLAGE',
    },
  ],
  // Bugonga
  'b2a5c167-07dd-46e4-ba34-469268af5211': [
    {
      id: 'e2a5c167-07dd-46e4-ba34-469268af5231',
      name: 'Bugonga Village A',
      parentId: 'b2a5c167-07dd-46e4-ba34-469268af5211',
      level: 'VILLAGE',
    },
    {
      id: 'e2a5c167-07dd-46e4-ba34-469268af5232',
      name: 'Bugonga Zone B',
      parentId: 'b2a5c167-07dd-46e4-ba34-469268af5211',
      level: 'VILLAGE',
    },
    {
      id: 'e2a5c167-07dd-46e4-ba34-469268af5233',
      name: 'Bugonga Zone C',
      parentId: 'b2a5c167-07dd-46e4-ba34-469268af5211',
      level: 'VILLAGE',
    },
  ],
};

export function getSampleVillagesForParish(parishId: string): AdminLocation[] {
  return SAMPLE_VILLAGES_BY_PARISH_ID[parishId] ?? [];
}
