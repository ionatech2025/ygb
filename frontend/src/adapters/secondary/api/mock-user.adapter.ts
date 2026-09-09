import { IUserRepositoryPort, CreateCollectorPayload } from '../../../ports/user-repository.port';
import { ResetPasswordResult, UserPage, UserProfile } from '../../../core/domain/user.model';
import type { CollectorProfileFilter } from '../../../core/domain/collector-profile-filter.model';
import type { SubmissionPage } from '../../../core/domain/submission-admin.model';

let mockDatabase: UserProfile[] = [
  { id: 'dc-01', fullName: 'Jane Nakato', phoneNumber: '+256772123456', role: 'DATA_COLLECTOR', createdAt: Date.now() }
];

export class MockUserAdapter implements IUserRepositoryPort {

  async fetchActiveCollectors(page = 0, size = 25): Promise<UserPage> {
    const start = page * size;
    const items = mockDatabase.slice(start, start + size);
    return {
      items: [...items],
      totalElements: mockDatabase.length,
      page,
      size,
      totalPages: Math.ceil(mockDatabase.length / size) || 0,
    };
  }

  async createDataCollector(payload: CreateCollectorPayload, adminId: string): Promise<UserProfile> {
    void adminId;
    void payload.password;
    const exists = mockDatabase.some(u => u.phoneNumber === payload.phoneNumber);
    if (exists) {
      throw new Error('Phone number already registered');
    }

    const newCollector: UserProfile = {
      id: `dc-${Math.floor(Math.random() * 1000)}`,
      fullName: payload.fullName,
      phoneNumber: payload.phoneNumber,
      role: 'DATA_COLLECTOR',
      createdAt: Date.now()
    };

    mockDatabase.push(newCollector);
    return newCollector;
  }

  async deactivateUser(userId: string): Promise<UserProfile> {
    const user = mockDatabase.find((entry) => entry.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    mockDatabase = mockDatabase.filter((entry) => entry.id !== userId);
    return { ...user, isActive: false };
  }

  async deleteUser(userId: string): Promise<void> {
    const exists = mockDatabase.some((entry) => entry.id === userId);
    if (!exists) {
      throw new Error('User not found');
    }
    mockDatabase = mockDatabase.filter((entry) => entry.id !== userId);
  }

  async reactivateUser(userId: string): Promise<UserProfile> {
    const user = mockDatabase.find((entry) => entry.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    return { ...user, isActive: true };
  }

  async resetPassword(userId: string): Promise<ResetPasswordResult> {
    void userId;
    return { temporaryPassword: 'MockTemp1234' };
  }

  async getCollectorSubmissions(
    userId: string,
    filter: CollectorProfileFilter,
    page: number,
    size = 25
  ): Promise<SubmissionPage> {
    void userId;
    void filter;
    void page;
    void size;
    return { items: [], totalElements: 0, page: 0, size: 25, totalPages: 0 };
  }
}
