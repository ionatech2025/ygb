import { UserProfile } from '../core/domain/user.model';

export interface CreateCollectorPayload {
  fullName: string;
  phoneNumber: string;
  password: string;
}

export interface IUserRepositoryPort {
  fetchActiveCollectors(): Promise<UserProfile[]>;
  createDataCollector(payload: CreateCollectorPayload, adminId: string): Promise<UserProfile>;
}