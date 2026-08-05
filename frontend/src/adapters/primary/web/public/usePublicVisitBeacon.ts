import { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { resolvePublicVisitRouteGroup } from '../../../../core/domain/public-visit.model';
import type { IPublicVisitBeaconApiPort } from '../../../../ports/public-visit-beacon-api.port';
import { HttpPublicVisitBeaconAdapter } from '../../../secondary/api/public-visit-beacon-api.adapter';
import {
  getOrCreateAnonymousVisitSessionId,
  markRouteGroupBeaconed,
  shouldBeaconRouteGroup,
} from '../../../secondary/storage/public-visit-session.store';

/**
 * Emits anonymous public visit beacons on route enter.
 * Fail-open: network/API errors never surface to UX.
 */
export function usePublicVisitBeacon(api?: IPublicVisitBeaconApiPort): void {
  const location = useLocation();
  const adapter = useMemo(() => api ?? new HttpPublicVisitBeaconAdapter(), [api]);
  const adapterRef = useRef(adapter);
  adapterRef.current = adapter;

  useEffect(() => {
    const routeGroup = resolvePublicVisitRouteGroup(location.pathname);
    if (!routeGroup) {
      return;
    }
    if (!shouldBeaconRouteGroup(routeGroup)) {
      return;
    }

    const anonymousSessionId = getOrCreateAnonymousVisitSessionId();
    // Mark before the request so rapid remounts / navigations do not double-fire.
    markRouteGroupBeaconed(routeGroup);

    void adapterRef.current
      .recordVisit({ anonymousSessionId, routeGroup })
      .catch(() => {
        // fail open
      });
  }, [location.pathname]);
}
