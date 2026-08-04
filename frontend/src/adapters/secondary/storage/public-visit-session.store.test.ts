import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearPublicVisitBeaconState,
  getOrCreateAnonymousVisitSessionId,
  markRouteGroupBeaconed,
  shouldBeaconRouteGroup,
} from './public-visit-session.store';

describe('public-visit-session.store', () => {
  beforeEach(() => {
    sessionStorage.clear();
    clearPublicVisitBeaconState();
  });

  it('reuses the same anonymous session id within sessionStorage', () => {
    const first = getOrCreateAnonymousVisitSessionId();
    const second = getOrCreateAnonymousVisitSessionId();
    expect(first).toBe(second);
    expect(first.length).toBeGreaterThan(8);
  });

  it('dedupes beacon sends per route group within the client window', () => {
    const now = 5_000_000;
    expect(shouldBeaconRouteGroup('public-dashboard', now)).toBe(true);
    markRouteGroupBeaconed('public-dashboard', now);
    expect(shouldBeaconRouteGroup('public-dashboard', now + 60_000)).toBe(false);
    expect(shouldBeaconRouteGroup('resources', now + 60_000)).toBe(true);
    expect(shouldBeaconRouteGroup('public-dashboard', now + 3_600_000)).toBe(true);
  });
});
