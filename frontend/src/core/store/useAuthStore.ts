import { create } from 'zustand';
import { AuthState, AuthenticatedUser, TokenPair } from '../domain/auth.model';
import { PersistentAuthAdapter } from '../../adapters/secondary/api/persistent-auth.adapter';

const SESSION_KEY = 'ygb-auth-session';
const authRepo = new PersistentAuthAdapter();

interface PersistedSession {
  user: AuthenticatedUser;
  tokens: TokenPair | null;
}

interface AuthStoreActions extends AuthState {
  isAuthenticated: boolean;
  executeLogin(phoneNumber: string, passwordPlain: string): Promise<void>;
  login(phoneNumber: string, passwordPlain: string): Promise<void>;
  logout(): void;
  initialize(): void;
  checkSilentRefresh(): Promise<void>;
  setOnlineStatus(status: boolean): void;
  getAccessToken(): string | null;
}

function readSession(): PersistedSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as PersistedSession) : null;
  } catch {
    return null;
  }
}

function writeSession(user: AuthenticatedUser | null, tokens: TokenPair | null): void {
  if (!user) {
    sessionStorage.removeItem(SESSION_KEY);
    return;
  }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user, tokens }));
}

export const useAuthStore = create<AuthStoreActions>((set, get) => ({
  user: null,
  tokens: null,
  isOnline: navigator.onLine,
  isInitialized: false,
  isAuthenticated: false,

  getAccessToken: () => get().tokens?.accessToken ?? null,

  setOnlineStatus: (status) => set({ isOnline: status }),

  initialize: () => {
    const session = readSession();
    if (session?.user) {
      set({
        user: session.user,
        tokens: session.tokens,
        isAuthenticated: true,
        isInitialized: true,
      });
    } else {
      set({ isInitialized: true });
    }
  },

  logout: () => {
    writeSession(null, null);
    set({ user: null, tokens: null, isAuthenticated: false });
  },

  login: async (phoneNumber, passwordPlain) => {
    await get().executeLogin(phoneNumber, passwordPlain);
  },

  executeLogin: async (phoneNumber, passwordPlain) => {
    const { isOnline } = get();

    if (isOnline) {
      const response = await authRepo.loginOnline({ phoneNumber, passwordPlain });
      await authRepo.cacheCredentials(response.user, passwordPlain, response.tokens);
      writeSession(response.user, response.tokens);
      set({ user: response.user, tokens: response.tokens, isAuthenticated: true });
      return;
    }

    const hasLocalProfile = await authRepo.hasOfflineProfile(phoneNumber);
    if (!hasLocalProfile) {
      throw new Error('Initial online login required on this device');
    }

    const offlineUser = await authRepo.loginOffline({ phoneNumber, passwordPlain });
    writeSession(offlineUser, null);
    set({ user: offlineUser, tokens: null, isAuthenticated: true });
  },

  checkSilentRefresh: async () => {
    const { tokens, isOnline } = get();
    if (!tokens || !isOnline || !tokens.refreshToken) return;

    const bufferTime = 5 * 60 * 1000;
    const tokenExpired = Date.now() >= tokens.expiresAt - bufferTime;

    if (tokenExpired) {
      try {
        const renewedTokens = await authRepo.refreshSession(tokens.refreshToken);
        const { user } = get();
        if (user) {
          writeSession(user, renewedTokens);
        }
        set({ tokens: renewedTokens });
      } catch {
        get().logout();
      }
    }
  },
}));
