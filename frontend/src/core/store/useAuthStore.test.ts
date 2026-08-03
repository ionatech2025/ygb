import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  loginOnline,
  loginOffline,
  hasOfflineProfile,
  cacheCredentials,
  getCachedTokens,
  refreshSession,
} = vi.hoisted(() => ({
  loginOnline: vi.fn(),
  loginOffline: vi.fn(),
  hasOfflineProfile: vi.fn(),
  cacheCredentials: vi.fn(),
  getCachedTokens: vi.fn(),
  refreshSession: vi.fn(),
}));

vi.mock('../../adapters/secondary/api/persistent-auth.adapter', () => ({
  PersistentAuthAdapter: class {
    loginOnline = loginOnline;
    loginOffline = loginOffline;
    hasOfflineProfile = hasOfflineProfile;
    cacheCredentials = cacheCredentials;
    getCachedTokens = getCachedTokens;
    refreshSession = refreshSession;
  },
}));

import { useAuthStore } from './useAuthStore';

const collector = {
  id: '22222222-2222-2222-2222-222222222222',
  fullName: 'Field Collector',
  phoneNumber: '0767896608',
  role: 'DATA_COLLECTOR' as const,
};

const tokens = {
  accessToken: 'cached-token',
  refreshToken: '',
  issuedAt: Date.now(),
  expiresAt: Date.now() + 60_000,
};

describe('useAuthStore offline login fallback', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    loginOnline.mockReset();
    loginOffline.mockReset();
    hasOfflineProfile.mockReset();
    cacheCredentials.mockReset();
    getCachedTokens.mockReset();
    refreshSession.mockReset();

    useAuthStore.setState({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isInitialized: true,
      isOnline: true,
    });
  });

  it('falls back to cached offline login when online fetch fails', async () => {
    loginOnline.mockRejectedValue(new TypeError('Failed to fetch'));
    hasOfflineProfile.mockResolvedValue(true);
    loginOffline.mockResolvedValue(collector);
    getCachedTokens.mockResolvedValue(tokens);

    await useAuthStore.getState().executeLogin('0767896608', 'password');

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.phoneNumber).toBe('0767896608');
    expect(state.tokens?.accessToken).toBe('cached-token');
    expect(state.isOnline).toBe(false);
    expect(loginOffline).toHaveBeenCalled();
  });

  it('does not fall back on invalid credentials', async () => {
    loginOnline.mockRejectedValue(new Error('The phone number or password you entered is incorrect.'));

    await expect(useAuthStore.getState().executeLogin('0767896608', 'wrong')).rejects.toThrow(
      /incorrect/i
    );
    expect(loginOffline).not.toHaveBeenCalled();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('persists session in localStorage so PWA reopen can restore it', async () => {
    loginOnline.mockResolvedValue({ user: collector, tokens });
    cacheCredentials.mockResolvedValue(undefined);

    await useAuthStore.getState().executeLogin('0767896608', 'password');

    expect(localStorage.getItem('ygb-auth-session')).toContain('0767896608');
    expect(sessionStorage.getItem('ygb-auth-session')).toBeNull();

    useAuthStore.setState({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isInitialized: false,
    });
    useAuthStore.getState().initialize();

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user?.phoneNumber).toBe('0767896608');
  });
});
