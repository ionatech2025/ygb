import { apiFetch } from '../../../core/api/api-client';
import type { PublicVisitBeaconPayload } from '../../../core/domain/public-visit.model';
import type { IPublicVisitBeaconApiPort } from '../../../ports/public-visit-beacon-api.port';

export class HttpPublicVisitBeaconAdapter implements IPublicVisitBeaconApiPort {
  async recordVisit(payload: PublicVisitBeaconPayload): Promise<void> {
    await apiFetch<void>('/api/v1/public/analytics/visit', {
      method: 'POST',
      body: JSON.stringify({
        anonymousSessionId: payload.anonymousSessionId,
        routeGroup: payload.routeGroup,
      }),
    });
  }
}
