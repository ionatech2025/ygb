import { IUserRepositoryPort, CreateCollectorPayload } from '../../../ports/user-repository.port';
import { UserProfile } from '../../../core/domain/user.model';
import { useAuthStore } from '../../../core/store/useAuthStore';

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
    const isOnline = navigator.onLine;

    if (isOnline) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const token = useAuthStore.getState().tokens?.accessToken;

      const response = await fetch(`${apiUrl}/api/v1/admin/users/data-collectors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          name: payload.fullName,
          phoneNumber: payload.phoneNumber,
          password: payload.password || 'password',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create data collector');
      }

      const data = await response.json();
      const newCollector: UserProfile = {
        id: data.id,
        fullName: data.name,
        phoneNumber: data.phoneNumber,
        role: data.role,
        createdAt: data.createdAt ? new Date(data.createdAt).getTime() : Date.now(),
      };

      mockDatabase.push(newCollector);
      return newCollector;
    } else {
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
}