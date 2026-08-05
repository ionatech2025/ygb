export const PUBLIC_VISIT_ROUTE_GROUPS = [
  'public-dashboard',
  'budget-priorities',
  'lgo-budget-allocation',
  'resources',
] as const;

export type PublicVisitRouteGroup = (typeof PUBLIC_VISIT_ROUTE_GROUPS)[number];

export interface PublicVisitBeaconPayload {
  anonymousSessionId: string;
  routeGroup: PublicVisitRouteGroup;
}

/** Client-side window aligned with server RecordPublicVisitService.DEDUPE_WINDOW. */
export const PUBLIC_VISIT_CLIENT_DEDUPE_WINDOW_MS = 60 * 60 * 1000;

export const PUBLIC_VISIT_PRIVACY_NOTICE =
  'We record anonymous page views (no names or emails) to understand how people use this open-data site.';

/**
 * Maps a browser pathname to a public visit route group.
 * Authenticated collector/admin paths return null (no public beacon).
 */
export function resolvePublicVisitRouteGroup(pathname: string): PublicVisitRouteGroup | null {
  const path = pathname.split('?')[0]?.split('#')[0] ?? '';
  const normalized = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;

  if (normalized.startsWith('/admin') || normalized.startsWith('/collector') || normalized === '/login') {
    return null;
  }

  if (normalized === '/dashboard') {
    return 'public-dashboard';
  }

  if (
    normalized === '/dashboard/budget-priorities' ||
    normalized === '/budget-priorities' ||
    normalized.startsWith('/budget-priorities/')
  ) {
    return 'budget-priorities';
  }

  if (normalized === '/dashboard/lgo-budget-allocation') {
    return 'lgo-budget-allocation';
  }

  if (normalized === '/resources' || normalized.startsWith('/resources/')) {
    return 'resources';
  }

  return null;
}

export function shouldSendPublicVisitBeacon(
  lastSentAtMs: number | null,
  nowMs: number,
  windowMs: number = PUBLIC_VISIT_CLIENT_DEDUPE_WINDOW_MS
): boolean {
  if (lastSentAtMs === null) {
    return true;
  }
  return nowMs - lastSentAtMs >= windowMs;
}
