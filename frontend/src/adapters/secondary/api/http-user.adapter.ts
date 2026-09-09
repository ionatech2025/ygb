import { apiFetch } from '../../../core/api/api-client';
import { buildCollectorProfileFilterQueryString } from '../../../core/domain/collector-profile-filter.model';
import type { CollectorProfileFilter } from '../../../core/domain/collector-profile-filter.model';
import type { SubmissionPage } from '../../../core/domain/submission-admin.model';
import { IUserRepositoryPort, CreateCollectorPayload } from '../../../ports/user-repository.port';
import { ResetPasswordResult, UserPage, UserProfile } from '../../../core/domain/user.model';
import { normalizeUgandaPhoneLocal } from '../../../core/utils/phone-utils';

const DEFAULT_PAGE_SIZE = 10;
const COLLECTORS_PAGE_SIZE = 25;

interface BackendUserResponse {
  id: string;
  name: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
}

interface BackendUserPageResponse {
  items: BackendUserResponse[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
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

  async fetchActiveCollectors(page = 0, size = COLLECTORS_PAGE_SIZE): Promise<UserPage> {
    const token = this.requireToken();
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
    });

    const response = await apiFetch<BackendUserPageResponse>(
      `/api/v1/admin/users/data-collectors?${params.toString()}`,
      { method: 'GET' },
      token
    );

    return {
      items: response.items.map(mapCollector),
      totalElements: response.totalElements,
      page: response.page,
      size: response.size,
      totalPages: response.totalPages,
    };
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

  async deleteUser(userId: string): Promise<void> {
    const token = this.requireToken();
    await apiFetch<void>(
      `/api/v1/admin/users/${userId}`,
      { method: 'DELETE' },
      token
    );
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
