import type { AdminLocation, AdminLocationLevel } from '../core/domain/admin-location.model';

export interface ILocationRepositoryPort {
  save(locations: AdminLocation[]): Promise<void>;
  findByLevel(level: AdminLocationLevel): Promise<AdminLocation[]>;
  findByParentId(parentId: string): Promise<AdminLocation[]>;
  hasData(): Promise<boolean>;
  clear(): Promise<void>;
}
