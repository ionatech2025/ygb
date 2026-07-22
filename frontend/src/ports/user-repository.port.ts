import type { CollectorProfileFilter } from '../core/domain/collector-profile-filter.model';
import type { SubmissionPage } from '../core/domain/submission-admin.model';
import type { ResetPasswordResult, UserProfile } from '../core/domain/user.model';

export interface CreateCollectorPayload {
  fullName: string;
  phoneNumber: string;
  password: string;
}

export interface IUserRepositoryPort {
  fetchActiveCollectors(): Promise<UserProfile[]>;
  createDataCollector(payload: CreateCollectorPayload, adminId: string): Promise<UserProfile>;
  deactivateUser(userId: string): Promise<UserProfile>;
  reactivateUser(userId: string): Promise<UserProfile>;
  resetPassword(userId: string): Promise<ResetPasswordResult>;
  getCollectorSubmissions(
    userId: string,
    filter: CollectorProfileFilter,
    page: number,
    size?: number
  ): Promise<SubmissionPage>;
}