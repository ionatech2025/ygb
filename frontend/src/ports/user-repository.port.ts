import type { User, UserRole } from '../core/domain/user.model';

// If CreateDataCollectorInput is not exported from the domain model,
// accept a partial User payload for creating a data collector.
export interface UserRepositoryPort {
  createDataCollector(input: Partial<User>): Promise<User>;
  getUsersByRole(role: UserRole): Promise<User[]>;
}