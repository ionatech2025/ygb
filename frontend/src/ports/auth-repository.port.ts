import { AuthenticatedUser, TokenPair } from '../core/domain/auth.model';

export interface LoginCredentials {
  phoneNumber: string;
  passwordPlain: string;
}

export interface AuthResponse {
  user: AuthenticatedUser;
  tokens: TokenPair;
}

export interface IAuthRepositoryPort {
  loginOnline(credentials: LoginCredentials): Promise<AuthResponse>;
  loginOffline(credentials: LoginCredentials): Promise<AuthenticatedUser>;
  cacheCredentials(user: AuthenticatedUser, passwordPlain: string, tokens: TokenPair): Promise<void>;
  getCachedTokens(phoneNumber: string): Promise<TokenPair | null>;
  refreshSession(refreshToken: string): Promise<TokenPair>;
  hasOfflineProfile(phoneNumber: string): Promise<boolean>;
}