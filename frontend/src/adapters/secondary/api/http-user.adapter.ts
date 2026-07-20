import { apiFetch } from '../../../core/api/api-client';
import { IUserRepositoryPort, CreateCollectorPayload } from '../../../ports/user-repository.port';
import { UserProfile } from '../../../core/domain/user.model';
import { normalizeUgandaPhoneLocal } from '../../../core/utils/phone-utils';

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
  };
}

export class HttpUserAdapter implements IUserRepositoryPort {
  constructor(private readonly getAccessToken: () => string | null) {}

  async fetchActiveCollectors(): Promise<UserProfile[]> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('You must be signed in as an administrator.');
    }

    const collectors = await apiFetch<BackendUserResponse[]>(
      '/api/v1/admin/users/data-collectors',
      { method: 'GET' },
      token
    );

    return collectors.map(mapCollector);
  }

  async createDataCollector(payload: CreateCollectorPayload, adminId: string): Promise<UserProfile> {
    void adminId;
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('You must be signed in as an administrator.');
    }

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
}
