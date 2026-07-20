import { IUserRepositoryPort, CreateCollectorPayload } from '../../../ports/user-repository.port';
import { UserProfile } from '../../../core/domain/user.model';

// In-memory collection simulation to let newly created collectors persist during testing
let mockDatabase: UserProfile[] = [
  { id: 'dc-01', fullName: 'Jane Nakato', phoneNumber: '+256772123456', role: 'DATA_COLLECTOR', createdAt: Date.now() }
];

export class MockUserAdapter implements IUserRepositoryPort {
  
  async fetchActiveCollectors(): Promise<UserProfile[]> {
    return [...mockDatabase];
  }

  async createDataCollector(payload: CreateCollectorPayload, adminId: string): Promise<UserProfile> {
    void adminId;
    void payload.password;
    // TC-AUTH-01-02 Simulation: Reject duplicate phone configurations
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
}