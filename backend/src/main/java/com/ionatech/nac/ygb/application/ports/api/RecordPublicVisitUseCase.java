package com.ionatech.nac.ygb.application.ports.api;

public interface RecordPublicVisitUseCase {
    /**
     * @return true when a new visit event was persisted; false when deduped within the 1-hour window
     */
    boolean record(String anonymousSessionId, String routeGroup);
}
