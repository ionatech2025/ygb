import Dexie, { Table } from 'dexie';
import type { AdminLocation, AdminLocationLevel } from '../../../core/domain/admin-location.model';
import type { ILocationRepositoryPort } from '../../../ports/location-repository.port';

class YGBLocationDatabase extends Dexie {
  adminLocations!: Table<AdminLocation, string>;

  constructor() {
    super('YGBLocationDatabase');
    this.version(1).stores({
      adminLocations: 'id, level, parentId',
    });
  }
}

const db = new YGBLocationDatabase();

export { db as locationDb };

export class LocationRepositoryAdapter implements ILocationRepositoryPort {
  async save(locations: AdminLocation[]): Promise<void> {
    await db.adminLocations.clear();
    await db.adminLocations.bulkPut(locations);
  }

  async findByLevel(level: AdminLocationLevel): Promise<AdminLocation[]> {
    return db.adminLocations.where('level').equals(level).sortBy('name');
  }

  async findByParentId(parentId: string): Promise<AdminLocation[]> {
    return db.adminLocations.where('parentId').equals(parentId).sortBy('name');
  }

  async hasData(): Promise<boolean> {
    return (await db.adminLocations.count()) > 0;
  }

  async clear(): Promise<void> {
    await db.adminLocations.clear();
  }
}

export const locationRepository = new LocationRepositoryAdapter();
