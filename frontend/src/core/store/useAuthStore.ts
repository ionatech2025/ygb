import { create } from 'zustand';
import { AuthState, AuthenticatedUser, TokenPair } from '../domain/auth.model';
import { PersistentAuthAdapter } from '../../adapters/secondary/api/persistent-auth.adapter';

interface AuthStoreActions extends AuthState {
  executeLogin(phoneNumber: string, passwordPlain: string): Promise<void>;
  checkSilentRefresh(): Promise<void>;
  setOnlineStatus(status: boolean): void;
}

const authRepo = new PersistentAuthAdapter();

export const useAuthStore = create<AuthStoreActions>((set, get) => ({
  user: null,
  tokens: null,
  isOnline: navigator.onLine,
  isInitialized: false,

  setOnlineStatus: (status) => set({ isOnline: status }),

  executeLogin: async (phoneNumber, passwordPlain) => {
    const { isOnline } = get();

    if (isOnline) {
      try {
        const response = await authRepo.loginOnline({ phoneNumber, passwordPlain });
        // Cache credentials into IndexedDB for offline parity rules
        await authRepo.cacheCredentials(response.user, passwordPlain, response.tokens);
        
        set({ user: response.user, tokens: response.tokens });
      } catch (error: any) {
        throw new Error(error.message);
      }
    } else {
      // Offline fallback handling implementation
      const hasLocalProfile = await authRepo.hasOfflineProfile(phoneNumber);
      if (!hasLocalProfile) {
        throw new Error('Initial online login required on this device');
      }

      try {
        const offlineUser = await authRepo.loginOffline({ phoneNumber, passwordPlain });
        set({ user: offlineUser, tokens: null }); // Null tokens reinforce offline boundary state
      } catch (error: any) {
        throw new Error(error.message);
      }
    }
  },

  checkSilentRefresh: async () => {
    const { tokens, isOnline } = get();
    if (!tokens || !isOnline) return;

    const bufferTime = 5 * 60 * 1000; // 5 minute execution window
    const tokenExpired = Date.now() >= (tokens.expiresAt - bufferTime);

    if (tokenExpired) {
      try {
        const renewedTokens = await authRepo.refreshSession(tokens.refreshToken);
        set({ tokens: renewedTokens });
        console.log('Token silently refreshed successfully.');
      } catch {
        set({ user: null, tokens: null }); // Invalidate corrupt session
      }
    }
  }
}));