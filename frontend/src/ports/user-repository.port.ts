import type { CollectorProfileFilter } from '../core/domain/collector-profile-filter.model';
import type { SubmissionPage } from '../core/domain/submission-admin.model';
import type { ResetPasswordResult, UserPage, UserProfile } from '../core/domain/user.model';

export interface CreateCollectorPayload {
  fullName: string;
  phoneNumber: string;
  password: string;
}

export interface IUserRepositoryPort {
  fetchActiveCollectors(page?: number, size?: number): Promise<UserPage>;
  createDataCollector(payload: CreateCollectorPayload, adminId: string): Promise<UserProfile>;
  deactivateUser(userId: string): Promise<UserProfile>;
  deleteUser(userId: string): Promise<void>;
  reactivateUser(userId: string): Promise<UserProfile>;
  resetPassword(userId: string): Promise<ResetPasswordResult>;
  getCollectorSubmissions(
    userId: string,
    filter: CollectorProfileFilter,
    page: number,
    size?: number
  ): Promise<SubmissionPage>;
}
