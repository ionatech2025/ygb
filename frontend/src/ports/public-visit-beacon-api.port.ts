import type { PublicVisitBeaconPayload } from '../core/domain/public-visit.model';

export interface IPublicVisitBeaconApiPort {
  recordVisit(payload: PublicVisitBeaconPayload): Promise<void>;
}
