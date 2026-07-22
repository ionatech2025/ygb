import { apiFetch } from '../../../core/api/api-client';
import { buildCollectorProfileFilterQueryString } from '../../../core/domain/collector-profile-filter.model';
import type { CollectorProfileFilter } from '../../../core/domain/collector-profile-filter.model';
import type { SubmissionPage } from '../../../core/domain/submission-admin.model';
import { IUserRepositoryPort, CreateCollectorPayload } from '../../../ports/user-repository.port';
import { ResetPasswordResult, UserProfile } from '../../../core/domain/user.model';
import { normalizeUgandaPhoneLocal } from '../../../core/utils/phone-utils';

const DEFAULT_PAGE_SIZE = 25;

interface BackendUserResponse {
  id: string;
  name: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
}

function mapCollector(user: BackendUserResponse): UserProfile {
  return {
    id: user.id,
    fullName: user.name,
    phoneNumber: user.phoneNumber,
    role: 'DATA_COLLECTOR',
    createdAt: Date.now(),
    isActive: user.isActive,
  };
}

export class HttpUserAdapter implements IUserRepositoryPort {
  constructor(private readonly getAccessToken: () => string | null) {}

  private requireToken(): string {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('You must be signed in as an administrator.');
    }
    return token;
  }

  async fetchActiveCollectors(): Promise<UserProfile[]> {
    const token = this.requireToken();

    const collectors = await apiFetch<BackendUserResponse[]>(
      '/api/v1/admin/users/data-collectors',
      { method: 'GET' },
      token
    );

    return collectors.map(mapCollector);
  }

  async createDataCollector(payload: CreateCollectorPayload, adminId: string): Promise<UserProfile> {
    void adminId;
    const token = this.requireToken();

    const phoneNumber = normalizeUgandaPhoneLocal(payload.phoneNumber);
    const created = await apiFetch<BackendUserResponse>(
      '/api/v1/admin/users/data-collectors',
      {
        method: 'POST',
        body: JSON.stringify({
          name: payload.fullName.trim(),
          phoneNumber,
          password: payload.password,
        }),
      },
      token
    );

    return mapCollector(created);
  }

  async deactivateUser(userId: string): Promise<UserProfile> {
    const token = this.requireToken();
    const updated = await apiFetch<BackendUserResponse>(
      `/api/v1/admin/users/${userId}/deactivate`,
      { method: 'PATCH' },
      token
    );
    return mapCollector(updated);
  }

  async reactivateUser(userId: string): Promise<UserProfile> {
    const token = this.requireToken();
    const updated = await apiFetch<BackendUserResponse>(
      `/api/v1/admin/users/${userId}/reactivate`,
      { method: 'PATCH' },
      token
    );
    return mapCollector(updated);
  }

  async resetPassword(userId: string): Promise<ResetPasswordResult> {
    const token = this.requireToken();
    return apiFetch<ResetPasswordResult>(
      `/api/v1/admin/users/${userId}/reset-password`,
      { method: 'POST' },
      token
    );
  }

  async getCollectorSubmissions(
    userId: string,
    filter: CollectorProfileFilter,
    page: number,
    size = DEFAULT_PAGE_SIZE
  ): Promise<SubmissionPage> {
    const token = this.requireToken();
    const filterQuery = buildCollectorProfileFilterQueryString(filter).replace(/^\?/, '');
    const params = new URLSearchParams(filterQuery);
    params.set('page', String(page));
    params.set('size', String(size));

    return apiFetch<SubmissionPage>(
      `/api/v1/admin/users/${userId}/submissions?${params.toString()}`,
      { method: 'GET' },
      token
    );
  }
}
