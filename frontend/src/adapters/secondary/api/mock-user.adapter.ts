import type { UserRepositoryPort } from '../../../ports/user-repository.port';
import type { User, UserRole } from '../../../core/domain/user.model';

type CreateDataCollectorInput = Pick<User, 'fullName' | 'phoneNumber'>;

const INITIAL_USERS: User[] = [
  { 
    id: '1', 
    fullName: 'Allan Baliddawa', 
    phoneNumber: '0772123456', 
    role: 'DATA_COLLECTOR', 
    status: 'ACTIVE', 
    createdByAdminId: 'seed-admin-01' 
  }
];

export class MockUserAdapter implements UserRepositoryPort {
  private getStorageUsers(): User[] {
    const data = localStorage.getItem('ygb_mock_users');
    if (!data) {
      localStorage.setItem('ygb_mock_users', JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(data);
  }

  // Accepts an optional tracking Admin ID parameter
  async createDataCollector(input: CreateDataCollectorInput, createdByAdminId?: string): Promise<User> {
    const users = this.getStorageUsers();

    // Invariant Check: Reject duplicate phone number
    const duplicate = users.find(u => u.phoneNumber === input.phoneNumber);
    if (duplicate) {
      throw new Error('Phone number already registered');
    }

    const creatorId = createdByAdminId ?? 'seed-admin-01';

    const newUser: User = {
      id: Math.random().toString(36).substring(2, 11),
      fullName: input.fullName,
      phoneNumber: input.phoneNumber,
      role: 'DATA_COLLECTOR',
      status: 'ACTIVE',
      createdByAdminId: creatorId
    };

    users.push(newUser);
    localStorage.setItem('ygb_mock_users', JSON.stringify(users));
    return newUser;
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    return this.getStorageUsers().filter(u => u.role === role);
  }
}