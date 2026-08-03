import { create } from 'zustand';
import { AuthState, AuthenticatedUser, TokenPair } from '../domain/auth.model';
import { isNetworkAuthFailure } from '../domain/auth-network';
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
  restoreCachedTokensIfNeeded(): Promise<void>;
  setOnlineStatus(status: boolean): void;
  getAccessToken(): string | null;
}

function readSession(): PersistedSession | null {
  try {
    const fromLocal = localStorage.getItem(SESSION_KEY);
    if (fromLocal) {
      return JSON.parse(fromLocal) as PersistedSession;
    }

    // Migrate older sessionStorage sessions (cleared when PWA is fully closed).
    const fromSession = sessionStorage.getItem(SESSION_KEY);
    if (fromSession) {
      localStorage.setItem(SESSION_KEY, fromSession);
      sessionStorage.removeItem(SESSION_KEY);
      return JSON.parse(fromSession) as PersistedSession;
    }

    return null;
  } catch {
    return null;
  }
}

function writeSession(user: AuthenticatedUser | null, tokens: TokenPair | null): void {
  if (!user) {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    return;
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify({ user, tokens }));
  sessionStorage.removeItem(SESSION_KEY);
}

async function completeOfflineLogin(
  phoneNumber: string,
  passwordPlain: string,
  set: (partial: Partial<AuthStoreActions>) => void
): Promise<void> {
  const hasLocalProfile = await authRepo.hasOfflineProfile(phoneNumber);
  if (!hasLocalProfile) {
    throw new Error('Initial online login required on this device');
  }

  const offlineUser = await authRepo.loginOffline({ phoneNumber, passwordPlain });
  const cachedTokens = await authRepo.getCachedTokens(offlineUser.phoneNumber);
  writeSession(offlineUser, cachedTokens);
  set({
    user: offlineUser,
    tokens: cachedTokens,
    isAuthenticated: true,
    isOnline: false,
  });
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
      try {
        const response = await authRepo.loginOnline({ phoneNumber, passwordPlain });
        await authRepo.cacheCredentials(response.user, passwordPlain, response.tokens);
        writeSession(response.user, response.tokens);
        set({ user: response.user, tokens: response.tokens, isAuthenticated: true });
        return;
      } catch (error) {
        if (!isNetworkAuthFailure(error)) {
          throw error;
        }
        // Browser reported online, but the API was unreachable (common on mobile/PWA).
        await completeOfflineLogin(phoneNumber, passwordPlain, set);
        return;
      }
    }

    await completeOfflineLogin(phoneNumber, passwordPlain, set);
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

  restoreCachedTokensIfNeeded: async () => {
    const { user, tokens, isOnline } = get();
    if (!isOnline || !user || tokens?.accessToken) {
      return;
    }

    const cachedTokens = await authRepo.getCachedTokens(user.phoneNumber);
    if (!cachedTokens?.accessToken) {
      return;
    }

    writeSession(user, cachedTokens);
    set({ tokens: cachedTokens });
  },
}));
