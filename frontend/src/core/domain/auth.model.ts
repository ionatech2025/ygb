export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  issuedAt: number; // Timestamp ms
  expiresAt: number; // Timestamp ms
}

export interface AuthenticatedUser {
  id: string;
  fullName: string;
  phoneNumber: string;
  role: 'DATA_COLLECTOR' | 'ADMIN';
}

export interface AuthState {
  user: AuthenticatedUser | null;
  tokens: TokenPair | null;
  isOnline: boolean;
  isInitialized: boolean;
}

import { isValidUgandaPhoneLocal } from '../utils/phone-utils';

// Client-side invariant schema matching Uganda telecom formats
export function validateLoginPayload(phoneNumber: string): boolean {
  return isValidUgandaPhoneLocal(phoneNumber);
}