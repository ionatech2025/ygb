import Dexie, { Table } from 'dexie';
import { IAuthRepositoryPort, LoginCredentials, AuthResponse } from '../../../ports/auth-repository.port';
import { AuthenticatedUser, TokenPair } from '../../../core/domain/auth.model';

// Initialize a lightweight IndexedDB workspace via Dexie
class YGBAuthDatabase extends Dexie {
  cachedUsers!: Table<{
    phoneNumber: string;
    id: string;
    fullName: string;
    role: string;
    passwordHash: string;
    cachedTokens: TokenPair;
  }, string>;

  constructor() {
    super('YGBAuthDatabase');
    this.version(1).stores({
      cachedUsers: 'phoneNumber'
    });
  }
}

const db = new YGBAuthDatabase();

export class PersistentAuthAdapter implements IAuthRepositoryPort {
  
  // Helper utility to hash password locally avoiding plain-text exposure
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async hasOfflineProfile(phoneNumber: string): Promise<boolean> {
    const cached = await db.cachedUsers.get(phoneNumber);
    return !!cached;
  }

  async loginOnline(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulated remote API callback network handshake
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.passwordPlain === 'Password123' && credentials.phoneNumber === '0772123456') {
          const now = Date.now();
          resolve({
            user: {
              id: 'dc-991',
              fullName: 'Jane Nakato',
              phoneNumber: credentials.phoneNumber,
              role: 'DATA_COLLECTOR'
            },
            tokens: {
              accessToken: 'mock-jwt-access-token',
              refreshToken: 'mock-jwt-refresh-token',
              issuedAt: now,
              expiresAt: now + 24 * 60 * 60 * 1000 // 24 Hours
            }
          });
        } else {
          reject(new Error('invalid phone number or password'));
        }
      }, 800);
    });
  }

  async cacheCredentials(user: AuthenticatedUser, passwordPlain: string, tokens: TokenPair): Promise<void> {
    const passwordHash = await this.hashPassword(passwordPlain);
    await db.cachedUsers.put({
      phoneNumber: user.phoneNumber,
      id: user.id,
      fullName: user.fullName,
      role: user.role,
      passwordHash,
      cachedTokens: tokens
    });
  }

  async loginOffline(credentials: LoginCredentials): Promise<AuthenticatedUser> {
    const cachedProfile = await db.cachedUsers.get(credentials.phoneNumber);
    
    if (!cachedProfile) {
      throw new Error('Initial online login required on this device');
    }

    const verificationHash = await this.hashPassword(credentials.passwordPlain);
    if (verificationHash !== cachedProfile.passwordHash) {
      throw new Error('invalid phone number or password');
    }

    return {
      id: cachedProfile.id,
      fullName: cachedProfile.fullName,
      phoneNumber: cachedProfile.phoneNumber,
      role: cachedProfile.role as 'DATA_COLLECTOR' | 'ADMIN'
    };
  }

  async refreshSession(refreshToken: string): Promise<TokenPair> {
    if (!refreshToken) throw new Error('Invalid Refresh Token');
    const now = Date.now();
    return {
      accessToken: 'new-silent-jwt-access-token-' + now,
      refreshToken: refreshToken,
      issuedAt: now,
      expiresAt: now + 24 * 60 * 60 * 1000
    };
  }
}