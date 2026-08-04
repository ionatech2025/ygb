import {
  PUBLIC_VISIT_CLIENT_DEDUPE_WINDOW_MS,
  shouldSendPublicVisitBeacon,
  type PublicVisitRouteGroup,
} from '../../../core/domain/public-visit.model';

export const ANONYMOUS_VISIT_SESSION_STORAGE_KEY = 'ygb-public-anon-session-id';
export const PUBLIC_VISIT_BEACON_DEDUP_STORAGE_KEY = 'ygb-public-visit-beacon-dedupe';

type DedupeMap = Partial<Record<PublicVisitRouteGroup, number>>;

function createAnonymousSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `anon-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getOrCreateAnonymousVisitSessionId(): string {
  try {
    const existing = sessionStorage.getItem(ANONYMOUS_VISIT_SESSION_STORAGE_KEY);
    if (existing && existing.trim().length > 0) {
      return existing;
    }
    const created = createAnonymousSessionId();
    sessionStorage.setItem(ANONYMOUS_VISIT_SESSION_STORAGE_KEY, created);
    return created;
  } catch {
    return createAnonymousSessionId();
  }
}

function readDedupeMap(): DedupeMap {
  try {
    const raw = sessionStorage.getItem(PUBLIC_VISIT_BEACON_DEDUP_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return {};
    }
    return parsed as DedupeMap;
  } catch {
    return {};
  }
}

function writeDedupeMap(map: DedupeMap): void {
  try {
    sessionStorage.setItem(PUBLIC_VISIT_BEACON_DEDUP_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // fail open — storage full / private mode
  }
}

export function shouldBeaconRouteGroup(
  routeGroup: PublicVisitRouteGroup,
  nowMs: number = Date.now()
): boolean {
  const map = readDedupeMap();
  const lastSent = map[routeGroup];
  return shouldSendPublicVisitBeacon(
    typeof lastSent === 'number' ? lastSent : null,
    nowMs,
    PUBLIC_VISIT_CLIENT_DEDUPE_WINDOW_MS
  );
}

export function markRouteGroupBeaconed(
  routeGroup: PublicVisitRouteGroup,
  nowMs: number = Date.now()
): void {
  const map = readDedupeMap();
  map[routeGroup] = nowMs;
  writeDedupeMap(map);
}

export function clearPublicVisitBeaconState(): void {
  try {
    sessionStorage.removeItem(ANONYMOUS_VISIT_SESSION_STORAGE_KEY);
    sessionStorage.removeItem(PUBLIC_VISIT_BEACON_DEDUP_STORAGE_KEY);
  } catch {
    // ignore
  }
}
