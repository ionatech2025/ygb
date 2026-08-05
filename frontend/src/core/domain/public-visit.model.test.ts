import { describe, expect, it } from 'vitest';
import {
  resolvePublicVisitRouteGroup,
  shouldSendPublicVisitBeacon,
} from './public-visit.model';

describe('public-visit.model', () => {
  it('maps public dashboard and related routes to route groups', () => {
    expect(resolvePublicVisitRouteGroup('/dashboard')).toBe('public-dashboard');
    expect(resolvePublicVisitRouteGroup('/dashboard/budget-priorities')).toBe('budget-priorities');
    expect(resolvePublicVisitRouteGroup('/budget-priorities')).toBe('budget-priorities');
    expect(resolvePublicVisitRouteGroup('/budget-priorities/health')).toBe('budget-priorities');
    expect(resolvePublicVisitRouteGroup('/dashboard/lgo-budget-allocation')).toBe(
      'lgo-budget-allocation'
    );
    expect(resolvePublicVisitRouteGroup('/resources')).toBe('resources');
    expect(resolvePublicVisitRouteGroup('/resources/guide')).toBe('resources');
  });

  it('does not beacon collector or admin authenticated app areas', () => {
    expect(resolvePublicVisitRouteGroup('/collector/dashboard')).toBeNull();
    expect(resolvePublicVisitRouteGroup('/collector/lgo-budget-allocation')).toBeNull();
    expect(resolvePublicVisitRouteGroup('/admin/dashboard')).toBeNull();
    expect(resolvePublicVisitRouteGroup('/admin/submissions')).toBeNull();
    expect(resolvePublicVisitRouteGroup('/login')).toBeNull();
  });

  it('dedupes repeat beacons within the client window', () => {
    const sentAt = 1_000_000;
    expect(shouldSendPublicVisitBeacon(null, sentAt)).toBe(true);
    expect(shouldSendPublicVisitBeacon(sentAt, sentAt + 60_000)).toBe(false);
    expect(shouldSendPublicVisitBeacon(sentAt, sentAt + 3_600_000)).toBe(true);
  });
});
