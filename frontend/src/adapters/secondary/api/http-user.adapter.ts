import { apiFetch } from '../../../core/api/api-client';
import { IUserRepositoryPort, CreateCollectorPayload } from '../../../ports/user-repository.port';
import { UserProfile } from '../../../core/domain/user.model';
import { normalizeUgandaPhoneLocal } from '../../../core/utils/phone-utils';

const COLLECTORS_CACHE_KEY = 'ygb-admin-collectors';

interface BackendUserResponse {
  id: string;
  name: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
}

function readCache(): UserProfile[] {
  try {
    const raw = localStorage.getItem(COLLECTORS_CACHE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile[]) : [];
  } catch {
    return [];
  }
}

function writeCache(collectors: UserProfile[]): void {
  localStorage.setItem(COLLECTORS_CACHE_KEY, JSON.stringify(collectors));
}

export class HttpUserAdapter implements IUserRepositoryPort {
  constructor(private readonly getAccessToken: () => string | null) {}

  async fetchActiveCollectors(): Promise<UserProfile[]> {
    return readCache().filter((u) => u.role === 'DATA_COLLECTOR');
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

    const profile: UserProfile = {
      id: created.id,
      fullName: created.name,
      phoneNumber: created.phoneNumber,
      role: 'DATA_COLLECTOR',
      createdAt: Date.now(),
    };

    writeCache([profile, ...readCache()]);
    return profile;
  }
}
