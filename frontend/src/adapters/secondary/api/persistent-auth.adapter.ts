import Dexie, { Table } from 'dexie';
import { IAuthRepositoryPort, LoginCredentials, AuthResponse } from '../../../ports/auth-repository.port';
import { AuthenticatedUser, TokenPair } from '../../../core/domain/auth.model';
import { apiFetch, ApiError } from '../../../core/api/api-client';
import { decodeJwtPayload } from '../../../core/api/jwt-utils';
import { normalizeUgandaPhoneLocal } from '../../../core/utils/phone-utils';

class YGBAuthDatabase extends Dexie {
  cachedUsers!: Table<
    {
      phoneNumber: string;
      id: string;
      fullName: string;
      role: string;
      passwordHash: string;
      cachedTokens: TokenPair;
    },
    string
  >;

  constructor() {
    super('YGBAuthDatabase');
    this.version(1).stores({
      cachedUsers: 'phoneNumber',
    });
  }
}

const db = new YGBAuthDatabase();

interface BackendAuthResponse {
  token: string;
}

function roleDisplayName(role: AuthenticatedUser['role']): string {
  return role === 'ADMIN' ? 'Administrator' : 'Field Collector';
}

function buildUserFromToken(token: string, phoneNumber: string): { user: AuthenticatedUser; tokens: TokenPair } {
  const claims = decodeJwtPayload(token);
  const issuedAt = claims.iat ? claims.iat * 1000 : Date.now();
  const expiresAt = claims.exp ? claims.exp * 1000 : issuedAt + 24 * 60 * 60 * 1000;

  return {
    user: {
      id: claims.sub,
      fullName: roleDisplayName(claims.role),
      phoneNumber,
      role: claims.role,
    },
    tokens: {
      accessToken: token,
      refreshToken: '',
      issuedAt,
      expiresAt,
    },
  };
}

export class PersistentAuthAdapter implements IAuthRepositoryPort {
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async hasOfflineProfile(phoneNumber: string): Promise<boolean> {
    const normalized = normalizeUgandaPhoneLocal(phoneNumber);
    const cached = await db.cachedUsers.get(normalized);
    return !!cached;
  }

  async loginOnline(credentials: LoginCredentials): Promise<AuthResponse> {
    const phoneNumber = normalizeUgandaPhoneLocal(credentials.phoneNumber);

    try {
      const response = await apiFetch<BackendAuthResponse>('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          phoneNumber,
          password: credentials.passwordPlain,
        }),
      });

      const { user, tokens } = buildUserFromToken(response.token, phoneNumber);
      return { user, tokens };
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        throw new Error('The phone number or password you entered is incorrect.');
      }
      throw error instanceof Error ? error : new Error('Unable to sign in right now.');
    }
  }

  async cacheCredentials(user: AuthenticatedUser, passwordPlain: string, tokens: TokenPair): Promise<void> {
    const passwordHash = await this.hashPassword(passwordPlain);
    await db.cachedUsers.put({
      phoneNumber: user.phoneNumber,
      id: user.id,
      fullName: user.fullName,
      role: user.role,
      passwordHash,
      cachedTokens: tokens,
    });
  }

  async loginOffline(credentials: LoginCredentials): Promise<AuthenticatedUser> {
    const phoneNumber = normalizeUgandaPhoneLocal(credentials.phoneNumber);
    const cachedProfile = await db.cachedUsers.get(phoneNumber);

    if (!cachedProfile) {
      throw new Error('Initial online login required on this device');
    }

    const verificationHash = await this.hashPassword(credentials.passwordPlain);
    if (verificationHash !== cachedProfile.passwordHash) {
      throw new Error('The phone number or password you entered is incorrect.');
    }

    return {
      id: cachedProfile.id,
      fullName: cachedProfile.fullName,
      phoneNumber: cachedProfile.phoneNumber,
      role: cachedProfile.role as AuthenticatedUser['role'],
    };
  }

  async refreshSession(refreshToken: string): Promise<TokenPair> {
    if (!refreshToken) throw new Error('Invalid Refresh Token');
    const now = Date.now();
    return {
      accessToken: 'offline-session',
      refreshToken,
      issuedAt: now,
      expiresAt: now + 24 * 60 * 60 * 1000,
    };
  }
}
